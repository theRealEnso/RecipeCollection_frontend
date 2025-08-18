import { StyleSheet, Text, View } from "react-native";

//import types
import { RecipeDataProps } from "./RecipeCardList";

type Recipe = {
    recipe: RecipeDataProps
}

const RecipeCard = ({recipe}: Recipe) => {
    return (
        <View>
            <Text>{recipe.nameOfDish}</Text>
        </View>
    )
};

export default RecipeCard;

const styles = StyleSheet.create({

});