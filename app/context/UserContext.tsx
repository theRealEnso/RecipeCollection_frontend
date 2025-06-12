import { createContext, FC, ReactNode, useState } from "react";

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
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
    isTokenVerified: boolean;
    setIsTokenVerified: React.Dispatch<React.SetStateAction<boolean>>;
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
};

export const UserContext = createContext<UserContextTypes>({
    currentUser: null,
    setCurrentUser: () => {},
    isTokenVerified: false,
    setIsTokenVerified: () => {},
    token: "",
    setToken: () => {},
});

export const UserProvider: FC<UserProviderProps> = ({children}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isTokenVerified, setIsTokenVerified] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");

    const value = {
        currentUser,
        setCurrentUser,
        isTokenVerified,
        setIsTokenVerified,
        token,
        setToken,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};