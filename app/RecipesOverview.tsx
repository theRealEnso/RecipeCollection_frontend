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
        <View style={styles.containerOuter}>
            <View style={styles.containerInner}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>All recipes inside of your <Text>{categoryName}</Text> food collection</Text>
                </View>

                <View style={styles.content}>
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
                            <View>
                                <View style={styles.icon}>
                                    <Entypo name="emoji-sad" size={150} color={colors.primaryAccent900} />
                                </View>
                                <Text style={styles.message}>{`It's feeling a bit lonely in here without any recipes inside of your ${categoryName} collection...`}</Text>
                                <Text style={styles.message}>Press on the <Text style={[styles.message, {color: colors.primaryAccent900, fontStyle: "italic", fontWeight: "bold"}]}>{`Add a recipe!`}</Text> button to start adding some zing!</Text>
                            </View>
                        )
                    }
                </View>

                <View style={styles.buttonContainer}>
                    <View>
                        <CustomButton value="Go back" width={100} radius={20} onButtonPress={returnToHomeScreen}></CustomButton>
                    </View>
                    <View>
                        <CustomButton value="Add a recipe!" width={100} radius={20} onButtonPress={navigateToAddRecipe}></CustomButton>
                    </View>
                    
                </View>
                
            </View>
        </View>
    )
};

export default RecipesOverview;

const styles = StyleSheet.create({
    containerOuter: {
        flex: 1,
        marginVertical: 50,
        alignItems: "center",
        justifyContent: "center",
    },

    containerInner: {
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center"
    },

    content: {
      flex: 1,
      padding: 30,
      marginVertical: 40,  
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
    }
});