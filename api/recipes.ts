import axios from "axios";

//import types
import { RecipeData } from "@/types/Recipe";

const RECIPE_COLLECTION_ENDPOINT = process.env.EXPO_PUBLIC_RECIPE_COLLECTION_ENDPOINT_4;
const RECIPES_ENDPOINT = `${RECIPE_COLLECTION_ENDPOINT}/recipes`;
const USER_ENDPOINT = `${RECIPE_COLLECTION_ENDPOINT}/auth`

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

type GetPublicRecipesPageParams = {
    accessToken: string;
    limit: number;
    cursor?: string | null;
    q?: string;
    signal?: AbortSignal;
};

type GetRecipeReviewsPageParams = {
    accessToken: string;
    recipeId: string;
    limit: number;
    cursor: string | null;
};

export const getAllPublicRecipesPaged = async (
    {
        accessToken, 
        limit, 
        cursor, 
        q, 
        signal
    }: GetPublicRecipesPageParams) => {
    try {
        const params = new URLSearchParams();
        params.set("limit", String(limit));
        if(cursor) params.set("cursor", cursor);
        if(q) params.set("q", q.trim());

        //params.toString() => "limit=20&cursor=<some_string>&q<query_string>"
        const { data } = await axios.get(`${RECIPES_ENDPOINT}/public-recipes/paged?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            signal
        });

        return data;
    } catch(error){
        console.error(error);
    };
};

export const getRecipeReviewsPaged = async ({
    accessToken,
    recipeId,
    limit,
    cursor
}: GetRecipeReviewsPageParams) => {
    try {
        const params = new URLSearchParams();
        params.set("limit", String(limit));
        if(cursor) params.set("cursor", cursor);

        const { data } = await axios.get(`${RECIPES_ENDPOINT}/${recipeId}/reviews/paged/?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data;
    } catch(error){
        console.error(error);
        throw error;
    }
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

// ******   axios helper functions for AI workloads *****

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

// ********** axios helper functions for favoriting, unfavoriting, and fetching favorited recipes  **********

export const addFavoriteRecipe = async (accessToken: string, recipeId: string) => {
    try {
        const { data } = await axios.post(`${USER_ENDPOINT}/me/favorites/${recipeId}`, null, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data;
    } catch(error){
        console.error(error);
    }
};

export const removeFavoriteRecipe = async (accessToken: string, recipeId: string) => {
    try {
         const { data } = await axios.delete(`${USER_ENDPOINT}/me/favorites/${recipeId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
         });
         
         return data;
    } catch(error){
        console.error(error);
    };
};

export const getFavoritedRecipes = async (accessToken: string) => {
    try {
        const { data } = await axios.get(`${USER_ENDPOINT}/me/favorites`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        return data;
    } catch(error){
        console.error(error);
    };
};

// ********** axios helpers for adding, editing, and removing reviews ********** 

export const addRecipeReview = async (accessToken: string, rating: number, comment: string, recipeId: string) => {
    try {
        const { data } = await axios.post(`${RECIPES_ENDPOINT}/${recipeId}/reviews`, {rating, comment}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data;
    } catch(error){
        console.error(error);
    };
};

export const deleteRecipeReview = async (accessToken: string, recipeId: string) => {
    try {
        const { data } = await axios.delete(`${RECIPES_ENDPOINT}/${recipeId}/reviews`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return data;
    } catch(error){
        console.error(error);
    };
};

// ********** legacy axios helper functions **********
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


