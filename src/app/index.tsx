import { Redirect } from 'expo-router';
import { AuthScreen } from '@/components/auth-screen';
import { useAuth } from '@/providers/auth-provider';

export default function Login() {
  const { session } = useAuth();
  return session ? <Redirect href="/welcome" /> : <AuthScreen mode="login" />;
}
