import { Marketplace } from '../components/marketplace/Marketplace'
import { LoginButton } from '../components/login-button'
import { LogoutButton } from '../components/logout-button'
import { resolveAccessToken } from '../lib/session'
import { env } from '../lib/env'

export default async function Home() {
  // Decide the nav's auth control on the server: an active member token means
  // "signed in" (show sign-out); otherwise offer "Sign in with Blackbird".
  // The button is disabled until OAuth is configured (FLYNET_CLIENT_ID set via
  // the Dev Setup drawer), so it never starts a doomed handshake.
  const accessToken = await resolveAccessToken()
  const signedIn = Boolean(accessToken)
  const oauthConfigured = Boolean(env.FLYNET_CLIENT_ID)

  const authSlot = signedIn ? (
    <LogoutButton href="/api/auth/logout" />
  ) : (
    <LoginButton
      href="/api/auth/login"
      disabled={!oauthConfigured}
      className="h-10 px-5 text-sm"
    />
  )

  return <Marketplace authSlot={authSlot} />
}
