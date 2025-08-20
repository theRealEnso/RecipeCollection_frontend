import { Image, StyleSheet, Text, View } from "react-native";

//import types
import { RecipeDataProps } from "./RecipeCardList";

type Recipe = {
    recipe: RecipeDataProps
};

const RecipeCard = ({recipe}: Recipe) => {
    return (
        <View style={styles.container}>  
            <View style={styles.imageContainer}>
                <Image src={recipe.imageUri} style={styles.image}></Image>
            </View>
            <Text>{recipe.nameOfDish}</Text>
            <Text>{recipe.difficultyLevel}</Text>
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
        padding: 20,
    },

    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
    },

    image: {
        height: 250,
        width: 250,
        borderRadius: 20,
    }
});