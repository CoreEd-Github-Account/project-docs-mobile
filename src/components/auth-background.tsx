import { View } from 'react-native';
import { Image } from 'expo-image';
import type { PropsWithChildren } from 'react';

export function AuthBackground({ children }: PropsWithChildren) {
  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <Image
        source={require('../../assets/Luminous Burgundy Wave Ribbons.png')}
        contentFit="cover"
        accessible={false}
        pointerEvents="none"
        style={{ position: 'absolute', inset: 0, opacity: 0.3 }}
      />
      {children}
    </View>
  );
}
