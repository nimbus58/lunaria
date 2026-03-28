import React from 'react';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';

interface Props {
  size: number;
  illumination: number;
  isWaxing: boolean;
  isFullMoon?: boolean;
  isNewMoon?: boolean;
}

function getSmallMoonShadow(
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
    return `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${innerR} ${r} 0 0 ${innerSweep} ${cx} ${cy - r}`;
  } else {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${innerR} ${r} 0 0 ${1 - innerSweep} ${cx} ${cy - r}`;
  }
}

export default function MoonPhaseIcon({
  size,
  illumination,
  isWaxing,
}: Props) {
  const r = size / 2;
  const shadow = getSmallMoonShadow(size, illumination, isWaxing);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id={`mp_${size}`} cx="40%" cy="35%" rx="55%" ry="55%">
          <Stop offset="0%" stopColor="#FFF5D6" />
          <Stop offset="50%" stopColor="#E8D5A0" />
          <Stop offset="100%" stopColor="#B8A070" />
        </RadialGradient>
      </Defs>
      <Circle cx={r} cy={r} r={r - 0.5} fill={`url(#mp_${size})`} />
      {shadow ? <Path d={shadow} fill="rgba(6, 8, 24, 0.92)" /> : null}
    </Svg>
  );
}
