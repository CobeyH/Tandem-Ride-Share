import org.http4k.core.HttpHandler
import org.http4k.core.Response
import org.http4k.core.Status.Companion.OK
import org.http4k.server.SunHttp
import org.http4k.server.asServer

fun main() {
    val echoHandler: HttpHandler = { request -> Response(OK).body(request.bodyString()) }
    val echoServer = echoHandler.asServer(SunHttp(8000))
    echoServer.start()
    println("Server started on port ${echoServer.port()}.")
    echoServer.block() // makes sure we don't exit main.
}