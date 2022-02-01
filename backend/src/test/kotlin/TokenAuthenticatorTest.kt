import com.natpryce.hamkrest.assertion.assertThat
import org.http4k.core.*
import org.http4k.core.Method.GET
import org.http4k.core.Status.Companion.OK
import org.http4k.core.Status.Companion.UNAUTHORIZED
import org.http4k.filter.ServerFilters
import org.http4k.hamkrest.hasStatus
import org.http4k.lens.RequestContextKey
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.parallel.Execution
import org.junit.jupiter.api.parallel.ExecutionMode.CONCURRENT

@Execution(CONCURRENT)
internal class TokenAuthenticatorTest {


    @Test
    internal fun `check does not add any context if no token found`() {
        // initialize the request context store for user token
        val contextStore = RequestContexts()
        val initialiseRequestContextFilter = ServerFilters.InitialiseRequestContext(contextStore)
        val tokenKey = RequestContextKey.optional<String>(contextStore, "user token")

        // create a TokenAuthenticator that always fails to extract a token.
        val tokenAuthenticator = TokenAuthenticator(extractToken = { null }, verifyToken = { "Token" })

        // create the Filter for adding "user token" contexts to requests
        val addAuthenticationFilter = tokenAuthenticator.addAuthentication(tokenKey)

        // a simple handler that checks to see if any token is attached to the request
        val authenticatedRequestHandler: HttpHandler = { request ->
            if (tokenKey(request) != null) {
                Response(OK)
            } else {
                Response(UNAUTHORIZED)
            }
        }

        // the stack of Filters and our final request handler
        val authenticatedHandler = initialiseRequestContextFilter
            .then(addAuthenticationFilter)
            .then(authenticatedRequestHandler)

        val request = Request(GET, "/")
        val response = authenticatedHandler(request)

        assertThat(response, hasStatus(UNAUTHORIZED))
    }

    @Test
    internal fun `check does not attach the token if verifier returns null`() {
        // initialize the request context store for user token
        val contextStore = RequestContexts()
        val initialiseRequestContextFilter = ServerFilters.InitialiseRequestContext(contextStore)
        val tokenKey = RequestContextKey.optional<String>(contextStore, "user token")

        // this authenticator finds a token everytime, but fails to validate it.
        val tokenAuthenticator = TokenAuthenticator<String>(extractToken = { "Token String" }, verifyToken = { null })

        // create the Filter for adding "user token" contexts to requests
        val addAuthenticationFilter = tokenAuthenticator.addAuthentication(tokenKey)

        // a simple handler that checks to see if any token is attached to the request
        val authenticatedRequestHandler: HttpHandler = { request ->
            if (tokenKey(request) != null) {
                Response(OK)
            } else {
                Response(UNAUTHORIZED)
            }
        }

        // the stack of Filters and our final request handler
        val authenticatedHandler = initialiseRequestContextFilter
            .then(addAuthenticationFilter)
            .then(authenticatedRequestHandler)

        val request = Request(GET, "/")
        val response = authenticatedHandler(request)

        assertThat(response, hasStatus(UNAUTHORIZED))
    }

    @Test
    internal fun `check attaches the request context if token string found and validated`() {
        // initialize the request context store for user token
        val contextStore = RequestContexts()
        val initialiseRequestContextFilter = ServerFilters.InitialiseRequestContext(contextStore)
        val tokenKey = RequestContextKey.optional<String>(contextStore, "user token")

        // this authenticator finds and validates the token everytime
        val tokenAuthenticator = TokenAuthenticator(extractToken = { "Token String" }, verifyToken = { "Token Value" })

        // create the Filter for adding "user token" contexts to requests
        val addAuthenticationFilter = tokenAuthenticator.addAuthentication(tokenKey)

        // a simple handler that checks to see if any token is attached to the request
        val authenticatedRequestHandler: HttpHandler = { request ->
            if (tokenKey(request) != null) {
                Response(OK)
            } else {
                Response(UNAUTHORIZED)
            }
        }

        // the stack of Filters and our final request handler
        val authenticatedHandler = initialiseRequestContextFilter
            .then(addAuthenticationFilter)
            .then(authenticatedRequestHandler)

        val request = Request(GET, "/")
        val response = authenticatedHandler(request)

        assertThat(response, hasStatus(OK))
    }
}