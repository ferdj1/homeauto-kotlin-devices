package tvclient

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.eclipse.jetty.websocket.api.Session
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage
import org.eclipse.jetty.websocket.api.annotations.WebSocket
import org.eclipse.jetty.websocket.client.ClientUpgradeRequest
import org.eclipse.jetty.websocket.client.WebSocketClient
import tvclient.model.ExecutedCommand
import java.net.URI
import java.util.*

data class Argument(val argumentType: String, val argumentValue: String)

const val STRING_DATATYPE = "string"
const val NUMBER_DATATYPE = "number"
const val INTEGER_DATATYPE = "integer"
const val BOOLEAN_DATATYPE = "boolean"
const val NULL_DATATYPE = "null"

object Device {
    private var allowedSourceSet = setOf("HDMI1", "HDMI2", "AV", "TV")

    private var power = false
    private var volume = 50
    private var channel = 1
    private var source = "HDMI1"
    private var ledGradient = Pair("#ffffff", "#000000")

    fun turnOn() {
        power = true
        println("Turning TV on...")
    }

    fun turnOff() {
        power = false
        println("Turning TV off...")
    }

    fun changeVolume(volume: Int) {
        if (volume in 0..100) {
            this.volume = volume
            println("Changing volume to $volume...")
        } else {
            this.volume = 50
        }
    }

    fun changeSource(source: String) {
        if (source in allowedSourceSet) {
            this.source = source
            println("Setting source to $source...")
        } else {
            this.source = "HDMI1"
        }
    }

    fun changeChannel(channel: Int) {
        if (channel in 0..999) {
            this.channel = channel
            println("Changing channel to $channel...")
        } else {
            this.channel = 1
        }
    }

    fun changeLEDGradientColors(color1: String, color2: String) {
        this.ledGradient = Pair(color1, color2)
        println("Changing color gradient to [$color1, $color2]")
    }

    fun getVolume() = volume

    fun getChannel() = channel

    fun getSource() = source
}

@WebSocket
class DeviceWebSocket {
    // Message type constants
    private val DESCRIPTION_MESSAGE_TYPE = "description"
    private val CLIENT_TO_SERVER_EXECUTED_COMMAND_MESSAGE_TYPE = "clientToServerExecutedCommand"
    private val SERVER_TO_CLIENT_EXECUTED_COMMAND_MESSAGE_TYPE = "serverToClientExecutedCommand"
    private val EXECUTE_COMMAND_MESSAGE_TYPE = "executeCommand"

    private lateinit var session: Session

    @OnWebSocketClose
    fun onClose(statusCode: Int, reason: String) {
        println("Closing connection...")
        println("Status code: $statusCode; Reason: $reason")
    }

    @OnWebSocketConnect
    fun onConnect(session: Session) {
        this.session = session
        println("Connected, sending device description...")
        val json = readJsonFile()
        session.remote.sendString(json)
    }

    @OnWebSocketMessage
    fun onMessage(message: String) {
        //println("Got message: $message")
        handleMessage(session, message)
    }

    private fun handleMessage(session: Session, message: String) {
        val json = jacksonObjectMapper().readTree(message)
        val messageType = json["messageType"].asText()

        val deviceId = json["deviceId"].asText()
        val commandId = json["commandId"].asText()

        var clientToServerMessageType = CLIENT_TO_SERVER_EXECUTED_COMMAND_MESSAGE_TYPE

        when (messageType) {
            EXECUTE_COMMAND_MESSAGE_TYPE -> {
                val parameters = json["parameters"].map { it.asText() }
                val commands = jacksonObjectMapper().readTree(readJsonFile())["commands"]
                val commandObject = commands.first { it["id"].asText() == commandId }

                val arguments = parameters.map {
                    Argument(commandObject["parameterDescriptions"][parameters.indexOf(it)]["type"].asText(), it)
                }
                val classArray = arguments.map { getClassFromString(it.argumentType) }.toTypedArray()
                val argumentArray = createArgumentArray(arguments)

                val result = executeMethod(commandId, classArray, argumentArray).toString()

                val executedCommand = ExecutedCommand(clientToServerMessageType,
                        deviceId,
                        commandId,
                        parameters,
                        result)

                session.remote.sendString(jacksonObjectMapper().writeValueAsString(executedCommand))
            }
        }

    }
}

fun executeMethod(commandId: String, classArray: Array<Class<out Any>>, argumentArray: Array<out Any>): Any? {
    val method = Device::class.java.getMethod(commandId, *classArray)
    return method.invoke(Device, *argumentArray)
}


fun readJsonFile() = DeviceWebSocket::class.java.classLoader.getResource("tvclient/desc.json").readText()

fun main(args: Array<String>) {
    val webSocketString = "ws://${args[0]}:${args[1]}/ws"
    val webSocketUri = URI(webSocketString)
    val clientUpgradeRequest = ClientUpgradeRequest()

    val webSocketClient = WebSocketClient()
    val deviceWebSocket = DeviceWebSocket()

    webSocketClient.start()

    webSocketClient.connect(deviceWebSocket, webSocketUri, clientUpgradeRequest)
    println("Trying to connect to $webSocketUri...")

    val scanner = Scanner(System.`in`)
    while (true) {
        println("Type 'stop' to close connection.")
        when(scanner.nextLine()) {
            "stop" ->  if(webSocketClient.isStarted) webSocketClient.stop()
        }
    }

}

fun getClassFromString(dataType: String) = when (dataType) {
    INTEGER_DATATYPE -> Int::class.java
    NUMBER_DATATYPE -> Double::class.java
    STRING_DATATYPE -> String::class.java
    BOOLEAN_DATATYPE -> Boolean::class.java
    NULL_DATATYPE -> Object::class.java
    else -> Object::class.java
}

fun createArgumentArray(arguments: List<Argument>): Array<out Any> {
    val objectArray = mutableListOf<Any>()
    looper@ for (argument in arguments) {
        when (argument.argumentType) {
            INTEGER_DATATYPE -> objectArray.add(argument.argumentValue.toInt())
            NUMBER_DATATYPE -> objectArray.add(argument.argumentValue.toDouble())
            STRING_DATATYPE -> objectArray.add(argument.argumentValue)
            BOOLEAN_DATATYPE -> objectArray.add(argument.argumentValue.toBoolean())
            NULL_DATATYPE -> continue@looper
            else -> continue@looper
        }
    }

    return objectArray.toTypedArray()
}
