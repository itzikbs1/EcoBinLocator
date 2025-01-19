import { Stack, Slot } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";
import LocationPermission from "./LocationPermission";
import { useState, useEffect } from "react";
import { View, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="LocationPermission" /> */}
    </Stack>
  );
}
