#!/usr/bin/env node
var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

//local settings
var temperatures = [23, 23, 23];
var mode = 'Manual';
var power = 'OFF';
var heatersPower = ['ON', 'ON', 'ON']

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
                "id": "heating-systems-heater-c2",
                "name": "HeatingSystems Heater C2",
                "manufacturer": "HeatingSystems",
                "type": "Heating",
                "commands": [
                    {
                        "id": "turnOn",
                        "name": "Turn On",
                        "description": "Turns heating on",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "turnOff",
                        "name": "Turn Off",
                        "description": "Turns heating off",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [],
                        "returnType": null
                    },
                    {
                        "id": "changeAllTemperatures",
                        "name": "Change All Temperatures",
                        "description": "Changes temperature[°C] for every heater",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [
                            {
                                "name": "Temperature",
                                "type": "integer",
                                "specialType": null,
                                "limitType": "MIN_MAX",
                                "min": "17",
                                "max": "32",
                                "values": null,
                                "defaultValue": "23"
                            }
                        ],
                        "returnType": null
                    },
                    {
                        "id": "changeTemperature1",
                        "name": "Change Temperature 1",
                        "description": "Changes temperature[°C] of heater 1",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [
                            {
                                "name": "Temperature 1",
                                "type": "integer",
                                "specialType": null,
                                "limitType": "MIN_MAX",
                                "min": "17",
                                "max": "32",
                                "values": null,
                                "defaultValue": "23"
                            }
                        ],
                        "returnType": null
                    },
                    {
                        "id": "changeTemperature2",
                        "name": "Change Temperature 2",
                        "description": "Changes temperature[°C] of heater 2",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [
                            {
                                "name": "Temperature 2",
                                "type": "integer",
                                "specialType": null,
                                "limitType": "MIN_MAX",
                                "min": "17",
                                "max": "32",
                                "values": null,
                                "defaultValue": "23"
                            }
                        ],
                        "returnType": null
                    },
                    {
                        "id": "changeTemperature3",
                        "name": "Change Temperature 3",
                        "description": "Changes temperature[°C] of heater 3",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [
                            {
                                "name": "Temperature 3",
                                "type": "integer",
                                "specialType": null,
                                "limitType": "MIN_MAX",
                                "min": "17",
                                "max": "32",
                                "values": null,
                                "defaultValue": "23"
                            }
                        ],
                        "returnType": null
                    },
                    {
                        "id": "setMode",
                        "name": "Set Mode",
                        "description": "Changes mode between manual and automatic",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [
                            {
                                "name": "Mode",
                                "type": "string",
                                "specialType": null,
                                "limitType": "LIMITED_SET",
                                "min": null,
                                "max": null,
                                "values": ["Manual", "Automatic"],
                                "defaultValue": "Manual"
                            }
                        ],
                        "returnType": null
                    },
                    {
                        "id": "powerHeaters",
                        "name": "Power Heaters",
                        "description": "Selects which heater is turned on",
                        "getSetType": "SET",
                        "displayText": null,
                        "parameterDescriptions": [
                            {
                                "name": "Heater1",
                                "type": "boolean",
                                "specialType": null,
                                "limitType": "UNDEFINED",
                                "min": null,
                                "max": null,
                                "values": null,
                                "defaultValue": true
                            },
                            {
                                "name": "Heater2",
                                "type": "boolean",
                                "specialType": null,
                                "limitType": "UNDEFINED",
                                "min": null,
                                "max": null,
                                "values": null,
                                "defaultValue": true
                            },
                            {
                                "name": "Heater3",
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
                        "id": "getTemperature1",
                        "name": "Get Temperature 1",
                        "description": "Gets currently set temperature of heater 1",
                        "getSetType": "GET",
                        "displayText": "Temperature 1",
                        "parameterDescriptions": [],
                        "returnType": "number"
                    },
                    {
                        "id": "getTemperature2",
                        "name": "Get Temperature 2",
                        "description": "Gets currently set temperature of heater 2",
                        "getSetType": "GET",
                        "displayText": "Temperature 2",
                        "parameterDescriptions": [],
                        "returnType": "number"
                    },
                    {
                        "id": "getTemperature3",
                        "name": "Get Temperature 3",
                        "description": "Gets currently set temperature of heater 3",
                        "getSetType": "GET",
                        "displayText": "Temperature 3",
                        "parameterDescriptions": [],
                        "returnType": "number"
                    },
                    {
                        "id": "getPower1",
                        "name": "Get Power 1",
                        "description": "Gets value that shows if heater 1 is on/off",
                        "getSetType": "GET",
                        "displayText": "Power 1",
                        "parameterDescriptions": [],
                        "returnType": "string"
                    },
                    {
                        "id": "getPower2",
                        "name": "Get Power 2",
                        "description": "Gets value that shows if heater 2 is on/off",
                        "getSetType": "GET",
                        "displayText": "Power 2",
                        "parameterDescriptions": [],
                        "returnType": "string"
                    },
                    {
                        "id": "getPower3",
                        "name": "Get Power 3",
                        "description": "Gets value that shows if heater 3 is on/off",
                        "getSetType": "GET",
                        "displayText": "Power 3",
                        "parameterDescriptions": [],
                        "returnType": "string"
                    },
                    {
                        "id": "getMode",
                        "name": "Get Mode",
                        "description": "Gets currently set mode",
                        "getSetType": "GET",
                        "displayText": "Mode",
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
    console.log('Turning heating system on...');
}

function turnOff() {
    power = 'OFF';
    console.log('Turning heating system off...');
}

function changeAllTemperatures(globalTemp) {
    if (globalTemp >= 17 && globalTemp <= 32) {
        temperatures[0] = globalTemp
        temperatures[1] = globalTemp
        temperatures[2] = globalTemp
        console.log('Changing all temperatures to ' + globalTemp);
    }
}

function changeTemperature1(temp) {
    if (temp >= 17 && temp <= 32) {
        temperatures[0] = temp
        console.log('Changing temperature of heater 1 to ' + temp);
    }
}

function changeTemperature2(temp) {
    if (temp >= 17 && temp <= 32) {
        temperatures[1] = temp
        console.log('Changing temperature of heater 2 to ' + temp);
    }
}

function changeTemperature3(temp) {
    if (temp >= 17 && temp <= 32) {
        temperatures[2] = temp
        console.log('Changing temperature of heater 3 to ' + temp);
    }
}

function setMode(mod) {
    mode = mod;
    console.log('Changing mode to ' + mode);
}

function powerHeaters(power1, power2, power3) {
    heatersPower[0] = power1 == 'true' ? 'ON' : 'OFF'
    heatersPower[1] = power2 == 'true' ? 'ON' : 'OFF'
    heatersPower[2] = power3 == 'true' ? 'ON' : 'OFF'

    console.log('Heater 1: ' + heatersPower[0])
    console.log('Heater 2: ' + heatersPower[1])
    console.log('Heater 3: ' + heatersPower[2])
}

function getTemperature1() {
    return temperatures[0];
}

function getTemperature2() {
    return temperatures[1];
}

function getTemperature3() {
    return temperatures[2];
}

function getPower1() {
    return heatersPower[0]
}

function getPower2() {
    return heatersPower[1]
}

function getPower3() {
    return heatersPower[2]
}


function getMode() {
    return mode;
}

client.connect('ws://localhost:8080/ws');