import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseToken
import org.http4k.core.HttpHandler
import org.http4k.core.RequestContexts
import org.http4k.core.Response
import org.http4k.core.Status.Companion.OK
import org.http4k.core.Status.Companion.UNAUTHORIZED
import org.http4k.core.then
import org.http4k.filter.ServerFilters
import org.http4k.lens.RequestContextKey
import org.http4k.routing.bind
import org.http4k.routing.routes
import org.http4k.server.SunHttp
import org.http4k.server.asServer

fun main() {
    FirebaseApp.initializeApp()

    val requestContexts = RequestContexts()
    val firebaseTokenKey = RequestContextKey.optional<FirebaseToken>(requestContexts)
    val attachRequestContexts = ServerFilters.InitialiseRequestContext(requestContexts)
    val attachAuthentication = TokenAuthenticator(::verifyFirebaseToken).addAuthentication(firebaseTokenKey)

    val echoHandler: HttpHandler = { request -> Response(OK).body(request.bodyString()) }

    val greetingHandler: HttpHandler = { request ->
        val user = firebaseTokenKey(request)
        if (user == null) {
            Response(UNAUTHORIZED)
        } else {
            Response(OK).body("Hello ${user.name}!")
        }
    }

    val routingHttpHandler = routes(
        "/echo" bind echoHandler,
        "/greet" bind greetingHandler,
    )

    val echoServer = attachRequestContexts
        .then(attachAuthentication)
        .then(routingHttpHandler)
        .asServer(SunHttp(8000))

    echoServer.start()
    println("Server started on port ${echoServer.port()}.")
    echoServer.block() // makes sure we don't exit main.
}