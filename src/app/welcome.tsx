import { Redirect } from 'expo-router';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/auth-provider';
import { brand, dashboard } from '@/theme/colors';
import { FeatureCard } from '@/components/feature-card';
import { features } from '@/components/feature-icon';

export default function Welcome() {
  const { session, signOut } = useAuth();
  const { width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const horizontalPadding = width < 380 ? 16 : 22;
  const contentWidth = Math.min(Math.max(0, width - insets.left - insets.right - horizontalPadding * 2), 760);
  const panelPadding = 12;
  const innerWidth = Math.max(0, contentWidth - (panelPadding + 1) * 2);
  const columns = innerWidth < 230 || fontScale > 1.5 ? 1 : innerWidth >= 560 ? 3 : 2;
  const cardWidth = (innerWidth - dashboard.gap * (columns - 1)) / columns;
  if (!session) return <Redirect href="/" />;
  return (
    <ScrollView contentInsetAdjustmentBehavior="never" automaticallyAdjustContentInsets={false} contentContainerStyle={{
      flexGrow: 1, alignItems: 'center',
      paddingLeft: insets.left + horizontalPadding, paddingRight: insets.right + horizontalPadding,
      paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20,
    }}>
      <View style={{ width: contentWidth, gap: 22 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Text style={{ color: dashboard.muted, fontSize: 10, letterSpacing: 1.8, fontWeight: '700' }}>TEMPLATE STUDIO</Text>
          <Pressable accessibilityRole="button" onPress={signOut} style={({ pressed }) => ({
            minHeight: 44, paddingHorizontal: 14, justifyContent: 'center', alignItems: 'center',
            backgroundColor: pressed ? dashboard.burgundySurface : 'rgba(255,255,255,0.035)',
            borderWidth: 1, borderColor: dashboard.panelBorder,
            borderRadius: 22, borderCurve: 'continuous',
          })}><Text style={{ color: brand.ivory, fontSize: 12, fontWeight: '500' }}>Sign out</Text></Pressable>
        </View>
        <View style={{ gap: 4, paddingTop: 0 }}>
          <Text accessibilityRole="header" style={{ color: brand.ivory, fontSize: 34, fontWeight: '600', letterSpacing: -1.1 }}>Home</Text>
          <Text style={{ color: dashboard.muted, fontSize: 14, lineHeight: 20 }}>Your space, in focus.</Text>
        </View>
        <View style={{
          gap: dashboard.gap, padding: panelPadding,
          backgroundColor: dashboard.panel, borderWidth: 1, borderColor: dashboard.panelBorder,
          borderRadius: 30, borderCurve: 'continuous',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.055), 0 16px 44px rgba(0,0,0,0.22)',
        }}>
          <View style={{ paddingHorizontal: 6, paddingTop: 5, paddingBottom: 7, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View accessible={false} style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: dashboard.highlight }} />
            <Text style={{ color: dashboard.highlight, fontSize: 10, fontWeight: '500', letterSpacing: 1.4 }}>YOUR WORKSPACE</Text>
          </View>
          <FeatureCard feature={features[0]} width={innerWidth} featured />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: dashboard.gap }}>
            {features.slice(1).map(feature => <FeatureCard key={feature.name} feature={feature} width={cardWidth} />)}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
