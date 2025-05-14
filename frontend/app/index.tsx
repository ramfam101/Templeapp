import { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { router } from "expo-router";
import axios from "axios";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = process.env.EXPO_PUBLIC_API_URL;


  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });


      const { token, accountType } = res.data;

      if (accountType === "admin" || accountType === "priest") {
        router.push("/admin");
      } else {
        router.push("/client");
      }
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
      Alert.alert("Login failed", "Invalid email or password.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />

      <Button title="Login" onPress={handleLogin} />

      <View style={{ marginTop: 20 }}>
        <Button title="Create an Account" onPress={() => router.push("/signup")} />
      </View>
    </View>
  );
}
