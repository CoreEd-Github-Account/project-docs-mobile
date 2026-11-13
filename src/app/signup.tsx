import { Redirect } from 'expo-router';
import { AuthScreen } from '@/components/auth-screen';
import { useAuth } from '@/providers/auth-provider';

export default function Signup() {
  const { session } = useAuth();
  return session ? <Redirect href="/welcome" /> : <AuthScreen mode="register" />;
}
