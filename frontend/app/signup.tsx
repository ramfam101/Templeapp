import { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { router } from "expo-router";
import axios from "axios";

export default function SignupScreen() {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(""); // Format: YYYY-MM-DD
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("client"); // or 'admin', 'priest'

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

      Alert.alert("Success", "Account created! Please login.");
      router.back(); // go back to login screen
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
      Alert.alert("Signup failed", "Check your inputs or use a different email.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>First Name:</Text>
      <TextInput value={firstName} onChangeText={setFirstName} style={inputStyle} />

      <Text>Last Name:</Text>
      <TextInput value={lastName} onChangeText={setLastName} style={inputStyle} />

      <Text>Date of Birth (YYYY-MM-DD):</Text>
      <TextInput value={dob} onChangeText={setDob} style={inputStyle} />

      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={inputStyle}
      />

      <Text>Password:</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={inputStyle} />

      <Text>Account Type (client/admin/priest):</Text>
      <TextInput value={accountType} onChangeText={setAccountType} style={inputStyle} />

      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  marginBottom: 10,
  padding: 8,
};
