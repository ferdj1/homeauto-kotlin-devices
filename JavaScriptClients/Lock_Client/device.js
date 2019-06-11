#!/usr/bin/env node
var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

//local settings
var locked = [true, true, true];
var power = 'OFF';

client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            let resultJSON = handleMessage(message.utf8Data)
            sendMessage(resultJSON)
        }
    });

    function sendMessage(json) {
        if (connection.connected) {
            connection.sendUTF(JSON.stringify(json));
        }
    }

    function sendJSON() {
        if (connection.connected) {
            var json = {
                "messageType": "description",
                "id": "homeLockSystems-lockSys-LS2535010",
                "name": "HomeLock Systems LockSys LS2",
                "manufacturer": "HomeLock Systems",
                "type": "Security",
                "commands": [
                    {
                        "id": "turnOn",
                        "name": "Turn On",
                        "description": "Turns security system on",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "turnOff",
                        "name": "Turn Off",
                        "description": "Turns security system off",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "lockAll",
                        "name": "Lock All",
                        "description": "Lock all entrances",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "unlockAll",
                        "name": "Unlock All",
                        "description": "Unlock all entrances",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "lockEntrance1",
                        "name": "Lock Entrance 1",
                        "description": "Locks entrance number 1",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "unlockEntrance1",
                        "name": "Unlock Entrance 1",
                        "description": "Unlocks entrance number 1",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "lockEntrance2",
                        "name": "Lock Entrance 2",
                        "description": "Locks entrance number 2",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "unlockEntrance2",
                        "name": "Unlock Entrance 2",
                        "description": "Unlocks entrance number 2",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "lockEntrance3",
                        "name": "Lock Entrance 3",
                        "description": "Locks entrance number 3",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "unlockEntrance3",
                        "name": "Unlock Entrance 3",
                        "description": "Unlocks entrance number 3",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "getLockStatusEntrance1",
                        "name": "Get Lock Status Entrance 1",
                        "description": "Gets lock status of entrance 1",
                        "getSetType": "GET",
                        "displayText": "Locked entrance 1",
                        "parameterDescriptions": [],
                        "returnType": "boolean"
                    },
                    {
                        "id": "getLockStatusEntrance2",
                        "name": "Get Lock Status Entrance 2",
                        "description": "Gets lock status of entrance 2",
                        "getSetType": "GET",
                        "displayText": "Locked entrance 2",
                        "parameterDescriptions": [],
                        "returnType": "boolean"
                    },
                    {
                        "id": "getLockStatusEntrance3",
                        "name": "Get Lock Status Entrance 3",
                        "description": "Gets lock status of entrance 3",
                        "getSetType": "GET",
                        "displayText": "Locked entrance 3",
                        "parameterDescriptions": [],
                        "returnType": "boolean"
                    }
                ]
            };

            connection.sendUTF(JSON.stringify(json));
        }
    }

    sendJSON();
});

function handleMessage(msg) {
    let jsonObject = JSON.parse(msg)
    let resultString = eval(jsonObject.commandId)(...jsonObject.parameters)
    let messageType = 'clientToServerExecutedCommand'

    let resultJSON = {
        "messageType": messageType,
        "deviceId": jsonObject.deviceId,
        "commandId": jsonObject.commandId,
        "parameters": jsonObject.parameters,
        "result": resultString
    }

    return resultJSON
}

function turnOn() {
    power = 'ON';
    console.log('Turning security system on...');
}

function turnOff() {
    power = 'OFF';
    console.log('Turning security system off...');
}

function lockAll() {
    locked[0] = true
    locked[1] = true
    locked[2] = true
    console.log('Locking all entrances...');
}

function unlockAll() {
    locked[0] = false
    locked[1] = false
    locked[2] = false
    console.log('Unlocking all entrances...');
}

function lockEntrance1() {
    locked[0] = true
    console.log('Locking entrance 1...')
}

function unlockEntrance1() {
    locked[0] = false
    console.log('Unlocking entrance 1...')
}

function lockEntrance2() {
    locked[1] = true
    console.log('Locking entrance 2...')
}

function unlockEntrance2() {
    locked[1] = false
    console.log('Unlocking entrance 2...')
}

function lockEntrance3() {
    locked[2] = true
    console.log('Locking entrance 3...')
}

function unlockEntrance3() {
    locked[2] = false
    console.log('Unlocking entrance 3...')
}

function getLockStatusEntrance1() {
    return locked[0]
}

function getLockStatusEntrance2() {
    return locked[1]
}

function getLockStatusEntrance3() {
    return locked[2]
}

var ip = process.argv[2]
var port = process.argv[3]
client.connect('ws://' + ip + ':' + port + '/ws');