import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { getForecastDays, isFullMoon, isNewMoon } from '@/utils/moon';
import type { ForecastDay } from '@/utils/moon';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/lib/i18n';
import { requestLocation } from '@/utils/location';
import ScreenBackground from '@/components/screen-background';
import MoonPhaseIcon from '@/components/moon-phase-icon';

function ForecastCard({
  item,
  index,
  dayLabel,
  phaseName,
  illuminationLabel,
}: {
  item: ForecastDay;
  index: number;
  dayLabel: string;
  phaseName: string;
  illuminationLabel: string;
}) {
  const illuminationPct = Math.round(item.moonData.illumination * 100);
  const isFull = isFullMoon(item.moonData);
  const isNew = isNewMoon(item.moonData);

  const accentColor = isFull
    ? Colors.accent
    : isNew
      ? Colors.secondaryDim
      : Colors.secondary;

  return (
    <Animated.View
      entering={FadeInRight.duration(400).delay(index * 60)}
      style={{
        backgroundColor: Colors.surface,
        borderRadius: 16,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: isFull ? 'rgba(245, 217, 126, 0.3)' : Colors.border,
        padding: 16,
        gap: 12,
      }}
    >
      {/* Top row: day label + date */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              backgroundColor: isFull
                ? Colors.accentDim
                : 'rgba(200, 214, 229, 0.06)',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              borderCurve: 'continuous',
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 12,
                color: isFull ? Colors.accent : Colors.secondary,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {dayLabel}
            </Text>
          </View>
        </View>

        {/* Illumination badge */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Text
            selectable
            style={{
              fontFamily: Fonts.semiBold,
              fontSize: 20,
              color: accentColor,
              fontVariant: ['tabular-nums'],
            }}
          >
            {illuminationPct}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: 11,
              color: Colors.secondaryDim,
            }}
          >
            {'%'}
          </Text>
        </View>
      </View>

      {/* Middle: Moon icon + Phase name */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 22,
            backgroundColor: isFull
              ? 'rgba(245, 217, 126, 0.08)'
              : 'rgba(200, 214, 229, 0.04)',
          }}
        >
          <MoonPhaseIcon
            size={32}
            illumination={item.moonData.illumination}
            isWaxing={item.moonData.isWaxing}
          />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text
            selectable
            style={{
              fontFamily: Fonts.heading,
              fontSize: 15,
              color: isFull ? Colors.accent : Colors.text,
              letterSpacing: 0.5,
            }}
          >
            {phaseName}
          </Text>
          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: 12,
              color: Colors.secondaryDim,
            }}
          >
            {illuminationLabel}
          </Text>
        </View>
      </View>

      {/* Bottom row: Moonrise / Moonset */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20,
          paddingTop: 4,
          borderTopWidth: 1,
          borderTopColor: isFull
            ? 'rgba(245, 217, 126, 0.12)'
            : Colors.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
          <Ionicons
            name="arrow-up-circle-outline"
            size={14}
            color={Colors.accent}
          />
          <Text
            selectable
            style={{
              fontFamily: Fonts.medium,
              fontSize: 13,
              color: Colors.secondary,
              fontVariant: ['tabular-nums'],
            }}
          >
            {item.moonTimes.moonrise}
          </Text>
        </View>

        <View
          style={{
            width: 1,
            height: 14,
            backgroundColor: Colors.border,
          }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
          <Ionicons
            name="arrow-down-circle-outline"
            size={14}
            color={Colors.secondaryDim}
          />
          <Text
            selectable
            style={{
              fontFamily: Fonts.medium,
              fontSize: 13,
              color: Colors.secondary,
              fontVariant: ['tabular-nums'],
            }}
          >
            {item.moonTimes.moonset}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function ForecastScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { t } = useTranslation();

  const location = useAppStore((s) => s.getLocation());
  const locationLoading = useAppStore((s) => s.locationLoading);
  const setLocation = useAppStore((s) => s.setLocation);
  const setLocationLoading = useAppStore((s) => s.setLocationLoading);

  const forecastDays = useMemo(
    () => getForecastDays(currentDate, 10, location.lat, location.lon),
    [currentDate, location.lat, location.lon]
  );

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

  const getDayLabel = useCallback(
    (date: Date, index: number): string => {
      if (index === 0) return t.today;
      if (index === 1) return t.tomorrow;
      const dayName = t.dayNamesShort[date.getDay()];
      const dayNum = date.getDate();
      const monthName = t.months[date.getMonth()].substring(0, 3);
      return `${dayName} ${dayNum} ${monthName}`;
    },
    [t]
  );

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 20,
          gap: 12,
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
        {/* Header */}
        <Animated.View entering={FadeIn.duration(600)} style={{ gap: 10, marginBottom: 4 }}>
          <Text
            style={{
              fontFamily: Fonts.headingBold,
              fontSize: 28,
              color: Colors.text,
              letterSpacing: 2,
            }}
          >
            {t.forecast}
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: Colors.accent,
              opacity: 0.4,
              width: 80,
            }}
          />
        </Animated.View>

        {/* Subtitle + Location */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(100)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: 14,
              color: Colors.secondaryDim,
              flex: 1,
            }}
          >
            {t.tenDayForecast}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingHorizontal: 10,
              paddingVertical: 4,
              backgroundColor: Colors.cardBg,
              borderRadius: 12,
              borderCurve: 'continuous',
            }}
          >
            {locationLoading ? (
              <ActivityIndicator size="small" color={Colors.accent} />
            ) : (
              <Ionicons name="location-outline" size={12} color={Colors.secondary} />
            )}
            <Text
              selectable
              style={{
                fontFamily: Fonts.regular,
                fontSize: 11,
                color: Colors.secondary,
              }}
            >
              {location.cityName}
            </Text>
          </View>
        </Animated.View>

        {/* Forecast Cards */}
        {forecastDays.length === 0 ? (
          <Animated.View
            entering={FadeIn.duration(400)}
            style={{
              backgroundColor: Colors.surface,
              borderRadius: 16,
              borderCurve: 'continuous',
              padding: 40,
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Ionicons name="cloudy-night-outline" size={32} color={Colors.secondaryDim} />
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 14,
                color: Colors.secondaryDim,
                textAlign: 'center',
              }}
            >
              {t.noData}
            </Text>
          </Animated.View>
        ) : (
          forecastDays.map((day, index) => (
            <ForecastCard
              key={index}
              item={day}
              index={index}
              dayLabel={getDayLabel(day.date, index)}
              phaseName={t.phases[day.moonData.phase]}
              illuminationLabel={`${Math.round(day.moonData.illumination * 100)}% ${t.illuminated}`}
            />
          ))
        )}
      </ScrollView>
    </ScreenBackground>
  );
}
