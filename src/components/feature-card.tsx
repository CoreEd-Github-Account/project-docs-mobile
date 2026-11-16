import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { FeatureIcon, type Feature } from '@/components/feature-icon';
import { brand, dashboard } from '@/theme/colors';

export function FeatureCard({ feature, width, featured = false }: {
  feature: Feature; width: number; featured?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const hover = useSharedValue(0);
  const press = useSharedValue(0);
  const [focused, setFocused] = useState(false);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: reducedMotion ? 0 : -2 * hover.get() },
      { scale: reducedMotion ? 1 : 1 - 0.018 * press.get() },
    ],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: Math.max(hover.get(), press.get()) }));
  function feedback(value: typeof hover, active: boolean) {
    value.set(withTiming(active ? 1 : 0, { duration: reducedMotion ? 0 : 180 }));
  }
  return (
    <Animated.View style={[{ width }, animatedStyle]}>
      <Pressable
        accessibilityRole="button" accessibilityLabel={feature.name}
        accessibilityHint="Preview only. This feature does not open yet."
        onHoverIn={() => feedback(hover, true)} onHoverOut={() => feedback(hover, false)}
        onFocus={() => { setFocused(true); feedback(hover, true); }}
        onBlur={() => { setFocused(false); feedback(hover, false); feedback(press, false); }}
        onPressIn={() => feedback(press, true)} onPressOut={() => feedback(press, false)}
        style={{
          minHeight: featured ? 88 : 108, padding: featured ? 16 : 12,
          justifyContent: 'center',
          borderRadius: dashboard.radius, borderCurve: 'continuous', overflow: 'hidden',
          backgroundColor: featured ? dashboard.burgundySurface : dashboard.surface,
          borderWidth: 1, borderColor: focused ? dashboard.burgundyBorder : featured ? dashboard.burgundyBorder : dashboard.border,
          boxShadow: featured ? 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.12)' : 'inset 0 1px 0 rgba(255,255,255,0.035)',
        }}>
        <Animated.View pointerEvents="none" accessible={false} style={[{
          position: 'absolute', inset: 0, backgroundColor: brand.deepBurgundy,
          borderWidth: 1, borderColor: dashboard.burgundyBorder, borderRadius: dashboard.radius - 1,
        }, glowStyle]} />
        <View pointerEvents="none" style={{
          flexDirection: featured ? 'row' : 'column',
          alignItems: 'center', gap: featured ? 14 : 8,
        }}>
          <FeatureIcon icon={feature.icon} />
          <View style={{ gap: 4, ...(featured ? { flex: 1 } : {}) }}>
            <Text style={{ color: brand.ivory, fontSize: featured ? 20 : 13, fontWeight: '500', letterSpacing: -0.2, textAlign: featured ? 'left' : 'center' }}>
              {feature.name}
            </Text>
            {featured && <Text style={{ color: dashboard.muted, fontSize: 12, lineHeight: 18 }}>A little space for big ideas.</Text>}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
