import org.http4k.core.Filter
import org.http4k.core.Request
import org.http4k.core.with
import org.http4k.lens.RequestContextLens

/**
 * Attaches a [TOKEN] to a request through [addAuthentication] if the request has enough information to create a valid token.
 * @param TOKEN the type of token. This should carry enough information to identify a user.
 * @param extractToken extracts the unverified string token from the request, returns null if the token cannot be found.
 * Defaults to [extractBearerToken]
 * @param verifyToken verifies the token string, returning the token if verified, null if invalid.
 */
class TokenAuthenticator<TOKEN>(
    private val extractToken: (Request) -> String? = ::extractBearerToken,
    private val verifyToken: (String) -> TOKEN?
) {
    /**
     * @param key the lens used to add and receive the token from a [Request].
     * @return a [Filter] which attaches the appropriate [TOKEN] to the request if the string token is verified.
     */
    fun addAuthentication(key: RequestContextLens<TOKEN?>) = Filter { next ->
        handler@{ request ->
            val tokenString = extractToken(request) ?: return@handler next(request)
            val token = verifyToken(tokenString) ?: return@handler next(request)
            val requestWithContext = request.with(key of token)
            return@handler next(requestWithContext)
        }
    }
}

/**
 * Extracts the `Token` from `Authentication: Bearer <Token>` style header.
 * @param request the request containing an authentication bearer token.
 * @return the string bearer token
 * @see <a href="https://datatracker.ietf.org/doc/html/rfc6750#section-2.1">Authorization Request Header Field</a>
 */
fun extractBearerToken(request: Request): String? {
    val authenticationHeader = request.header("Authentication") ?: return null
    val bearerRegex = Regex("Bearer: (.*)")
    val (token) = bearerRegex.find(authenticationHeader)?.destructured ?: return null
    return token
}