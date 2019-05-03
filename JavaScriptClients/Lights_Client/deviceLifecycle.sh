if test $(nmcli networking connectivity) = "none" -o $(nmcli networking connectivity) = "unknown" ;
    then
        echo "No connection. Setting up Access Point and Server..."
        # Setup Access Point (This will create AP that will create website accessible on 10.42.0.1:3000)
        nmcli device wifi hotspot con-name philipsLights-Init53564 ssid philipsLights-Init53564 band bg password pltvws43hd535
        echo 'Access Point is running!'
        # Start server on localhost:3000
        node server/index.js &
        NODE_PID=$!
        echo "Server is up on localhost:3000(Network: 10.42.0.1:3000) (process ID: $NODE_PID)"

        # Wait for credentials
        while test $(nmcli networking connectivity) = "none" -o $(nmcli networking connectivity) = "unknown"
        do
            # Check if file credentials.txt exists
            if test -e credentials.txt ; then
                ### Read file and connect to main server's network (also kill AP)

                # Read credentials from file
                ssid=$(sed -n '1p' < credentials.txt)
                password=$(sed -n '2p' < credentials.txt)
                echo 'Credentials:'
                echo "  SSID: $ssid"
                echo "  Password: $password"

                # Kill AP
                echo 'Shutting down Access Point...'
                nmcli connection down philipsLights-Init53564

                # Kill Server
                echo 'Shutting down Server...'
                kill -9 $NODE_PID

                # Connect to WiFi using given credentials
                sleep 5
                echo 'Connecting to a new network...'
                nmcli device wifi connect $ssid password $password
                break
            fi
            sleep 10
        done
        echo "Connected"
        node device.js &

    else 
        echo "Connected"
        # Run main program, argument is the websocket address
        node device.js &
fi

