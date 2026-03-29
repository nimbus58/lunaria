import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useTranslation } from '@/lib/i18n';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: '#5A6280',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: Fonts.medium,
          fontSize: 10,
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: Colors.tabBarBg,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.appTitle,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="moon" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t.months[new Date().getMonth()],
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="forecast"
        options={{
          title: t.forecast,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="telescope-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: t.notifications,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
