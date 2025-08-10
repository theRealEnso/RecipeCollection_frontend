import { StyleSheet } from "react-native";

// import component(s)
import RecipeCard from "./RecipeCard";

//import type definitions
import { RecipeData } from "@/types/Recipe";
type RecipesData = {
    recipesData: RecipeData[];
}

const RecipeCardList = ({recipesData}: RecipesData) => {
    recipesData.map((recipe) => (<RecipeCard key={recipe._id} recipe={recipe}></RecipeCard>))
};

export default RecipeCardList;

const styles = StyleSheet.create({

});