import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import { authenticate, type AuthInput, type AuthSession } from '@/lib/auth';

type AuthContextValue = {
  session: AuthSession | null;
  signIn: (input: AuthInput) => Promise<void>;
  signOut: () => void;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  // Memory-only until secure native storage can be installed. Never persist passwords.
  const [session, setSession] = useState<AuthSession | null>(null);
  async function signIn(input: AuthInput) { setSession(await authenticate(input)); }
  return (
    <AuthContext.Provider value={{ session, signIn, signOut: () => setSession(null) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
}
