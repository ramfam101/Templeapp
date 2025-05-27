import { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";
import styles from "@/styles/pages/indexStyles";
import { getSecureValue } from "@/utils/secureStore";


export default function IndexPage() {
  const { user, login, logout } = useUser();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await getSecureValue("authToken");
      const accountType = await getSecureValue("accountType");
      const name = await getSecureValue("name");



      if (token && accountType && name) {
        try {
          const decoded: any = jwtDecode(token);
          const now = Date.now() / 1000;

          if (decoded.exp > now) {
            await login({ token, accountType, name });
          }
        } catch (e) {
          console.log("❌ Token decode failed:", e);
        }
      }

      setCheckingAuth(false);
    };

    checkLogin();
  }, []);

  const isAdminOrPriest = user?.accountType === "admin" || user?.accountType === "priest";

  if (checkingAuth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.containerWithGap}>
      {user ? (
        <>
          <Text style={styles.welcomeText}>
            Welcome, {isAdminOrPriest ? (user.accountType +" " + user.name) : "Client"}!
          </Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <Button title="Login / Sign Up" onPress={() => router.replace("/login")} />
      )}
    </View>
  );
}
