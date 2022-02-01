import com.natpryce.hamkrest.assertion.assertThat
import com.natpryce.hamkrest.equalTo
import org.http4k.core.Method.GET
import org.http4k.core.Request
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.parallel.Execution
import org.junit.jupiter.api.parallel.ExecutionMode.CONCURRENT

@Execution(CONCURRENT)
internal class TokenAuthenticatorKtTest {
    @Test
    internal fun `check extract bearer token returns null on empty request`() {
        val request = Request(GET, "/")
        val extractedToken = extractBearerToken(request)
        assertNull(extractedToken)
    }

    @Test
    internal fun `check extract bearer token returns the token when request has a bearer token`() {
        val request = Request(GET, "/").header("Authentication", "Bearer: Marcus")
        val extractedToken = extractBearerToken(request)
        assertThat(extractedToken, equalTo("Marcus"))
    }
}