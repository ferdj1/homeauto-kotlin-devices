# About
Repository contains device models that will communicate with server created in homeauto-kotlin repository.
Each device can be modelled using any language with the reflection capabilities. Most of the devices are made using NodeJS for simplicity.
Each device is based on a deviceLifecycle.sh script that simulates workflow of the device. Other important files are desc.json that describes device(ID, name, manufacturer, commands, etc.) and device.js(or other language-specific file) that represents main device program that will contain all the device functions and will be able to communicate using WebSocket protocol.
 

## How device models work
Each device has a deviceLifecycle.sh file that is a simple Bash script with the purpose of creating a WiFi hotspot and serving a configuration server where user can give needed information to the device so it can connect to a WiFi network and create a WebSocket connection with the main server. After it receives needed information, it shuts down the configuration server and WiFi access point and connects to main server's network and server itself.
Connecting to a WebSocket server is done by passing needed information about WebSocket server to a device.js NodeJS program.

Communication starts by a device which sends its desc.json file which contains all the needed info for communication.
Commands are executed either by a device internally or by receiving 'executeCommand' message from the server.

