import axios from "axios";

//import types
import { RecipeData } from "@/types/Recipe";

const RECIPE_COLLECTION_ENDPOINT = process.env.EXPO_PUBLIC_RECIPE_COLLECTION_ENDPOINT_4;
const RECIPES_ENDPOINT = `${RECIPE_COLLECTION_ENDPOINT}/recipes`;

// define types
type CreateRecipeProps = {
    accessToken: string;
    recipeData: RecipeData;
};

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
    };
};

export const getDetailedRecipe = async (accessToken: string, recipeId: string) => {
    try {
        const { data } = await axios.get(`${RECIPES_ENDPOINT}/get-category-recipes/recipe/${recipeId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });
        return data;
    } catch(error){
        console.error(error);
    };
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

export const generateRecipeFromImage = async (accessToken: string, base64url: string) => {
    try {
        const { data } = await axios.post(`${RECIPES_ENDPOINT}/generate-recipe-from-image`, {base64Image: base64url}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data;
    } catch(error){
        console.error(error);
    };
};

export const generateCloudinarySignature = async (accessToken: string) => {
    try {
        const { data } = await axios.get(`${RECIPES_ENDPOINT}/get-cloudinary-signature`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data;
    } catch(error){
        console.error(error);
    };
};

export const createCloudinaryURL = async ({accessToken, base64Url}: {accessToken: string, base64Url: string}) => {
    try {
        const { data } = await axios.post(`${RECIPES_ENDPOINT}/create-cloudinary-image-url`, { base64: base64Url }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        return data;
    } catch(error){
        console.error(error);
    };
};