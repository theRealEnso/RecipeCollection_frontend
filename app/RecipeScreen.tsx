import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";

import { getDetailedRecipe } from "@/api/recipes";
import { useQuery } from "@tanstack/react-query";

import { UserContext } from "@/context/UserContext";

import { StyleSheet, Text, View } from "react-native";

//import component(s)
import CustomButton from "./components/CustomButton";
import RecipeDetails from "./RecipeDetailsScreen";

// import colors

const RecipeScreen = () => {
    const { _id } = useLocalSearchParams();
    const router = useRouter();

    const { accessToken } = useContext(UserContext);

    const {data, isLoading, error} = useQuery({
        queryKey: ["recipeData"],
        queryFn: () => getDetailedRecipe(accessToken, _id as string),
    });

    return (
    <View style={styles.container}>
        
        {
            data && data.recipeDetails && Object.keys(data.recipeDetails).length > 0 ? (
                (() => {
                    const {
                        recipeOwner, 
                        nameOfDish, 
                        imageUrl,
                        specialEquipment,
                        ingredients,
                        subIngredients,
                        cookingInstructions,
                        subInstructions, 
                        sublists,
                    } = data.recipeDetails;

                    return (
                        <RecipeDetails
                            recipeOwner={recipeOwner}
                            nameOfDish={nameOfDish}
                            imageUrl={imageUrl}
                            specialEquipment={specialEquipment}
                            ingredients={ingredients}
                            subIngredients={subIngredients}
                            cookingInstructions={cookingInstructions}
                            subInstructions={subInstructions}
                            sublists={sublists}
                        >
                        </RecipeDetails>
                    );
                })()
            ) : isLoading ? (
                    <Text>Fetching recipe details....</Text>
                ) : error ? (
                    <Text>Error getting recipe details!</Text>
            ) : null
        }
        
        {/* navigation buttons */}
        <View style={{marginBottom: 20,}}>
            <CustomButton
                value="Go back"
                width={100}
                onButtonPress={() => router.back()}
            />
        </View>
    </View>
    );
};

export default RecipeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        marginTop: 50,
    },
});