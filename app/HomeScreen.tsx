import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";

import { UserContext } from "../context/UserContext";

//import api function to fetch categories of cuisines belonging to the user
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../api/categories";

import colors from "./constants/colors";

const HomeScreen = () => {
    const router = useRouter();
    const {currentUser, setCurrentUser, token, setToken} = useContext(UserContext);
    
    const logOut = () => {
        setCurrentUser(null);
        setToken("");
    };

    // useEffect to handle signing out and re-directing to the login screen
    useEffect(() => {
        if(
            (!currentUser || currentUser === null) ||
            (!token || !token.length)
        ){
            router.replace("/LoginScreen");  
        }  
    }, [router, currentUser, token]);

    const {data, isLoading, error} = useQuery({
        queryKey: ["userCategories"],
        queryFn: getAllCategories(token),
    });

    // if(isLoading) return <ActivityIndicator size="large"></ActivityIndicator>;
    // if(error) return <Text>Error fetching categories</Text>;

    return (
        <View style={styles.container}>
            <View>
                {
                    isLoading
                        ? <ActivityIndicator size="large"></ActivityIndicator>
                        : error ? <Text>Error fetching user categories!</Text>
                        : !data.length ? (
                            <Text>You currently don&apos;t have any categories that you&apos;ve added.</Text>
                        )
                        : (
                            <>
                                <Text>I AM THE HOME SCREEN!</Text>
                                <Button title="Sign out" onPress={logOut}></Button>
                            </>
                        )            
                }
            </View>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        backgroundColor: colors.backgroundPrimary,
    },

    mainContent: {
        alignItems: "center",
        justifyContent: "center",
    }
});