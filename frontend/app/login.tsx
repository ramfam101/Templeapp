import { useState } from "react";
import { useUser } from "../context/UserContext";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import styles from "@/styles/pages/loginStyles";
import { saveSecureValue } from "@/utils/secureStore";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const { login } = useUser();

  const handleLogin = async () => {
    try {
        console.log("before");
        const res = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password,
        });
        console.log("After");

        const { token, accountType, name } = res.data;
        await saveSecureValue("authToken", token);
        await saveSecureValue("accountType", accountType);
        await saveSecureValue("name", name);
        await login({ token, accountType, name });

        router.replace("/");
    } 
        catch (err: any) {
        console.log(err?.response?.data || err.message);
        Alert.alert("Login failed", "Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        style={styles.input}
      />

      <Button title="Login" onPress={handleLogin} />

      <View style={styles.signupButton}>
        <Button title="Create an Account" onPress={() => router.replace("/signup")} />
      </View>
    </View>
  );
}
