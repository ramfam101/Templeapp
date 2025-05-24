import { createContext, useContext, useState, ReactNode } from "react";

type User = {
    name: String;
    accountType: String;
    token: String;
} | null;

type UserContextType = {
    user: User;
    login: (userData: User) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<User>(null);

    const login = (userData: User) => setUser(userData);
    const logout = () => setUser(null);

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