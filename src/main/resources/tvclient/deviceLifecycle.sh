# TODO: Perform checking on credentials.txt, info can be wrong inside the file

# Check connection status
getConnectionStatus() {
    if test $(nmcli networking connectivity) = "none" -o $(nmcli networking connectivity) = "unknown";
    then
        echo "DISCONNECTED"
    else
        echo "CONNECTED"
    fi
}

# Read credentials from file
readCredentials() {
    ssid=$(sed -n '1p' < credentials.txt)
    password=$(sed -n '2p' < credentials.txt)
    echo 'Credentials:'
    echo "  SSID: $ssid"
    echo "  Password: $password"
}

# Shuts down everything before exiting
cleanup() {
    #Kill device
    echo 'Shutting down device program...'
    kill -9 $DEVICE_PID

    # Kill Server
    echo 'Shutting down Server...'
    kill -9 $SERVER_PID

    # Kill AP
    echo 'Shutting down Access Point...'
    nmcli connection down sonySmartTV43HD-Init53564

    sleep 5
    kill -9 $$
}

trap cleanup EXIT
trap cleanup SIGINT

if [ "$(getConnectionStatus)" != "CONNECTED" ] ;
then
    echo "No connection. Checking if credentials.txt exists..."
    # Check if credentials.txt exists
    if test -e credentials.txt ; then
        readCredentials

        # Connect to WiFi using given credentials
        sleep 5
        echo 'Connecting to a new network...'
        nmcli connection show $ssid > /dev/null

        if [ $? != 0 ]; then
            echo 'Creating new connection profile...'
            nmcli device wifi connect $ssid password $password
        else
            echo 'Connection profile found. Using it to connect...'
            nmcli connection up $ssid
        fi

        sleep 10
        echo "Connected to server's network"
        serverIp=$(sed -n '3p' < credentials.txt)
        serverPort=$(sed -n '4p' < credentials.txt)
        node device.js $serverIp $serverPort &
        DEVICE_PID=$!
    else
        echo "No connection. Setting up Access Point and Server..."
        # Setup Access Point (This will create AP that will create website accessible on 10.42.0.1:3000)
        nmcli connection show sonySmartTV43HD-Init53564 > /dev/null
        if [ $? != 0 ]; then
            nmcli device wifi hotspot con-name sonySmartTV43HD-Init53564 ssid sonySmartTV43HD-Init53564 band bg password sstvws43hd535
        else
            nmcli connection up sonySmartTV43HD-Init53564
        fi

        echo 'Access Point is running!'
        # Start server on localhost:3000 (Network: 10.42.0.1:3000)
        sleep 5
        node server/index.js &
        SERVER_PID=$!
        echo "Server is up on localhost:3000 (Network: 10.42.0.1:3000) (process ID: $SERVER_PID)"

        # Wait for credentials
        while [ getConnectionStatus != "CONNECTED" ]
        do
            # Check if file credentials.txt exists
            if test -e credentials.txt ; then
                ### Read file and connect to main server's network (also kill AP)

                readCredentials

                # Kill Server
                echo 'Shutting down Server...'
                kill -9 $SERVER_PID

                # Kill AP
                echo 'Shutting down Access Point...'
                nmcli connection down sonySmartTV43HD-Init53564

                # Connect to WiFi using given credentials
                sleep 5
                echo 'Connecting to a new network...'
                nmcli connection show $ssid > /dev/null

                if [ $? != 0 ]; then
                    echo 'Creating new connection profile...'
                    nmcli device wifi connect $ssid password $password
                else
                    echo 'Connection profile found. Using it to connect...'
                    nmcli connection up $ssid
                fi

                break
            fi
            sleep 10
        done
        echo "Connected to server's network"
        serverIp=$(sed -n '3p' < credentials.txt)
        serverPort=$(sed -n '4p' < credentials.txt)
        node device.js $serverIp $serverPort &
        DEVICE_PID=$!
    fi
else 
    echo "Connected to server's network"
    # Run main program, argument is the websocket address
    serverIp=$(sed -n '3p' < credentials.txt)
    serverPort=$(sed -n '4p' < credentials.txt)
    node device.js $serverIp $serverPort &
    DEVICE_PID=$!
fi
