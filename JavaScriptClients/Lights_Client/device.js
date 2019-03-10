#!/usr/bin/env node
var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

//local settings
var intensity = 100;
var color = '#ffffff';
var tempo = 'None';
var power = 'OFF';
var lightsPower = ['ON', 'ON', 'ON', 'ON', 'ON']

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
                                "type": "integer",
                                "specialType": null,
                                "limitType": "MIN_MAX",
                                "min": "0",
                                "max": "100",
                                "values": null,
                                "defaultValue": "100"
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
                                "specialType": "color",
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
                                "specialType": null,
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
                                "specialType": null,
                                "limitType": "UNDEFINED",
                                "min": null,
                                "max": null,
                                "values": null,
                                "defaultValue": true
                            },
                            {
                                "name": "Light2",
                                "type": "boolean",
                                "specialType": null,
                                "limitType": "UNDEFINED",
                                "min": null,
                                "max": null,
                                "values": null,
                                "defaultValue": true
                            },
                            {
                                "name": "Light3",
                                "type": "boolean",
                                "specialType": null,
                                "limitType": "UNDEFINED",
                                "min": null,
                                "max": null,
                                "values": null,
                                "defaultValue": true
                            },
                            {
                                "name": "Light4",
                                "type": "boolean",
                                "specialType": null,
                                "limitType": "UNDEFINED",
                                "min": null,
                                "max": null,
                                "values": null,
                                "defaultValue": true
                            },
                            {
                                "name": "Light5",
                                "type": "boolean",
                                "specialType": null,
                                "limitType": "UNDEFINED",
                                "min": null,
                                "max": null,
                                "values": null,
                                "defaultValue": true
                            }
                        ],
                        "returnType": null
                    },
                    {
                        "id": "getLight1",
                        "name": "Get Light 1",
                        "description": "Gets value that shows if light 1 is on/off",
                        "getSetType": "GET",
                        "displayText": "Light 1",
                        "parameterDescriptions": [],
                        "returnType": "string"
                    },
                    {
                        "id": "getLight2",
                        "name": "Get Light 2",
                        "description": "Gets value that shows if light 2 is on/off",
                        "getSetType": "GET",
                        "displayText": "Light 2",
                        "parameterDescriptions": [],
                        "returnType": "string"
                    },
                    {
                        "id": "getLight3",
                        "name": "Get Light 3",
                        "description": "Gets value that shows if light 3 is on/off",
                        "getSetType": "GET",
                        "displayText": "Light 3",
                        "parameterDescriptions": [],
                        "returnType": "string"
                    },
                    {
                        "id": "getLight4",
                        "name": "Get Light 4",
                        "description": "Gets value that shows if light 4 is on/off",
                        "getSetType": "GET",
                        "displayText": "Light 4",
                        "parameterDescriptions": [],
                        "returnType": "string"
                    },
                    {
                        "id": "getLight5",
                        "name": "Get Light 5",
                        "description": "Gets value that shows if light 5 is on/off",
                        "getSetType": "GET",
                        "displayText": "Light 5",
                        "parameterDescriptions": [],
                        "returnType": "string"
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
    console.log('Turning lights on...');
}

function turnOff() {
    power = 'OFF';
    console.log('Turning lights off...');
}

function changeIntensity(ints) {
    if (intensity >= 0 && intensity <= 100) {
        intensity = ints;
        console.log('Changing intensity to ' + intensity);
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
    lightsPower[0] = light1 == 'true' ? 'ON' : 'OFF'
    lightsPower[1] = light2 == 'true' ? 'ON' : 'OFF'
    lightsPower[2] = light3 == 'true' ? 'ON' : 'OFF'
    lightsPower[3] = light4 == 'true' ? 'ON' : 'OFF'
    lightsPower[4] = light5 == 'true' ? 'ON' : 'OFF'
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

function getLight1() {
    return lightsPower[0]
}

function getLight2() {
    return lightsPower[1]
}

function getLight3() {
    return lightsPower[2]
}

function getLight4() {
    return lightsPower[3]
}

function getLight5() {
    return lightsPower[4]
}

client.connect('ws://localhost:8080/ws');