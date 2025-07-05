import * as SecureStore from "expo-secure-store";
import { createContext, FC, ReactNode, useEffect, useState, } from "react";

//import types
import { User } from "@/types/User";

type UserProviderProps = {
    children: ReactNode;
};

type UserContextTypes = {
    currentUser: null | User;
    handleSetUser: (user: User | null) => Promise<void>;
    isTokenVerified: boolean;
    setIsTokenVerified: React.Dispatch<React.SetStateAction<boolean>>;
    accessToken: string;
    refreshToken: string;
    handleSetTokens: (accessToken: string, refreshToken: string) => Promise<void>;
    isHydrated: boolean;
    setIsHydrated: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserContext = createContext<UserContextTypes>({
    currentUser: null,
    handleSetUser: async () => {},
    isTokenVerified: false,
    setIsTokenVerified: () => {},
    accessToken: "",
    refreshToken: "",
    handleSetTokens: async () => {},
    isHydrated: false,
    setIsHydrated: () => {},
});

export const UserProvider: FC<UserProviderProps> = ({children}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isTokenVerified, setIsTokenVerified] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string>("");
    const [refreshToken, setRefreshToken] = useState<string>("");
    const [isHydrated, setIsHydrated] = useState<boolean>(false);

    useEffect(() => {
        const loadUserFromStorage = async () => {
            try {
                const storedUser = await SecureStore.getItemAsync("user");
                const storedAccessToken = await SecureStore.getItemAsync("access-token");
                const storedRefreshToken = await SecureStore.getItemAsync("refresh-token");

                if(storedUser && storedAccessToken && storedRefreshToken){
                    setCurrentUser(JSON.parse(storedUser));
                    setAccessToken(storedAccessToken);
                    setRefreshToken(storedRefreshToken);
                }
            } catch(error){
                console.error(`Failed to load user information from storage, ${error}`)
            } finally {
                setIsHydrated(true);
            }
        };

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

    const handleSetTokens = async (accessToken: string, refreshToken: string) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        if(accessToken && refreshToken){
            await SecureStore.setItemAsync("access-token", accessToken);
            await SecureStore.setItemAsync("refresh-token", refreshToken);
        } else {
            await SecureStore.deleteItemAsync("access-token");
            await SecureStore.deleteItemAsync("refresh-token");
        }
    };

    const value = {
        currentUser,
        handleSetUser,
        isTokenVerified,
        setIsTokenVerified,
        accessToken,
        refreshToken,
        handleSetTokens,
        isHydrated,
        setIsHydrated,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};