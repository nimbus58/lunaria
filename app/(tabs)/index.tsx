import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { getMoonData, getMoonTimes, getNextMoonEvent } from '@/utils/moon';
import { requestLocation } from '@/utils/location';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/lib/i18n';
import ScreenBackground from '@/components/screen-background';
import MoonVisual from '@/components/moon-visual';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { t } = useTranslation();

  const location = useAppStore((s) => s.getLocation());
  const locationLoading = useAppStore((s) => s.locationLoading);
  const setLocation = useAppStore((s) => s.setLocation);
  const setLocationLoading = useAppStore((s) => s.setLocationLoading);

  const moonData = useMemo(() => getMoonData(currentDate), [currentDate]);
  const moonTimes = useMemo(
    () => getMoonTimes(currentDate, location.lat, location.lon),
    [currentDate, location.lat, location.lon]
  );
  const nextEvent = useMemo(() => getNextMoonEvent(currentDate), [currentDate]);

  const moonSize = Math.min(width * 0.52, 220);

  const fetchLocation = useCallback(async () => {
    setLocationLoading(true);
    try {
      const loc = await requestLocation();
      if (loc) {
        setLocation(loc);
      }
    } catch {
      // Keep default location
    } finally {
      setLocationLoading(false);
    }
  }, [setLocation, setLocationLoading]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setCurrentDate(new Date());
    await fetchLocation();
    setRefreshing(false);
  }, [fetchLocation]);

  const illuminationPct = Math.round(moonData.illumination * 100);

  const nextEventText = useMemo(() => {
    if (nextEvent.daysUntil === 0) {
      return nextEvent.type === 'full'
        ? t.fullMoonTonight
        : t.newMoonTonight;
    }
    return nextEvent.type === 'full'
      ? t.daysUntilFull(nextEvent.daysUntil)
      : t.daysUntilNew(nextEvent.daysUntil);
  }, [nextEvent, t]);

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 24,
          alignItems: 'center',
          gap: 8,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Animated.View entering={FadeIn.duration(800)}>
          <Text
            style={{
              fontFamily: Fonts.headingBold,
              fontSize: 28,
              color: Colors.text,
              textAlign: 'center',
              letterSpacing: 2,
            }}
          >
            {t.appTitle}
          </Text>
        </Animated.View>

        {/* Moon Visual */}
        <Animated.View
          entering={FadeInDown.duration(1000).delay(200)}
          style={{
            marginTop: 12,
            marginBottom: 4,
          }}
        >
          <MoonVisual
            size={moonSize}
            illumination={moonData.illumination}
            isWaxing={moonData.isWaxing}
          />
        </Animated.View>

        {/* Phase Name */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)}>
          <Text
            selectable
            style={{
              fontFamily: Fonts.headingBold,
              fontSize: 20,
              color: Colors.accent,
              textAlign: 'center',
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            {t.phases[moonData.phase]}
          </Text>
        </Animated.View>

        {/* Illumination */}
        <Animated.View entering={FadeInDown.duration(600).delay(500)}>
          <Text
            selectable
            style={{
              fontFamily: Fonts.regular,
              fontSize: 16,
              color: Colors.secondary,
              textAlign: 'center',
              fontVariant: ['tabular-nums'],
            }}
          >
            {illuminationPct}% {t.illuminated}
          </Text>
        </Animated.View>

        {/* Moonrise / Moonset */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(600)}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 40,
            marginTop: 16,
          }}
        >
          <View style={{ alignItems: 'center', gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="arrow-up-circle-outline" size={16} color={Colors.accent} />
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 13,
                  color: Colors.secondaryDim,
                }}
              >
                {t.moonrise}
              </Text>
            </View>
            <Text
              selectable
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 16,
                color: Colors.text,
                fontVariant: ['tabular-nums'],
              }}
            >
              {moonTimes.moonrise}
            </Text>
          </View>

          <View style={{ alignItems: 'center', gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="arrow-down-circle-outline" size={16} color={Colors.accent} />
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 13,
                  color: Colors.secondaryDim,
                }}
              >
                {t.moonset}
              </Text>
            </View>
            <Text
              selectable
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 16,
                color: Colors.text,
                fontVariant: ['tabular-nums'],
              }}
            >
              {moonTimes.moonset}
            </Text>
          </View>
        </Animated.View>

        {/* Next Event */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(700)}
          style={{ marginTop: 20 }}
        >
          <Text
            selectable
            style={{
              fontFamily: Fonts.heading,
              fontSize: 17,
              color: Colors.accent,
              textAlign: 'center',
              fontVariant: ['tabular-nums'],
            }}
          >
            {nextEventText}
          </Text>
        </Animated.View>

        {/* Location */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(800)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginTop: 24,
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: Colors.cardBg,
            borderRadius: 20,
            borderCurve: 'continuous',
          }}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color={Colors.accent} />
          ) : (
            <Ionicons name="location-outline" size={14} color={Colors.secondary} />
          )}
          <Text
            selectable
            style={{
              fontFamily: Fonts.regular,
              fontSize: 13,
              color: Colors.secondary,
            }}
          >
            {location.cityName}
          </Text>
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}
