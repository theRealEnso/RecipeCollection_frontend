import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";

//import context
import { UserContext } from "../context/UserContext";

//import components
import CuisineList from "./components/CuisineList";

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
        queryFn: () => getAllCategories(token),
    });

    // useEffect(() => {
    //     if (data) {
    //         console.log("Fetched categories data:", data);
    //     }
    // }, [data]);


    // if(isLoading) return <ActivityIndicator size="large"></ActivityIndicator>;
    // if(error) return <Text>Error fetching categories</Text>;

    return (
        <View style={styles.container}>
            <View style={styles.mainContent}>
                {
                    isLoading
                        ? <ActivityIndicator size="large"></ActivityIndicator>
                        : error ? <Text>Error fetching user categories!</Text>
                        : data && data.categories && Array.isArray(data.categories) && data.categories.length ? (
                            <View>
                                <CuisineList categoriesData={data.categories}></CuisineList>
                                <View>
                                    <Text>I AM THE HOME SCREEN!</Text>
                                    <Button title="Sign out" onPress={logOut}></Button>
                                </View>   

                            </View>
                        )
                        : (
                            <Text>You currently do not have any cuisines added. Start adding!</Text>
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