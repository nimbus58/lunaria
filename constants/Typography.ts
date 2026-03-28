import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import {
  Cinzel_400Regular,
  Cinzel_700Bold,
} from "@expo-google-fonts/cinzel";

export const FontMap = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Cinzel_400Regular,
  Cinzel_700Bold,
};

export const Fonts = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  heading: "Cinzel_400Regular",
  headingBold: "Cinzel_700Bold",
} as const;

export type FontWeight = keyof typeof Fonts;
