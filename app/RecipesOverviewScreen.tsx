import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";

import { StyleSheet, Text, View } from "react-native";

import { getAllCategoryRecipes } from "@/api/recipes";
import { useQuery } from "@tanstack/react-query";

//import component(s)
import Entypo from '@expo/vector-icons/Entypo';
import CustomButton from "./components/CustomButton";
import RecipeCardList from "./components/RecipeCardList";

import { RecipeContext } from "@/context/RecipeContext";
import { UserContext } from "@/context/UserContext";

import colors from "./constants/colors";

const RecipesOverviewScreen = () => {

    const { categoryId, categoryName } = useLocalSearchParams();
    const { accessToken } = useContext(UserContext);
    const { setCategoryName, setCategoryId, setTileId } = useContext(RecipeContext);

    const router = useRouter(); 

    const returnToHomeScreen = () => {
        // setTileId("");
        router.replace("./HomeScreen");
    };

    const navigateToAddRecipe = () => {
        setCategoryName(categoryName as string);
        setCategoryId(categoryId as string);
        router.replace("./AddRecipeScreen");
    };

    const {data, isLoading, error,} = useQuery({
        queryKey: ["categoryRecipes"],
        queryFn: () => getAllCategoryRecipes(accessToken, categoryId as string),
        // refetchOnMount: "always",
    });

    // if(data) console.log(data);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>All recipes inside of your <Text>{categoryName}</Text> food collection</Text>
            </View>

            <View style={styles.contentContainer}>
                {
                    data && data.categoryRecipes.length > 0 ? (
                        <RecipeCardList recipesData={data.categoryRecipes}></RecipeCardList>
                    ) : isLoading ? (
                        <View>
                            <Text>Fetching categories...</Text>
                        </View>
                    ) : error ? (
                        <View>
                            <Text>Error fetching categories!</Text>
                        </View>
                    ) : (
                        <View style={styles.emptyMessage}>
                            <View style={styles.icon}>
                                <Entypo name="emoji-sad" size={150} color={colors.secondaryAccent500} />
                            </View>
                            <Text style={styles.message}>{`It's feeling a bit lonely in here without any recipes inside of your ${categoryName} collection...`}</Text>
                            <Text style={styles.message}>Press on the <Text style={[styles.message, {color: colors.secondaryAccent500, fontStyle: "italic", fontWeight: "bold"}]}>{`Add a recipe!`}</Text> button to start adding some zing!</Text>
                        </View>
                    )
                }
            </View>

            <View style={styles.buttonContainer}>
                <View>
                    <CustomButton 
                        value="Go back" 
                        width={100} 
                        radius={20} 
                        onButtonPress={returnToHomeScreen}
                        color={colors.secondaryAccent500}
                    >

                    </CustomButton>
                </View>
                <View>
                    <CustomButton value="Add a recipe!" width={100} radius={20} onButtonPress={navigateToAddRecipe}></CustomButton>
                </View>
                
            </View>
            
    
        </View>
    )
};

export default RecipesOverviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    headerContainer: {
        textAlign: "center",
        padding: 30,
        marginTop: 30,
    },

    contentContainer: {
        flex: 1,
    },

    header: {
        color: colors.secondaryAccent500,
        fontWeight: "600",
        fontSize: 30,
    },

    buttonContainer: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 50,
    },

    icon: {
        alignItems: "center",
        justifyContent: "center",
    },

    message: {
        marginVertical: 30,
        fontSize: 24,
    },

    emptyMessage: {
        padding: 30,
    }
});