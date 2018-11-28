# About
Devices models that will communicate with server created in homeauto-kotlin repo

## Idea

Devices need to communicate with the homeauto server by using WebSockets and JSON technologies.
Communication specification is loosely defined in docs folder of the 'homeauto-kotlin' repo.

Devices do not have to implement any interfaces(as in Java interfaces), rather they must follow rules on how to react on certain JSON message types.
This means that devices written in statically typed languages such as C#, Java, Kotlin, etc. will heavily rely on reflection.
Hypothetical manufacturer of the device will need to create a tool that will handle JSON messages using reflection. 

Currently, server information will be hardcoded inside client. Later, there will be a mechanism implemented that will find the server on its own.
 