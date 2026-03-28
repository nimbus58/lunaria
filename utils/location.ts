import * as Location from 'expo-location';
import type { LocationData } from '@/store/types';

export async function requestLocation(): Promise<LocationData | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });

    const { latitude: lat, longitude: lon } = position.coords;

    let cityName = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;

    try {
      const [geocode] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
      if (geocode) {
        const parts = [geocode.city, geocode.region].filter(Boolean);
        if (parts.length > 0) {
          cityName = parts.join(', ');
        }
      }
    } catch {
      // Reverse geocoding failed; use coordinates
    }

    return { lat, lon, cityName };
  } catch {
    return null;
  }
}
