import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  RadialGradient,
  Stop,
  Path,
  G,
  Ellipse,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

interface Props {
  size: number;
  illumination: number;
  isWaxing: boolean;
}

// Predefined crater positions (relative to 0-1 range)
const CRATERS = [
  { cx: 0.35, cy: 0.3, rx: 0.08, ry: 0.06 },
  { cx: 0.6, cy: 0.25, rx: 0.05, ry: 0.05 },
  { cx: 0.45, cy: 0.55, rx: 0.1, ry: 0.08 },
  { cx: 0.7, cy: 0.5, rx: 0.06, ry: 0.06 },
  { cx: 0.3, cy: 0.65, rx: 0.07, ry: 0.05 },
  { cx: 0.55, cy: 0.75, rx: 0.05, ry: 0.04 },
  { cx: 0.4, cy: 0.42, rx: 0.04, ry: 0.035 },
  { cx: 0.65, cy: 0.38, rx: 0.035, ry: 0.03 },
  { cx: 0.25, cy: 0.48, rx: 0.06, ry: 0.05 },
  { cx: 0.5, cy: 0.15, rx: 0.04, ry: 0.03 },
];

function getMoonShadowPath(
  size: number,
  illumination: number,
  isWaxing: boolean
): string {
  const r = size / 2;
  const cx = r;
  const cy = r;

  if (illumination >= 0.995) return '';
  if (illumination <= 0.005) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${r} ${r} 0 1 0 ${cx} ${cy - r}`;
  }

  const innerR = r * Math.abs(2 * illumination - 1);
  const innerSweep = illumination < 0.5 ? 0 : 1;

  if (isWaxing) {
    // Shadow on left: outer arc goes counter-clockwise (left side), inner returns
    return `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${innerR} ${r} 0 0 ${innerSweep} ${cx} ${cy - r}`;
  } else {
    // Shadow on right: outer arc goes clockwise (right side), inner returns
    return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${innerR} ${r} 0 0 ${1 - innerSweep} ${cx} ${cy - r}`;
  }
}

export default function MoonVisual({ size, illumination, isWaxing }: Props) {
  const r = size / 2;
  const glowScale = useSharedValue(1);

  useEffect(() => {
    glowScale.value = withRepeat(
      withTiming(1.05, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [glowScale]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const shadowPath = getMoonShadowPath(size, illumination, isWaxing);

  return (
    <View style={{ width: size * 1.4, height: size * 1.4, alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer glow */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size * 1.4,
            height: size * 1.4,
            borderRadius: size * 0.7,
            backgroundColor: Colors.moonGlow,
          },
          glowStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size * 1.2,
            height: size * 1.2,
            borderRadius: size * 0.6,
            backgroundColor: 'rgba(245, 217, 126, 0.08)',
          },
          glowStyle,
        ]}
      />

      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient
            id="moonSurface"
            cx="40%"
            cy="35%"
            rx="55%"
            ry="55%"
          >
            <Stop offset="0%" stopColor={Colors.moonHighlight} stopOpacity="1" />
            <Stop offset="45%" stopColor={Colors.moonSurface} stopOpacity="1" />
            <Stop offset="100%" stopColor={Colors.moonDark} stopOpacity="1" />
          </RadialGradient>
          <RadialGradient
            id="moonInner"
            cx="45%"
            cy="40%"
            rx="50%"
            ry="50%"
          >
            <Stop offset="0%" stopColor="rgba(255,255,240,0.12)" stopOpacity="1" />
            <Stop offset="100%" stopColor="rgba(0,0,0,0)" stopOpacity="1" />
          </RadialGradient>
        </Defs>

        {/* Moon body */}
        <Circle cx={r} cy={r} r={r - 1} fill="url(#moonSurface)" />

        {/* Maria (darker regions) for realism */}
        <G opacity={0.15}>
          <Ellipse cx={r * 0.7} cy={r * 0.6} rx={r * 0.25} ry={r * 0.18} fill="#8B7355" />
          <Ellipse cx={r * 1.1} cy={r * 0.85} rx={r * 0.2} ry={r * 0.15} fill="#8B7355" />
          <Ellipse cx={r * 0.85} cy={r * 1.15} rx={r * 0.22} ry={r * 0.16} fill="#8B7355" />
        </G>

        {/* Craters */}
        <G opacity={0.8}>
          {CRATERS.map((crater, i) => (
            <Ellipse
              key={i}
              cx={crater.cx * size}
              cy={crater.cy * size}
              rx={crater.rx * size}
              ry={crater.ry * size}
              fill={i % 2 === 0 ? Colors.craterLight : Colors.craterDark}
            />
          ))}
        </G>

        {/* Light reflection */}
        <Circle cx={r} cy={r} r={r - 1} fill="url(#moonInner)" />

        {/* Phase shadow */}
        {shadowPath ? (
          <Path d={shadowPath} fill="rgba(6, 8, 24, 0.93)" />
        ) : null}
      </Svg>
    </View>
  );
}
