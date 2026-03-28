export interface LocationData {
  lat: number;
  lon: number;
  cityName: string;
}

export interface NotificationSettings {
  fullMoon: boolean;
  newMoon: boolean;
  time: string;
}

export interface Preferences {
  location?: LocationData;
  notificationSettings?: NotificationSettings;
}
