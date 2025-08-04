import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";

//import context
import { RecipeContext } from "@/context/RecipeContext";
import { UserContext } from "../context/UserContext";

//import components
import CuisineList from "./components/CuisineList";

//import api function to fetch categories of cuisines belonging to the user
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../api/categories";

import colors from "./constants/colors";

const HomeScreen = () => {
    const router = useRouter();
    const {currentUser, handleSetUser, handleSetTokens, accessToken,} = useContext(UserContext);
    const {
        setCookingDirections, 
        setIngredientsList, 
        setSubDirections, 
        setSubIngredients, 
        setSublistNames,
        setRecipeForm,
    } = useContext(RecipeContext);

    const resetState = () => {
        setCookingDirections([]);
        setIngredientsList([]);
        setSubDirections([]);
        setSubIngredients([]);
        setSublistNames([]);
        setRecipeForm({
            recipeOwner: "",
            nameOfDish: "",
            difficultyLevel: "",
            timeToCook: "",
            numberOfServings: "",
            specialEquipment: "",
        });
    }
    
    const logOut = () => {
        handleSetUser(null);
        handleSetTokens("", "");
        resetState();
    };

    // useEffect to handle signing out and re-directing to the login screen
    useEffect(() => {
        if(
            (!currentUser || currentUser === null) ||
            (!accessToken || !accessToken.length)
        ){
            router.replace("/LoginScreen");  
        }  
    }, [router, currentUser, accessToken]);

    const {data, isLoading, error} = useQuery({
        queryKey: ["userCategories"],
        queryFn: () => getAllCategories(accessToken),
        refetchOnMount: "always",
    });

    // if(accessToken) console.log("access token is:", accessToken);
    // if(refreshToken) console.log("refresh token is: ", refreshToken);

    return (
        <View style={styles.container}>
            
            {
                isLoading
                    ? <ActivityIndicator size="large"></ActivityIndicator>
                    : error ? <Text>Error fetching user categories!</Text>
                    : data && data.categories && Array.isArray(data.categories) && data.categories.length ? (
                        <View>
                            <CuisineList categoriesData={data.categories}></CuisineList>
                            <View>
                                <Button title="Sign out" onPress={logOut}></Button>
                            </View>   
                        </View>
                    )
                    : (
                        <Text>You currently do not have any cuisines added. Press the button at the bottom right to start adding!</Text>
                    )            
            }
            
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundPrimary,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        paddingVertical: 15,
    },
});