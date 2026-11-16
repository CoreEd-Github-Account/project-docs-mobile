import { Platform, Text, View } from 'react-native';
import { dashboard } from '@/theme/colors';

// Original icon identities from project-docs-main/components/WorkspaceHeader.tsx.
export const features = [
  { name: 'Projects', icon: '\u{1F4C1}', description: 'Make room for your next big idea.' },
  { name: 'Subscriptions', icon: '\u23F1\uFE0F', description: 'Keep renewals in view.' },
  { name: 'Expenses', icon: '\u{1F9FE}', description: 'A clearer view of spending.' },
  { name: 'Passwords', icon: '\u{1F511}', description: 'Your private essentials.' },
  { name: 'Prompts', icon: '\u{1F4A1}', description: 'Keep inspiration close.' },
  { name: 'Commands', icon: '>_', description: 'Useful commands, together.' },
  { name: 'Snippets', icon: '\u{1F4CB}', description: 'Small pieces worth keeping.' },
] as const;
export type Feature = typeof features[number];

export function FeatureIcon({ icon }: { icon: Feature['icon'] }) {
  const terminal = icon === '>_';
  return (
    <View accessible={false} style={{
      width: 42, height: 42, borderRadius: 14, borderCurve: 'continuous',
      backgroundColor: dashboard.iconSurface, borderWidth: 1,
      borderColor: dashboard.border, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.045)', alignItems: 'center', justifyContent: 'center',
    }}>
      <Text accessible={false} style={{
        fontSize: terminal ? 20 : 23, lineHeight: 32, includeFontPadding: false,
        ...(terminal ? {
          color: dashboard.terminal, fontWeight: '700',
          fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
        } : {}),
      }}>{icon}</Text>
    </View>
  );
}
