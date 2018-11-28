#!/usr/bin/env node
var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

//local settings
var intensity = 1.0;
var color = '#ffffff';
var tempo = 'None';
var power = 'OFF';
var lightsPower = [true, true, true, true, true]

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
                "id": "philips-smartLights2",
                "name": "Philips SmartLights 2",
                "manufacturer": "Philips",
                "type": "Lights",
                "commands": [
                    {
                        "id": "turnOn",
                        "name": "Turn On",
                        "description": "Turns lights on",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "turnOff",
                        "name": "Turn Off",
                        "description": "Turns lights off",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "changeIntensity",
                        "name": "Change Intensity",
                        "description": "Changes intensity of the lights",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [
                            {
                                "name": "Intensity",
                                "type": "number",
                                "limitType": "MIN_MAX",
                                "min": "0.0",
                                "max": "1.0",
                                "values": null,
                                "defaultValue": "1.0"
                            }
                        ],
                        "returnType": null
                    },
                    {
                        "id": "changeColor",
                        "name": "Change Color",
                        "description": "Changes color of the lights",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [
                            {
                                "name": "Color",
                                "type": "string",
                                "limitType": "NO_LIMIT",
                                "min": null,
                                "max": null,
                                "values": null,
                                "defaultValue": "#ffffff"
                            }
                        ],
                        "returnType": null
                    },
                    {
                        "id": "changeTempo",
                        "name": "Change Tempo",
                        "description": "Changes tempo mode of the lights",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [
                            {
                                "name": "Tempo",
                                "type": "string",
                                "limitType": "LIMITED_SET",
                                "min": null,
                                "max": null,
                                "values": ["None", "Slow", "Medium", "Fast", "Very Fast"],
                                "defaultValue": "None"
                            }
                        ],
                        "returnType": null
                    },
                    {
                        "id": "pickLights",
                        "name": "Pick Lights",
                        "description": "Pick which of the five lights will be turned on",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [
                            {
                                "name": "Light1",
                                "type": "boolean",
                                "limitType": "UNDEFINED",
                                "min": null,
                                "max": null,
                                "values": null,
                                "defaultValue": "true"
                            },
                            {
                                "name": "Light2",
                                "type": "boolean",
                                "limitType": "UNDEFINED",
                                "min": null,
                                "max": null,
                                "values": null,
                                "defaultValue": "true"
                            },
                            {
                                "name": "Light3",
                                "type": "boolean",
                                "limitType": "UNDEFINED",
                                "min": null,
                                "max": null,
                                "values": null,
                                "defaultValue": "true"
                            },
                            {
                                "name": "Light4",
                                "type": "boolean",
                                "limitType": "UNDEFINED",
                                "min": null,
                                "max": null,
                                "values": null,
                                "defaultValue": "true"
                            },
                            {
                                "name": "Light5",
                                "type": "boolean",
                                "limitType": "UNDEFINED",
                                "min": null,
                                "max": null,
                                "values": null,
                                "defaultValue": "true"
                            }
                        ],
                        "returnType": null
                    },
                    {
                        "id": "getIntensity",
                        "name": "Get Intensity",
                        "description": "Gets currently set intensity",
                        "getSetType": "GET",
                        "displayText": "Intensity",
                        "parameterDescriptions": [],
                        "returnType": "number"
                    },
                    {
                        "id": "getColor",
                        "name": "Get Color",
                        "description": "Gets currently set color",
                        "getSetType": "GET",
                        "displayText": "Color",
                        "parameterDescriptions": [],
                        "returnType": "string"
                    },
                    {
                        "id": "getTempo",
                        "name": "Get Tempo",
                        "description": "Gets currently set tempo",
                        "getSetType": "GET",
                        "displayText": "Tempo",
                        "parameterDescriptions": [],
                        "returnType": "string"
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
    let resultJSON = {
        "messageType": 'clientToServerExecutedCommand',
        "deviceId": jsonObject.deviceId,
        "commandId": jsonObject.commandId,
        "parameters": jsonObject.parameters,
        "result": resultString
    }

    return resultJSON
}

function turnOn() {
    power = 'ON';
    console.log('Turning TV on...');
}

function turnOff() {
    power = 'OFF';
    console.log('Turning TV off...');
}

function changeIntensity(ints) {
    if (intensity >= 0.0 && intensity <= 1.0) {
        intensity = ints;
        console.log('Changing volume to ' + intensity);
    }
}

function changeColor(col) {
    color = col;
    console.log('Changing color to ' + color);
}

function changeTempo(tem) {
    tempo = tem;
    console.log('Changing tempo to ' + tempo);
}

function pickLights(light1, light2, light3, light4, light5) {
    lightsPower[0] = light1
    lightsPower[1] = light2
    lightsPower[2] = light3
    lightsPower[3] = light4
    lightsPower[4] = light5
}

function getIntensity() {
    //console.log('Get intensity: ' + intensity);
    return intensity;
}

function getColor() {
    //console.log('Get color: ' + color);
    return color;
}

function getTempo() {
    //console.log('Get tempo: ' + tempo);
    return tempo;
}

client.connect('ws://localhost:8080/ws');