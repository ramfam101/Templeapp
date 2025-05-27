import { View, Text, Button } from "react-native";
import { useUser } from "@/context/UserContext";
import  {useEffect} from "react";
import { router } from "expo-router";

export default function HomeScreen() {
  const { user, logout } = useUser();

  useEffect (() => {
    if(user == null){
      router.replace("/login");
    }
  }, [user]);
  if(!user) return null;
  
  const isAdminOrPriest = user.accountType === "admin" || user.accountType === "priest";

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Welcome, {isAdminOrPriest ? "Admin or Priest" : "Client"}!
      </Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
