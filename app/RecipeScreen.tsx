import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";

import { getDetailedRecipe } from "@/api/recipes";
import { useQuery } from "@tanstack/react-query";

import { RecipeContext } from "@/context/RecipeContext";
import { UserContext } from "@/context/UserContext";

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

//import component(s)
import CustomButton from "./components/CustomButton";
import RecipeDetailsScreen from "./RecipeDetailsScreen";

//import colors
import colors from "./constants/colors";
const RecipeScreen = () => {
    const { _id } = useLocalSearchParams();
    const router = useRouter();

    const { accessToken, currentUser } = useContext(UserContext);
    const userId = currentUser ? currentUser.id : null;

    const { setSearchRecipesInput } = useContext(RecipeContext);

    const {data, isLoading, error} = useQuery({
        queryKey: ["recipeData", _id],
        queryFn: () => getDetailedRecipe(accessToken, _id as string),
        enabled: !!_id && !!userId && !!accessToken,
        gcTime: 0,
        staleTime: 0,
    });

    const recipeId = _id.toString();

    // console.log(recipeId);

    return (
    <View style={styles.container}>
        
        {
            isLoading ? 
            (
                <ActivityIndicator color={colors.primaryAccent000} size={24}/>
            ) : data && data.recipeDetails && Object.keys(data.recipeDetails).length > 0 ? (
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
                        averageRating,
                        ratingCount,
                    } = data.recipeDetails;

                    return (
                        <RecipeDetailsScreen
                            recipeOwner={recipeOwner}
                            nameOfDish={nameOfDish}
                            imageUrl={imageUrl}
                            specialEquipment={specialEquipment}
                            ingredients={ingredients}
                            subIngredients={subIngredients}
                            cookingInstructions={cookingInstructions}
                            subInstructions={subInstructions}
                            sublists={sublists}
                            id={recipeId}
                            averageRating={averageRating}
                            ratingCount={ratingCount}
                        >
                        </RecipeDetailsScreen>
                    );
                })()
            ) : isLoading ? (
                    <Text>Fetching recipe details....</Text>
                ) : error ? (
                    <Text>Error getting recipe details!</Text>
            ) : null
        }
        
        {/* navigation buttons */}
        <View style={{flexDirection: "row", padding: 10}}>
            <View style={{marginHorizontal: 10}}>
                <CustomButton
                    value="Go back"
                    width={100}
                    onButtonPress={() => router.back()}
                    radius={12}
                    color={colors.secondaryAccent600}
                />
            </View>

            <View style={{marginHorizontal: 10}}>
                <CustomButton
                    value="Return to Home"
                    width={130}
                    onButtonPress={() => {
                        setSearchRecipesInput("");
                        router.push("/(authenticated)/HomeScreen")
                    }}
                    radius={12}
                    color={colors.primaryAccent600}
                />
            </View>
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
        marginBottom: 10,
    },
});