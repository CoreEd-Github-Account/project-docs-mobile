import { Redirect } from 'expo-router';
import { Pressable, ScrollView, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/auth-provider';
import { brand, palettes } from '@/theme/colors';

export default function Welcome() {
  const { session, signOut } = useAuth();
  const colors = palettes[useColorScheme() === 'dark' ? 'dark' : 'light'];
  const insets = useSafeAreaInsets();
  if (!session) return <Redirect href="/" />;
  return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{
        flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24,
        paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24,
      }}>
        <View style={{ width: '100%', maxWidth: 440, padding: 28, gap: 20,
          backgroundColor: colors.surface, borderRadius: 26, borderCurve: 'continuous' }}>
          <Text style={{ color: colors.accent, fontSize: 12, letterSpacing: 2, fontWeight: '700' }}>TEMPLATE STUDIO</Text>
          <Text accessibilityRole="header" style={{ color: colors.text, fontSize: 30, fontWeight: '700' }}>{'Hello '}</Text>
          <Pressable accessibilityRole="button" onPress={signOut} style={{
            minHeight: 54, justifyContent: 'center', alignItems: 'center',
            backgroundColor: brand.burgundy, borderRadius: 14, borderCurve: 'continuous', padding: 16,
          }}><Text style={{ color: brand.ivory, fontWeight: '700', fontSize: 16 }}>Sign out</Text></Pressable>
        </View>
      </ScrollView>
  );
}
