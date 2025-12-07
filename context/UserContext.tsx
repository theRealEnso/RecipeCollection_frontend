import * as SecureStore from "expo-secure-store";
import React, { createContext, FC, ReactNode, useEffect, useState, } from "react";

//import types
import { User } from "@/types/User";

type UserProviderProps = {
    children: ReactNode;
};

type UserContextTypes = {
    currentUser: null | User;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
    handleSetUser: (user: User | null) => Promise<void>;
    isTokenVerified: boolean;
    setIsTokenVerified: React.Dispatch<React.SetStateAction<boolean>>;
    accessToken: string;
    refreshToken: string;
    handleSetTokens: (accessToken: string, refreshToken: string) => Promise<void>;
    isHydrated: boolean;
    setIsHydrated: React.Dispatch<React.SetStateAction<boolean>>;
    loginError: null | string;
    setLoginError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const UserContext = createContext<UserContextTypes>({
    currentUser: null,
    setCurrentUser: () => {},
    handleSetUser: async () => {},
    isTokenVerified: false,
    setIsTokenVerified: () => {},
    accessToken: "",
    refreshToken: "",
    handleSetTokens: async () => {},
    isHydrated: false,
    setIsHydrated: () => {},
    loginError: null,
    setLoginError: () => {}
});

export const UserProvider: FC<UserProviderProps> = ({children}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isTokenVerified, setIsTokenVerified] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string>("");
    const [refreshToken, setRefreshToken] = useState<string>("");
    const [isHydrated, setIsHydrated] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<string | null>(null);

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
        await SecureStore.setItemAsync("refresh-token", refreshToken);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    };

    const value = {
        currentUser,
        setCurrentUser,
        handleSetUser,
        isTokenVerified,
        setIsTokenVerified,
        accessToken,
        refreshToken,
        handleSetTokens,
        isHydrated,
        setIsHydrated,
        loginError,
        setLoginError,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};