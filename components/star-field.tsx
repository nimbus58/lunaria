import React, { useMemo, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkle: boolean;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function TwinklingStar({ star }: { star: Star }) {
  const animatedOpacity = useSharedValue(star.opacity);

  useEffect(() => {
    const delay = (star.id * 371) % 3000;
    animatedOpacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(star.opacity * 0.3, {
          duration: 2000 + (star.id % 1000),
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      )
    );
  }, [animatedOpacity, star.id, star.opacity]);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: star.x,
    top: star.y,
    width: star.size,
    height: star.size,
    borderRadius: star.size / 2,
    backgroundColor: '#FFFFFF',
    opacity: animatedOpacity.value,
  }));

  return <Animated.View style={style} />;
}

function StaticStar({ star }: { star: Star }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: star.x,
        top: star.y,
        width: star.size,
        height: star.size,
        borderRadius: star.size / 2,
        backgroundColor: '#FFFFFF',
        opacity: star.opacity,
      }}
    />
  );
}

export default function StarField() {
  const { width, height } = useWindowDimensions();

  const stars = useMemo(() => {
    const rng = seededRandom(42);
    const result: Star[] = [];
    const count = Math.min(120, Math.floor((width * height) / 4000));

    for (let i = 0; i < count; i++) {
      result.push({
        id: i,
        x: rng() * width,
        y: rng() * height,
        size: rng() * 2 + 0.5,
        opacity: rng() * 0.6 + 0.15,
        twinkle: rng() > 0.65,
      });
    }
    return result;
  }, [width, height]);

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      pointerEvents="none"
    >
      {stars.map((star) =>
        star.twinkle ? (
          <TwinklingStar key={star.id} star={star} />
        ) : (
          <StaticStar key={star.id} star={star} />
        )
      )}
    </View>
  );
}
