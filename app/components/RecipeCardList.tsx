import { StyleSheet, View } from "react-native";

// import component(s)
import RecipeCard from "./RecipeCard";

//import type definition(s)
import { RecipeData } from "@/types/Recipe";


export type RecipeDataProps = RecipeData & { // this type represents the shape of the data for each recipe
    _id: string;
    cuisineCategory: object,
    createdAt: string;
    updatedAt: string;
    __v: number
};

type RecipesData = {
    recipesData : RecipeDataProps[]; // represents an array of recipes obtained from the databse
};

const RecipeCardList = ({recipesData}: RecipesData) => {
    return (
        <View style={styles.container}>
            {
                recipesData.map((recipe) => (<RecipeCard key={recipe._id} recipe={recipe}></RecipeCard>))
            }
        </View>
    )
    
};

export default RecipeCardList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});