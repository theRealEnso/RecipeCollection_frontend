import { Image, ScrollView, StyleSheet, Text, View, } from "react-native";

// import colors
import colors from "../constants/colors";

//import type(s)
import { CookingInstructions, Ingredient, RecipeSubInstructions, SubIngredient } from "@/types/Recipe";

type RecipeDetailsProps = {
    recipeOwner: string;
    nameOfDish: string;
    imageUrl: string;
    specialEquipment: string;
    ingredients: Ingredient[];
    subIngredients: SubIngredient[];
    cookingInstructions: CookingInstructions[];
    subInstructions: RecipeSubInstructions[]
}

const RecipeDetails = (
    {
        recipeOwner, 
        nameOfDish, 
        imageUrl,
        specialEquipment,
        ingredients,
        subIngredients,
        cookingInstructions,
        subInstructions, 
    }: RecipeDetailsProps) => {
    return (
        <ScrollView>
            <View style={styles.mainContentContainer}>
                <View>
                    <Text style={styles.header}>{nameOfDish}</Text>
                </View>
                <View style={styles.imageContainer}>
                    <Image src={imageUrl} style={styles.image} />
                </View>
                <View>
                    <Text style={styles.subHeader}>Ingredients</Text>
                    {
                        
                    }
                </View>
            </View>
        </ScrollView>
    );
};

export default RecipeDetails;

const styles = StyleSheet.create({
        mainContentContainer: {
        alignItems: "center",
    },

    imageContainer: {
        height: 350,
        width: 350,
        borderRadius: 50,
        overflow: "hidden",
        marginVertical: 20,
    },

    image: {
        height: 350,
        width: 350,
        objectFit: "cover",
    },

    header: {
        fontSize: 30,
        color: colors.primaryAccent900,
        fontWeight: "bold",
        marginVertical: 20,
    },

    subHeader: {
        fontSize: 24,
        color: colors.primaryAccent600,
        fontWeight: "bold",
    },
});