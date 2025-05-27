import { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import styles from "@/styles/pages/singupStyles"; // ✅ styles import

export default function SignupScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(""); // Format: YYYY-MM-DD
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("client"); // or 'admin', 'priest'
  const { login } = useUser();

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, {
        firstName,
        lastName,
        dob,
        email,
        password,
        accountType,
      });

      const { token, accountType: type, name } = res.data;
      await login({ token, accountType: type, name });
      router.replace("/");
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
      Alert.alert("Signup failed", "Check your inputs or use a different email.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>First Name:</Text>
      <TextInput value={firstName} onChangeText={setFirstName} style={styles.input} />

      <Text>Last Name:</Text>
      <TextInput value={lastName} onChangeText={setLastName} style={styles.input} />

      <Text>Date of Birth (YYYY-MM-DD):</Text>
      <TextInput value={dob} onChangeText={setDob} style={styles.input} />

      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Text>Account Type (client/admin/priest):</Text>
      <TextInput value={accountType} onChangeText={setAccountType} style={styles.input} />

      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}
