import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { router } from "expo-router"; 
import { jwtDecode } from "jwt-decode";
import { saveSecureValue, getSecureValue, deleteSecureValue } from "@/utils/secureStore";

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

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = await getSecureValue("authToken");
      const accountType = await getSecureValue("accountType");
      const name = await getSecureValue("name");

      if (token && accountType && name) {
        try {
          const decoded: any = jwtDecode(token);
          const now = Date.now() / 1000;

          if (decoded.exp > now) {
            setUser({ token, accountType, name });
            router.replace("/");
          } else {
            console.log("🛑 Token expired");
            await logout(); // unified cleanup
          }
        } catch (e) {
          console.error("❌ Error decoding token:", e);
          await logout();
        }
      }
    };

    loadUser();
  }, []);

  const login = async (userData: User) => {
    if (!userData) return;
    await saveSecureValue("authToken", userData.token);
    await saveSecureValue("accountType", userData.accountType);
    await saveSecureValue("name", userData.name);
    setUser(userData);
  };

  const logout = async () => {
    await deleteSecureValue("authToken");
    await deleteSecureValue("accountType");
    await deleteSecureValue("name");
    setUser(null);
    router.replace("/login");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("not used within userProvider");
  return context;
}
