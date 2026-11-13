import { useRef, useState } from 'react';
import {
  ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, Text, TextInput, View,
  type TextInputProps,
} from 'react-native';
import { Link } from 'expo-router';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/auth-provider';
import { isAuthConfigured, resetPassword } from '@/lib/auth';
import { brand, palettes } from '@/theme/colors';

function Field({ label, colors, trailing, ...props }: TextInputProps & {
  label: string; colors: typeof palettes.light; trailing?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ justifyContent: 'center' }}>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          minHeight: 46, borderBottomWidth: 1,
          borderColor: focused ? colors.accent : 'rgba(230,230,237,0.2)',
          paddingLeft: 2, paddingRight: trailing ? 62 : 2, paddingVertical: 11,
          backgroundColor: 'transparent', color: colors.text, fontSize: 15,
        }}
      />
      {trailing && <View style={{ position: 'absolute', right: 2 }}>{trailing}</View>}
    </View>
  );
}

export function AuthScreen({ mode }: { mode: 'login' | 'register' }) {
  const registering = mode === 'register';
  const [recovering, setRecovering] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const colors = palettes.dark;
  const nativeGlass = isGlassEffectAPIAvailable() && isLiquidGlassAvailable();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [recoveryExpanded, setRecoveryExpanded] = useState(false);
  const [showRecoveryKey, setShowRecoveryKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);

  async function submit() {
    if (submitting.current) return;
    setError('');
    if (!username.trim() || !password) { setError('Enter your username and password.'); return; }
    if (registering || recovering) {
      if (registering && username.trim().length < 3) { setError('Choose a username with at least 3 characters.'); return; }
      if (password.length < 4) { setError('Your password needs at least 4 characters.'); return; }
      if (password !== confirmation) { setError('Passwords do not match. Please check both fields.'); return; }

    }
    if (recovering && !recoveryKey.trim()) { setError('Enter your recovery key. If you do not have one, contact your administrator.'); return; }
    Keyboard.dismiss();
    submitting.current = true;
    setPending(true);
    try {
      if (recovering) {
        await resetPassword(username.trim(), password, recoveryKey.trim());
        setRecoverySuccess(true);
      } else await signIn({
        action: mode, username: username.trim(), password,
        ...(registering ? { recoveryKey: recoveryKey.trim() || undefined } : {}),
      });
      setPassword(''); setConfirmation(''); setRecoveryKey('');
      setRecoveryExpanded(false); setShowRecoveryKey(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.');
    } finally { submitting.current = false; setPending(false); }
  }

  return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            flexGrow: 1, justifyContent: 'center', alignItems: 'center',
            paddingHorizontal: 28, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24, gap: 18,
          }}
        >
          <View style={{
            width: '100%', maxWidth: 300, padding: 22, paddingTop: 32, gap: 12,
            borderRadius: 24, borderCurve: 'continuous', overflow: 'hidden',
            backgroundColor: nativeGlass ? 'transparent' : 'rgba(22,18,23,0.32)',
            borderWidth: 1, borderColor: 'rgba(245,235,242,0.23)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 12px 32px rgba(0,0,0,0.22)',
            ...(Platform.OS === 'web' ? { backdropFilter: 'blur(20px) saturate(140%)' } : {}),
          }}>
            {nativeGlass && <GlassView pointerEvents="none" accessible={false}
              glassEffectStyle="regular" tintColor="rgba(24,16,23,0.22)" colorScheme="dark"
              style={{ position: 'absolute', inset: 0, borderRadius: 24 }} />}
            <View pointerEvents="none" accessible={false} style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 45%, rgba(255,255,255,0.01) 100%)',
            }} />
            {recovering && <View style={{ gap: 8 }}>
              <Text accessibilityRole="header" style={{ color: colors.text, fontSize: 21, fontWeight: '600', letterSpacing: -0.6, textAlign: 'center' }}>
                {recovering ? 'Reset password' : registering ? 'Sign up' : 'Login'}
              </Text>
            </View>}

            <View style={{ gap: registering ? 10 : 12 }}>
              <Field colors={colors} label="Username or Email"
                placeholder="Username or Email"
                value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false}
                autoComplete="username" textContentType="username" editable={!pending} returnKeyType="next" />
              <View style={{ gap: 4 }}>
                <Field colors={colors} label="Password" placeholder={recovering ? "New password" : "Password"}
                  value={password} onChangeText={setPassword} secureTextEntry={!showPassword}
                  autoCapitalize="none" autoCorrect={false} editable={!pending}
                  autoComplete={registering || recovering ? 'new-password' : 'current-password'}
                  textContentType={registering || recovering ? 'newPassword' : 'password'}
                  returnKeyType={registering || recovering ? 'next' : 'go'} onSubmitEditing={registering || recovering ? undefined : submit}
                  trailing={
                <Pressable accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide' : 'Show'}
                  onPress={() => setShowPassword(value => !value)} disabled={pending}
                  style={{ minHeight: 44, minWidth: 52, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 2 }}>
                  <Text style={{ color: colors.accent, fontSize: 11, fontWeight: '400' }}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
                  } />
              </View>
              {(registering || recovering) && <>
                <Field colors={colors} label="Confirm password" placeholder="Confirm password"
                  value={confirmation} onChangeText={setConfirmation} secureTextEntry={!showPassword}
                  autoCapitalize="none" autoCorrect={false} autoComplete="new-password" editable={!pending} />
                {recovering && <Field colors={colors} label="Recovery key" placeholder="Recovery key"
                  value={recoveryKey} onChangeText={setRecoveryKey} secureTextEntry autoCapitalize="none"
                  autoCorrect={false} autoComplete="off" editable={!pending} returnKeyType="go" onSubmitEditing={submit} />}
                {registering && <View style={{ gap: 4 }}>
                  <Pressable accessibilityRole="button" accessibilityLabel="Recovery Key (Optional)"
                    accessibilityState={{ expanded: recoveryExpanded, disabled: pending }}
                    disabled={pending}
                    onPress={() => { setRecoveryExpanded(value => !value); setShowRecoveryKey(false); }}
                    style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <Text style={{ color: colors.accent, opacity: 0.85, fontSize: 12, fontWeight: '500', flexShrink: 1 }}>Recovery Key (Optional)</Text>
                    <View accessible={false} style={{ width: 12, height: 22, alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ width: 7, height: 7, borderRightWidth: 1.5, borderBottomWidth: 1.5,
                        borderColor: colors.accent, opacity: 0.85, transform: [{ rotate: recoveryExpanded ? '225deg' : '45deg' }] }} />
                    </View>
                  </Pressable>
                  {recoveryExpanded && <View style={{ gap: 8 }}>
                    <Field colors={colors} label="Recovery key" placeholder="PIN or phrase"
                      value={recoveryKey} onChangeText={setRecoveryKey} secureTextEntry={!showRecoveryKey}
                      autoCapitalize="none" autoCorrect={false} autoComplete="off" spellCheck={false}
                      editable={!pending} returnKeyType="go" onSubmitEditing={submit}
                      trailing={<Pressable accessibilityRole="button"
                        accessibilityLabel={showRecoveryKey ? 'Hide recovery key' : 'Show recovery key'}
                        disabled={pending} onPress={() => setShowRecoveryKey(value => !value)}
                        style={{ minHeight: 44, minWidth: 52, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 2 }}>
                        <Text style={{ color: colors.accent, fontSize: 11 }}>{showRecoveryKey ? 'Hide' : 'Show'}</Text>
                      </Pressable>} />
                    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>
                      Choose a PIN or phrase for password recovery. Keep it somewhere safe.
                    </Text>
                  </View>}
                </View>}
              </>}
            </View>

            {!registering && !recovering && <View style={{
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', columnGap: 8,
            }}>
              <Pressable accessibilityRole="checkbox" disabled
                accessibilityLabel="Remember me"
                accessibilityState={{ disabled: true, checked: false }}
                accessibilityHint="Unavailable until secure session storage is configured"
                style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                <View style={{ width: 15, height: 15, borderRadius: 5, borderCurve: 'continuous',
                  borderWidth: 1, borderColor: '#66666D', backgroundColor: 'rgba(255,255,255,0.025)' }} />
                <Text style={{ color: '#85858D', fontSize: 11 }}>Remember me</Text>
              </Pressable>
              <Pressable accessibilityRole="button" disabled={pending}
                onPress={() => { setRecovering(true); setError(''); setRecoverySuccess(false); setPassword(''); setConfirmation(''); setRecoveryKey(''); }}
                style={{ minHeight: 44, justifyContent: 'center' }}>
                <Text style={{ color: colors.accent, fontSize: 11, fontWeight: '300' }}>Forgot password?</Text>
              </Pressable>
            </View>}

            {recoverySuccess && <Text accessibilityRole="alert" style={{ color: colors.accent, fontSize: 13 }}>Password reset. You can login now.</Text>}
            {!!error && <Text selectable accessibilityRole="alert" accessibilityLiveRegion="polite"
              style={{ color: colors.error, fontSize: 14, lineHeight: 21 }}>{error}</Text>}
            {!isAuthConfigured && <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>
              Connection pending.
            </Text>}
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: pending || !isAuthConfigured || recoverySuccess, busy: pending }}
              disabled={pending || !isAuthConfigured || recoverySuccess} onPress={submit}
              style={({ pressed }) => ({
                minHeight: 46, borderRadius: 12, borderCurve: 'continuous', backgroundColor: brand.burgundy,
                backgroundImage: pressed
                  ? 'linear-gradient(155deg, #501329 0%, #2D0815 100%)'
                  : 'linear-gradient(155deg, #681C36 0%, #4C1027 42%, #300917 100%)',
                borderWidth: 1, borderColor: 'rgba(190,130,150,0.18)', overflow: 'hidden',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                alignItems: 'center', justifyContent: 'center', padding: 12,
              })}>
              {nativeGlass && <GlassView pointerEvents="none" accessible={false}
                glassEffectStyle="clear" tintColor="rgba(60,10,28,0.3)" colorScheme="dark"
                style={{ position: 'absolute', inset: 0, borderRadius: 12 }} />}
              <View pointerEvents="none" accessible={false} style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 48%, transparent 52%)',
              }} />
              {pending ? <ActivityIndicator color={brand.ivory} accessibilityLabel={registering ? 'Creating account' : 'Logging in'} /> :
                <Text style={{ color: brand.ivory, fontSize: 15, fontWeight: '600', opacity: !isAuthConfigured ? 0.65 : 1 }}>
                  {recovering ? 'Reset password' : registering ? 'Sign up' : 'Login'}
                </Text>}
            </Pressable>
            {recovering && <Pressable accessibilityRole="button" disabled={pending}
              onPress={() => { setRecovering(false); setError(''); setRecoverySuccess(false); setPassword(''); setConfirmation(''); setRecoveryKey(''); }}
              style={{ minHeight: 44, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: colors.accent, fontSize: 13 }}>Back to login</Text>
            </Pressable>}
            {!recovering && <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', columnGap: 5 }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>{registering ? 'Already a member?' : 'New here?'}</Text>
              <Link href={registering ? '/' : '/signup'} replace asChild>
                <Pressable accessibilityRole="link" disabled={pending}
                  style={{ minHeight: 44, minWidth: 44, justifyContent: 'center', paddingHorizontal: 2 }}>
                  <Text style={{ color: colors.accent, fontSize: 12, fontWeight: '400' }}>
                    {registering ? 'Login' : 'Sign up'}
                  </Text>
                </Pressable>
              </Link>
            </View>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}
