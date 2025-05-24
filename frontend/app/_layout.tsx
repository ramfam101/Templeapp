import { Stack } from "expo-router";
import { UserProvider } from "@/context/UserContext";
import { SafeAreaProvider } from "react-native-safe-area-context";


export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <Stack />
      </UserProvider>
    </SafeAreaProvider>
  );
}
