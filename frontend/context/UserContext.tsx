import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { router } from "expo-router"; 
import { jwtDecode } from "jwt-decode";

type User = {
    name: string;
    accountType: string;
    token: string;
} | null;

type UserContextType = {
    user: User;
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
  const loadUser = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const accountType = await AsyncStorage.getItem("accountType");
    const name = await AsyncStorage.getItem("name");

    if (token && accountType && name) {
      try {
        const decoded: any = jwtDecode(token); // you'll need to import jwt-decode
        const now = Date.now() / 1000; // current time in seconds

        if (decoded.exp > now) {
          setUser({ token, accountType, name });

          // optional redirect if not already routed
          router.replace("/");
        } else {
          console.log("🛑 Token expired");
          await AsyncStorage.multiRemove(["authToken", "accountType", "name"]);
          setUser(null);
          router.replace("/login"); // force back to login
        }
      } catch (e) {
        console.error("❌ Error decoding token:", e);
        setUser(null);
      }
    }
  };

  loadUser();
}, []);
    // 🔧 edited here — store token and user info on login
    const login = async (userData: User) => {
        if (!userData) return;
        await AsyncStorage.setItem("authToken", userData.token);
        await AsyncStorage.setItem("accountType", userData.accountType);
        await AsyncStorage.setItem("name", userData.name);
        setUser(userData);
    };

    // 🔧 edited here — clear stored info on logout
    const logout = async () => {
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("accountType");
        await AsyncStorage.removeItem("name");
        setUser(null);
        router.replace("/"); // back to login
    };

    return(
        <UserContext.Provider value = {{user, login, logout}}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser(){

    const context = useContext(UserContext);
    if(!context) throw new Error("not used within userProvider");
    return context;
}