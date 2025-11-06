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

export const getAllPublicRecipes = async (accessToken: string) => {
    try {
        const { data } = await axios.get(`${RECIPES_ENDPOINT}/get-public-recipes`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        return data;
    } catch(error){
        console.error(`Error: ${error}`);
        throw error;
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

export const getUserSearchedRecipes = async (accessToken: string, searchQuery: string, signal?: AbortSignal) => {
    try {
        const { data } = await axios.get(`${RECIPES_ENDPOINT}/search-user-recipes/search?q=${searchQuery}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            signal,
        });

        return data;
    } catch(error){
        console.error(error);
        throw new Error(error as any);
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

export const startRecipeGenerationJob = async (accessToken: string, base64Url: string) => {
    try {
        const { data } = await axios.post(`${RECIPES_ENDPOINT}/start-recipe-generation`, {base64Image: base64Url}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data; // data should be the jobId that we get back at this specific endpoint
    } catch(error){
        console.error(error);
    }
};

export const getRecipeGenerationJobStatus = async (accessToken: string, jobId: string) => {
    try {
        const { data } = await axios.get(`${RECIPES_ENDPOINT}/get-updated-recipe-generation-status/${jobId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        return data; // data should be object representation of the Job map object (job status)
    } catch(error){
        console.error(error);
    };
};

export const getGeneratedRecipeResult = async (accessToken: string, jobId: string) => {
    try {
        const { data } = await axios.get(`${RECIPES_ENDPOINT}/get-generated-recipe/${jobId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data; // data should contain the fully generated recipe
    } catch(error){
        console.error(error);
    };
};

// legacy function
export const generateRecipeFromImage = async (accessToken: string, base64Url: string, selectedImageSize: number, updateProgress: (percent: number) => void) => {
    try {
        const { data } = await axios.post(`${RECIPES_ENDPOINT}/generate-recipe-from-image`, {base64Image: base64Url}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },

            onUploadProgress: (progressEvent) => {
                let percentCompleted = 0;

                if(progressEvent.total){
                    percentCompleted = Math.min(Math.floor((progressEvent.loaded / progressEvent.total) * 100), 100);
                } else {
                    percentCompleted = Math.min(Math.floor((progressEvent.loaded / selectedImageSize) * 100), 100)
                }

                updateProgress(percentCompleted);
            }
        });

        return data;
    } catch(error){
        console.error(error);
    };
};
