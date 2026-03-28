import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { getMoonData, getMoonTimes, isFullMoon, isNewMoon } from '@/utils/moon';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/lib/i18n';
import ScreenBackground from '@/components/screen-background';
import CalendarGrid from '@/components/calendar-grid';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const location = useAppStore((s) => s.getLocation());
  const { t } = useTranslation();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(
    today.getDate()
  );

  const selectedMoonData = useMemo(() => {
    if (selectedDay === null) return null;
    const date = new Date(year, month, selectedDay, 12, 0, 0);
    return getMoonData(date);
  }, [year, month, selectedDay]);

  const selectedMoonTimes = useMemo(() => {
    if (selectedDay === null) return null;
    const date = new Date(year, month, selectedDay, 12, 0, 0);
    return getMoonTimes(date, location.lat, location.lon);
  }, [year, month, selectedDay, location.lat, location.lon]);

  const goToPrevMonth = useCallback(() => {
    setSelectedDay(null);
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }, [month]);

  const goToNextMonth = useCallback(() => {
    setSelectedDay(null);
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }, [month]);

  const selectedDate = selectedDay
    ? new Date(year, month, selectedDay)
    : null;

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString(t.dateLocale, t.dateFormatOptions);
  };

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 16,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Animated.View entering={FadeIn.duration(600)}>
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

        {/* Month Navigation */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          <Pressable
            onPress={goToPrevMonth}
            hitSlop={16}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              padding: 8,
            })}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.secondary} />
          </Pressable>

          <Text
            style={{
              fontFamily: Fonts.heading,
              fontSize: 18,
              color: Colors.text,
              letterSpacing: 1,
              minWidth: 180,
              textAlign: 'center',
            }}
          >
            {t.months[month]} {year}
          </Text>

          <Pressable
            onPress={goToNextMonth}
            hitSlop={16}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              padding: 8,
            })}
          >
            <Ionicons name="chevron-forward" size={22} color={Colors.secondary} />
          </Pressable>
        </View>

        {/* Calendar Grid */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: 16,
              borderCurve: 'continuous',
              paddingVertical: 12,
              paddingHorizontal: 4,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          >
            <CalendarGrid
              year={year}
              month={month}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
          </View>
        </Animated.View>

        {/* Selected Day Detail */}
        {selectedDay !== null && selectedMoonData && selectedMoonTimes && (
          <Animated.View
            entering={FadeInUp.duration(400)}
            style={{
              backgroundColor: Colors.surface,
              borderRadius: 16,
              borderCurve: 'continuous',
              padding: 20,
              borderWidth: 1,
              borderColor: Colors.border,
              gap: 8,
            }}
          >
            <Text
              selectable
              style={{
                fontFamily: Fonts.headingBold,
                fontSize: 15,
                color: isFullMoon(selectedMoonData)
                  ? Colors.accent
                  : isNewMoon(selectedMoonData)
                    ? Colors.secondaryDim
                    : Colors.text,
                letterSpacing: 0.5,
              }}
            >
              {formatSelectedDate()}:
            </Text>
            <Text
              selectable
              style={{
                fontFamily: Fonts.regular,
                fontSize: 14,
                color: Colors.secondary,
              }}
            >
              {t.phases[selectedMoonData.phase]},{' '}
              {Math.round(selectedMoonData.illumination * 100)}% {t.illuminated}
            </Text>
            <View style={{ height: 1, backgroundColor: Colors.border, marginVertical: 4 }} />
            <View style={{ gap: 4 }}>
              <Text
                selectable
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 13,
                  color: Colors.secondaryDim,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {t.moonrise} {selectedMoonTimes.moonrise}
              </Text>
              <Text
                selectable
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 13,
                  color: Colors.secondaryDim,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {t.moonset} {selectedMoonTimes.moonset}
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}
