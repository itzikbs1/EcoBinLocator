// import React from "react";
// import { Stack } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";

// export default function RootLayout() {
//   return (
//     <SafeAreaProvider>
//       <Stack initialRouteName="index">
//         <Stack.Screen
//           name="index"
//           options={{
//             title: "Home",
//             headerShown: false,
//           }}
//         />
//         {/* <Stack.Screen
//           name="Map"
//           options={{
//             title: "Map",
//             headerShown: true,
//             headerBackTitle: "Back",
//           }}
//         /> */}
//       </Stack>
//     </SafeAreaProvider>
//   );
// }
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import LocationPermission from "./LocationPermission";
// import { useState, useEffect } from "react";
// import { View, Text } from "react-native";

// console.log("Layout React:", React); // Add this at the top after imports

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="index" />
        <Stack.Screen name="Map" /> */}
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          {/* <Stack.Screen
            name="Map"
            options={{
              headerShown: false,
            }}
          /> */}
        </Stack>
      </Stack>
    </SafeAreaProvider>
  );
}
