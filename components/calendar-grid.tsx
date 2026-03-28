import React, { useMemo, useCallback } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import MoonPhaseIcon from './moon-phase-icon';
import { getCalendarMoonData, isFullMoon, isNewMoon } from '@/utils/moon';
import { useTranslation } from '@/lib/i18n';

interface Props {
  year: number;
  month: number;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
}

export default function CalendarGrid({ year, month, selectedDay, onSelectDay }: Props) {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const gridWidth = Math.min(width - 32, 400);
  const cellSize = Math.floor(gridWidth / 7);
  const iconSize = Math.max(16, cellSize * 0.42);

  const moonDataMap = useMemo(
    () => getCalendarMoonData(year, month),
    [year, month]
  );

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    // Convert Sunday=0 to Monday-start: Mon=0, Sun=6
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    // Fill remaining cells to complete the grid
    while (days.length % 7 !== 0) {
      days.push(null);
    }
    return days;
  }, [year, month]);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDay = isCurrentMonth ? today.getDate() : -1;

  const renderCell = useCallback(
    (day: number | null, index: number) => {
      if (day === null) {
        return <View key={`empty-${index}`} style={{ width: cellSize, height: cellSize + 12 }} />;
      }

      const data = moonDataMap.get(day);
      const isFull = data ? isFullMoon(data) : false;
      const isNew = data ? isNewMoon(data) : false;
      const isSelected = day === selectedDay;
      const isToday = day === todayDay;

      return (
        <Pressable
          key={day}
          onPress={() => onSelectDay(day)}
          style={({ pressed }) => ({
            width: cellSize,
            height: cellSize + 12,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            borderRadius: 8,
            borderCurve: 'continuous',
            backgroundColor: isSelected
              ? isFull
                ? 'rgba(245, 217, 126, 0.25)'
                : 'rgba(200, 214, 229, 0.12)'
              : isFull
                ? 'rgba(245, 217, 126, 0.1)'
                : 'transparent',
            borderWidth: isToday ? 1 : 0,
            borderColor: Colors.accent,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            style={{
              fontFamily: Fonts.medium,
              fontSize: 11,
              color: isFull
                ? Colors.accent
                : isNew
                  ? Colors.secondaryDim
                  : Colors.secondary,
            }}
          >
            {day}
          </Text>
          {data && (
            <MoonPhaseIcon
              size={iconSize}
              illumination={data.illumination}
              isWaxing={data.isWaxing}
              isFullMoon={isFull}
              isNewMoon={isNew}
            />
          )}
        </Pressable>
      );
    },
    [cellSize, iconSize, moonDataMap, selectedDay, todayDay, onSelectDay]
  );

  const weeks = useMemo(() => {
    const result: (number | null)[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7));
    }
    return result;
  }, [calendarDays]);

  return (
    <View style={{ alignItems: 'center' }}>
      {/* Day labels */}
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        {t.dayLabels.map((label, idx) => (
          <View key={`${label}-${idx}`} style={{ width: cellSize, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: Fonts.medium,
                fontSize: 11,
                color: Colors.secondaryDim,
                textTransform: 'uppercase',
              }}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Grid rows */}
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={{ flexDirection: 'row' }}>
          {week.map((day, dayIndex) => renderCell(day, weekIndex * 7 + dayIndex))}
        </View>
      ))}
    </View>
  );
}
