import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseAuthException
import com.google.firebase.auth.FirebaseToken
import org.http4k.core.Filter
import org.http4k.core.Request
import org.http4k.core.with
import org.http4k.lens.RequestContextLens

/**
 * Attaches a [TOKEN] to a request through [addAuthentication] if the request has enough information to create a valid token.
 * @param TOKEN the type of token. This should carry enough information to identify a user.
 * @param verifyToken verifies the token string, returning the token if verified, null if invalid.
 * @param extractToken extracts the unverified string token from the request, returns null if the token cannot be found.
 * Defaults to [extractBearerToken]
 */
class TokenAuthenticator<TOKEN>(
    private val verifyToken: (String) -> TOKEN?,
    private val extractToken: (Request) -> String? = ::extractBearerToken
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

/**
 * Verifies a firebase [idToken]. Assumes there is an initialized [FirebaseApp](com.google.firebase.FirebaseApp)
 * @param idToken the token to verify
 * @param checkRevoked check to see if the token has been revoked (defaults to true)
 * @return a [FirebaseToken] if verified, otherwise null
 * @see <a href=https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_the_firebase_admin_sdk>verify-id-tokens</a>
 */
fun verifyFirebaseToken(idToken: String, checkRevoked: Boolean = true): FirebaseToken? {
    return try {
        FirebaseAuth.getInstance().verifyIdToken(idToken, checkRevoked)
    } catch (unauthenticated: FirebaseAuthException) {
        return null
    }
}