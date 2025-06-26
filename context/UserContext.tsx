import * as SecureStore from "expo-secure-store";
import { createContext, FC, ReactNode, useEffect, useState, } from "react";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    access_token: string;
};

type UserProviderProps = {
    children: ReactNode;
};

type UserContextTypes = {
    currentUser: null | User;
    handleSetUser: (user: User | null) => Promise<void>;
    isTokenVerified: boolean;
    setIsTokenVerified: React.Dispatch<React.SetStateAction<boolean>>;
    token: string;
    handleSetAccessToken: (token: string) => Promise<void>;
    isHydrated: boolean;
    setIsHydrated: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserContext = createContext<UserContextTypes>({
    currentUser: null,
    handleSetUser: async () => {},
    isTokenVerified: false,
    setIsTokenVerified: () => {},
    token: "",
    handleSetAccessToken: async () => {},
    isHydrated: false,
    setIsHydrated: () => {},
});

export const UserProvider: FC<UserProviderProps> = ({children}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isTokenVerified, setIsTokenVerified] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");
    const [isHydrated, setIsHydrated] = useState<boolean>(false);

    useEffect(() => {
        const loadUserFromStorage = async () => {
            try {
                const storedUser = await SecureStore.getItemAsync("user");
                const storedToken = await SecureStore.getItemAsync("accessToken");

                if(storedUser && storedToken){
                    setCurrentUser(JSON.parse(storedUser));
                    setToken(storedToken);
                }
            } catch(error){
                console.error(`Failed to load user from storage, ${error}`)
            } finally {
                setIsHydrated(true);
            }
        }

        loadUserFromStorage();
    }, []);

    const handleSetUser = async (user: User | null) => {
        setCurrentUser(user);

        if(user){
            await SecureStore.setItemAsync("user", JSON.stringify(user));
        } else {
            await SecureStore.deleteItemAsync("user");
        }
    };

    const handleSetAccessToken = async (token: string) => {
        setToken(token);

        if(token){
            await SecureStore.setItemAsync("accessToken", token);
        } else {
            await SecureStore.deleteItemAsync("accessToken");
        }
    };

    const value = {
        currentUser,
        handleSetUser,
        isTokenVerified,
        setIsTokenVerified,
        token,
        handleSetAccessToken,
        isHydrated,
        setIsHydrated,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};