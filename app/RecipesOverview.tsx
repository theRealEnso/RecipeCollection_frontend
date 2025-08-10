import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";

import { Button, StyleSheet, Text, View } from "react-native";

import { getAllCategoryRecipes } from "@/api/recipes";
import { useQuery } from "@tanstack/react-query";

//import component(s)
import CustomButton from "./components/CustomButton";

import { RecipeContext } from "@/context/RecipeContext";
import { UserContext } from "@/context/UserContext";

import colors from "./constants/colors";

const RecipesOverview = () => {

    const { categoryId, categoryName } = useLocalSearchParams();
    const { accessToken } = useContext(UserContext);
    const { setCategoryName, setCategoryId } = useContext(RecipeContext);

    const router = useRouter(); 

    const returnToHomeScreen = () => {
        router.replace("/HomeScreen");
    };

    const navigateToAddRecipe = () => {
        setCategoryName(categoryName as string);
        setCategoryId(categoryId as string);
        router.replace("/AddRecipeScreen");
    };

    const {data, isLoading, error} = useQuery({
        queryKey: ["categoryRecipes"],
        queryFn: () => getAllCategoryRecipes(accessToken, categoryId as string),
    });

    // if(data) console.log(data);

    return (
        <View style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>All recipes inside of your <Text>{categoryName}</Text> food collection</Text>
                </View>
                {
                    data && data.categoryRecipes.length > 0 ? (
                        <View>
                            <Text>Successfully fetched recipes!</Text>
                        </View>
                    ) : isLoading ? (
                        <View>
                            <Text>Fetching categories...</Text>
                        </View>
                    ) : error ? (
                        <View>
                            <Text>Error fetching categories!</Text>
                        </View>
                    ) : (
                        <View>
                            <Text>{`You currently don't have any recipes in your ${categoryName} collection.`}</Text>
                            <Text>{`Press on the "Add a recipe!" button to start adding recipes!`}</Text>
                        </View>
                    )
                }
                <View style={styles.buttonContainer}>
                    <CustomButton value="Add a recipe!" width={100} radius={20} onButtonPress={navigateToAddRecipe}></CustomButton>
                </View>
                
            </View>

            <Button title="Go back" onPress={returnToHomeScreen}></Button>
        </View>
    )
};

export default RecipesOverview;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 50,
    },

    mainContent: {
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center"
    },

    headerContainer: {
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 20,
    },

    header: {
        color: colors.primaryAccent500,
        fontWeight: "600",
        fontSize: 30,
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 50,
    }
});