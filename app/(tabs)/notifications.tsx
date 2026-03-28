import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Switch, ScrollView, Pressable, Platform } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { getUpcomingMoonEvents } from '@/utils/moon';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import ScreenBackground from '@/components/screen-background';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = ['00', '15', '30', '45'];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const notificationSettings = useAppStore((s) => s.getNotificationSettings());
  const setNotificationSettings = useAppStore((s) => s.setNotificationSettings);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { t, language } = useTranslation();

  const upcomingEvents = useMemo(
    () => getUpcomingMoonEvents(new Date(), 8),
    []
  );

  const formatTime = useCallback((time: string) => {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  }, []);

  const handleTimeSelect = useCallback(
    (hour: number, minute: string) => {
      const time = `${hour.toString().padStart(2, '0')}:${minute}`;
      setNotificationSettings({ time });
      setShowTimePicker(false);
    },
    [setNotificationSettings]
  );

  const formatEventDate = useCallback((date: Date) => {
    return date.toLocaleDateString(t.dateLocale, t.shortDateOptions);
  }, [t]);

  const handleLanguageChange = useCallback(
    (lang: Language) => {
      setLanguage(lang);
    },
    [setLanguage]
  );

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 20,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Animated.View entering={FadeIn.duration(600)} style={{ gap: 10 }}>
          <Text
            style={{
              fontFamily: Fonts.headingBold,
              fontSize: 28,
              color: Colors.text,
              letterSpacing: 2,
            }}
          >
            {t.notifications}
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: Colors.accent,
              opacity: 0.4,
              width: 100,
            }}
          />
        </Animated.View>

        {/* Language Toggle */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(50)}
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 16,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: Colors.border,
            padding: 20,
            gap: 14,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="language-outline" size={20} color={Colors.accent} />
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 16,
                color: Colors.text,
              }}
            >
              {t.language}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Pressable
              onPress={() => handleLanguageChange('en')}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
                borderCurve: 'continuous',
                backgroundColor:
                  language === 'en' ? Colors.accentDim : Colors.surfaceLight,
                borderWidth: 1.5,
                borderColor:
                  language === 'en' ? Colors.accent : Colors.border,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 20 }}>EN</Text>
              <Text
                style={{
                  fontFamily:
                    language === 'en' ? Fonts.semiBold : Fonts.regular,
                  fontSize: 13,
                  color:
                    language === 'en' ? Colors.accent : Colors.secondary,
                }}
              >
                {t.english}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleLanguageChange('fr')}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
                borderCurve: 'continuous',
                backgroundColor:
                  language === 'fr' ? Colors.accentDim : Colors.surfaceLight,
                borderWidth: 1.5,
                borderColor:
                  language === 'fr' ? Colors.accent : Colors.border,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 20 }}>FR</Text>
              <Text
                style={{
                  fontFamily:
                    language === 'fr' ? Fonts.semiBold : Fonts.regular,
                  fontSize: 13,
                  color:
                    language === 'fr' ? Colors.accent : Colors.secondary,
                }}
              >
                {t.french}
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Toggle Cards */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(100)}
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 16,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: Colors.border,
            overflow: 'hidden',
          }}
        >
          {/* Full Moon Toggle */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="moon" size={20} color={Colors.accent} />
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 16,
                  color: Colors.text,
                }}
              >
                {t.fullMoon}
              </Text>
            </View>
            <Switch
              value={notificationSettings.fullMoon}
              onValueChange={(value) =>
                setNotificationSettings({ fullMoon: value })
              }
              trackColor={{
                false: Colors.border,
                true: Colors.accent,
              }}
              thumbColor={Colors.text}
            />
          </View>

          <View style={{ height: 1, backgroundColor: Colors.border, marginHorizontal: 20 }} />

          {/* New Moon Toggle */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="moon-outline" size={20} color={Colors.secondary} />
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 16,
                  color: Colors.text,
                }}
              >
                {t.newMoon}
              </Text>
            </View>
            <Switch
              value={notificationSettings.newMoon}
              onValueChange={(value) =>
                setNotificationSettings({ newMoon: value })
              }
              trackColor={{
                false: Colors.border,
                true: Colors.accent,
              }}
              thumbColor={Colors.text}
            />
          </View>
        </Animated.View>

        {/* Notification Time */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 16,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: Colors.border,
            padding: 20,
            gap: 12,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
              <Ionicons name="time-outline" size={20} color={Colors.accent} />
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 16,
                  color: Colors.text,
                  flexShrink: 1,
                }}
              >
                {t.notifyMeAt}
              </Text>
            </View>
            <Pressable
              onPress={() => setShowTimePicker(!showTimePicker)}
              style={({ pressed }) => ({
                backgroundColor: Colors.borderLight,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 10,
                borderCurve: 'continuous',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: Fonts.semiBold,
                  fontSize: 15,
                  color: Colors.accent,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {formatTime(notificationSettings.time)}
              </Text>
            </Pressable>
          </View>

          {/* Time Picker Dropdown */}
          {showTimePicker && (
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={{
                backgroundColor: Colors.surfaceLight,
                borderRadius: 12,
                borderCurve: 'continuous',
                padding: 12,
                maxHeight: 200,
                gap: 4,
              }}
            >
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 180 }}
              >
                {HOURS.map((hour) =>
                  MINUTES.map((minute) => {
                    const timeStr = `${hour.toString().padStart(2, '0')}:${minute}`;
                    const isSelected = timeStr === notificationSettings.time;
                    return (
                      <Pressable
                        key={timeStr}
                        onPress={() => handleTimeSelect(hour, minute)}
                        style={({ pressed }) => ({
                          paddingVertical: 10,
                          paddingHorizontal: 16,
                          borderRadius: 8,
                          borderCurve: 'continuous',
                          backgroundColor: isSelected
                            ? Colors.accentDim
                            : pressed
                              ? Colors.border
                              : 'transparent',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        })}
                      >
                        <Text
                          style={{
                            fontFamily: isSelected ? Fonts.semiBold : Fonts.regular,
                            fontSize: 14,
                            color: isSelected ? Colors.accent : Colors.secondary,
                            fontVariant: ['tabular-nums'],
                          }}
                        >
                          {formatTime(timeStr)}
                        </Text>
                        {isSelected && (
                          <Ionicons name="checkmark" size={16} color={Colors.accent} />
                        )}
                      </Pressable>
                    );
                  })
                )}
              </ScrollView>
            </Animated.View>
          )}
        </Animated.View>

        {/* Upcoming Moons */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(300)}
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 16,
            borderCurve: 'continuous',
            borderWidth: 1,
            borderColor: Colors.border,
            padding: 20,
            gap: 14,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="calendar-outline" size={18} color={Colors.accent} />
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 16,
                color: Colors.text,
              }}
            >
              {t.upcomingMoons}
            </Text>
          </View>

          {upcomingEvents.map((event, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 4,
              }}
            >
              <Ionicons
                name={event.type === 'full' ? 'moon' : 'moon-outline'}
                size={16}
                color={event.type === 'full' ? Colors.accent : Colors.secondaryDim}
              />
              <Text
                selectable
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: Colors.secondary,
                  flex: 1,
                }}
              >
                {formatEventDate(event.date)}
              </Text>
              <View
                style={{
                  backgroundColor:
                    event.type === 'full' ? Colors.accentDim : 'rgba(200, 214, 229, 0.08)',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                  borderCurve: 'continuous',
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    fontSize: 12,
                    color: event.type === 'full' ? Colors.accent : Colors.secondaryDim,
                  }}
                >
                  {event.type === 'full' ? t.fullMoon : t.newMoon}
                </Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Info Note */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(400)}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
            paddingHorizontal: 8,
          }}
        >
          <Ionicons name="information-circle-outline" size={16} color={Colors.textDim} style={{ marginTop: 2 }} />
          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: 12,
              color: Colors.textDim,
              flex: 1,
              lineHeight: 18,
            }}
          >
            {Platform.OS === 'web' ? t.infoWeb : t.infoMobile}
          </Text>
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}
