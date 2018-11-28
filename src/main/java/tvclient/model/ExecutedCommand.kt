package tvclient.model

data class ExecutedCommand(val messageType: String?,
                           val deviceId: String,
                           val commandId: String,
                           val parameters: List<String?>?,
                           val result: String?)
