export type AuthUser = { id: string; username: string };
export type AuthSession = { token: string; user: AuthUser };
export type AuthInput = {
  action: 'login' | 'register'; username: string; password: string;
  email?: string; recoveryKey?: string;
};

const rawUrl = process.env.EXPO_PUBLIC_API_URL?.trim() ?? '';
export const isAuthConfigured = /^https:\/\/[^\s]+$/i.test(rawUrl);

// Use the existing backend only. Never connect a mobile client to PostgreSQL.
async function authRequest(input: AuthInput | { action: 'reset'; username: string; newPassword: string; recoveryKey: string }): Promise<unknown> {
  if (!isAuthConfigured) throw new Error('Sign in is not connected yet. Please contact the app administrator.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${rawUrl.replace(/\/+$/, '')}/api/auth`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'omit', redirect: 'error', signal: controller.signal, body: JSON.stringify(input),
    });
    let data: unknown;
    try { data = await response.json(); }
    catch { throw new Error('The server returned an unexpected response. Please try again.'); }
    if (!response.ok) {
      if (response.status === 400) throw new Error('Check the details you entered and try again.');
      if (response.status === 401) throw new Error('Incorrect username/email or password. Please try again.');
      if (response.status === 409) throw new Error('This username or email is already in use. Try signing in.');
      if (response.status === 429) throw new Error('Too many attempts. Please wait a moment and try again.');
      if (response.status >= 500) throw new Error('The server is temporarily unavailable. Please try again later.');
      throw new Error('Unable to complete your request. Please try again.');
    }
    return data;
  } catch (error) {
    if (controller.signal.aborted) throw new Error('The request timed out. Please try again.');
    if (error instanceof TypeError) throw new Error('Cannot reach the server. Check your connection and try again.');
    throw error;
  } finally { clearTimeout(timeout); }
}

export async function authenticate(input: AuthInput): Promise<AuthSession> {
  const data = await authRequest(input);
    if (!data || typeof data !== 'object' || !('authenticated' in data) || data.authenticated !== true ||
        !('token' in data) || typeof data.token !== 'string' || !data.token ||
        !('user' in data) || !data.user || typeof data.user !== 'object' ||
        !('id' in data.user) || typeof data.user.id !== 'string' ||
        !('username' in data.user) || typeof data.user.username !== 'string') {
      throw new Error('The server did not return a valid session. Please try again.');
    }
    return { token: data.token, user: { id: data.user.id, username: data.user.username } };
}

export async function resetPassword(username: string, newPassword: string, recoveryKey: string): Promise<void> {
  const data = await authRequest({ action: 'reset', username, newPassword, recoveryKey });
  if (!data || typeof data !== 'object' || !('success' in data) || data.success !== true) {
    throw new Error('Password could not be reset. Please try again.');
  }
}
