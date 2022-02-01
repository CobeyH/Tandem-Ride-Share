import org.http4k.core.Filter
import org.http4k.core.HttpHandler
import org.http4k.core.Request
import org.http4k.core.with
import org.http4k.lens.RequestContextLens

/**
 * Attaches a [TOKEN] to a request through [addAuthentication] if the request has enough information to create a valid token.
 * @param TOKEN the type of token. This should carry enough information to identify a user.
 * @param extractToken extracts the unverified string token from the request, returns null if the token cannot be found.
 * Defaults to extracting from an `Authentication: Bearer <TOKEN>` style header.
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
    fun addAuthentication(key: RequestContextLens<TOKEN?>): Filter {
        return Filter { nextHandler: HttpHandler ->
            contextHandler@{ request: Request ->
                val tokenString = extractToken(request)
                    ?: return@contextHandler nextHandler(request)
                val token = verifyToken(tokenString)
                    ?: return@contextHandler nextHandler(request)
                val requestWithContext = request.with(key of token)
                nextHandler(requestWithContext)
            }
        }
    }
}

private val bearerRegex = Regex("Bearer: (.*)")

fun extractBearerToken(request: Request): String? {
    val authenticationHeader = request.header("Authentication")
        ?: return null
    val (token) = bearerRegex.find(authenticationHeader)?.destructured
        ?: return null
    return token
}