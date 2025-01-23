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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
