import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import StarField from './star-field';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function ScreenBackground({ children, style }: Props) {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: Colors.background,
        },
        style,
      ]}
    >
      <StarField />
      {/* Subtle vignette-like overlay at top for depth */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 160,
          backgroundColor: Colors.surface,
          opacity: 0.3,
        }}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}
