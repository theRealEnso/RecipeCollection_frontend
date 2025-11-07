import { useRouter } from "expo-router";

import { Image, Pressable, StyleSheet, Text, View } from "react-native";

//import types
import { RecipeDataProps } from "./RecipeCardList";

// import colors
import colors from "../constants/colors";

type Recipe = {
    recipe: RecipeDataProps
};

const RecipeCard = ({recipe}: Recipe) => {
    const router = useRouter();

    const { _id } = recipe;

    const navigateToRecipeScreen = () => {
        router.push({
            pathname: "/RecipeScreen",
            params: {
                _id,
            }
        })
    };

    return (
        <View style={styles.container}> 
            <Pressable onPress={navigateToRecipeScreen}>
                {/* image container */}
                <View style={styles.imageContainer}>
                    <Image src={recipe.imageUrl} style={styles.image}></Image>
                </View>

                <View style={styles.dishTitleContainer}>
                    <Text style={styles.recipeName}>{recipe.nameOfDish}</Text>
                </View>

                {/* recipe info container */}
                <View style={styles.recipeInfoContainer}>
                    <View style={styles.recipeInfo}>
                        <Text style={styles.subHeader}>Difficulty Level</Text>
                        <Text style={styles.data}>{recipe.difficultyLevel}</Text>
                    </View>
                    <View style={styles.recipeInfo}>
                        <Text style={styles.subHeader}>Cooking Time</Text>
                        <Text style={styles.data}>{recipe.timeToCook}</Text>
                    </View>
                    <View style={styles.recipeInfo}>
                        <Text style={styles.subHeader}>Yields:</Text>
                        <Text style={styles.data}>{recipe.numberOfServings}</Text>
                    </View>

                </View>
            </Pressable> 
            
        </View>
    )
};

export default RecipeCard;

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        width: 350,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "black",
        shadowOffset: {width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 1,
        overflow: "hidden",
        marginVertical: 10,
    },

    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 4,

    },

    image: {
        height: 250,
        width: 340,
        borderRadius: 20,
        objectFit: "cover",
    },

    dishTitleContainer: {
        marginVertical: 10,
        alignItems: "center", 
        justifyContent: "center",
    },

    recipeName: {
        color: colors.primaryAccent900,
        fontSize: 24,
        fontWeight: "bold",
        fontStyle: "normal",
        paddingHorizontal: 10,
    },
    
    recipeInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        overflow: "hidden",
        borderTopWidth: 2,
        borderColor: colors.secondaryAccent500,
    },
    
    recipeInfo: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRightWidth: 2,
        borderColor: colors.secondaryAccent500,
        overflow: "hidden",
    },

    subHeader: {
        color: colors.primaryAccent800,
        fontSize: 16,
        fontWeight: "bold",
        paddingHorizontal: 5,
    },

    data: {
        marginTop: 5,
        paddingHorizontal: 8,
        color: colors.secondaryAccent500,
        fontWeight: "500",
    }
});