import axios from "axios";

//import types
import { RecipeData } from "@/types/Recipe";

const RECIPE_COLLECTION_ENDPOINT = process.env.EXPO_PUBLIC_RECIPE_COLLECTION_ENDPOINT_3
const RECIPES_ENDPOINT = `${RECIPE_COLLECTION_ENDPOINT}/recipes`;

// define types
type CreateRecipeProps = {
    accessToken: string;
    recipeData: RecipeData;
};

// type GetRecipeProps = {
//     accessToken: string;
//     categoryId: string;
// };

export const getAllCategoryRecipes = async (accessToken: string, categoryId: string) => {
    try {
        const { data } = await axios.get(`${RECIPES_ENDPOINT}/get-category-recipes/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        return data;
    } catch(error){
        console.error(error);
    }
};


export const createNewRecipe = async ({accessToken, recipeData}: CreateRecipeProps) => {
    try {
        const { data } = await axios.post(`${RECIPES_ENDPOINT}/create-recipe`, recipeData, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    });

    return data;

    } catch(error){
        console.error(error)
    };
};