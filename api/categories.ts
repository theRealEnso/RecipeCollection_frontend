import axios from "axios";

//import types
import { Cuisine } from "@/types/Category";

const RECIPE_COLLECTION_ENDPOINT = process.env.EXPO_PUBLIC_RECIPE_COLLECTION_ENDPOINT_3;
const CATEGORIES_ENDPOINT = `${RECIPE_COLLECTION_ENDPOINT}/categories`;

type Categories = {
    categories: Cuisine[]
};

type DeleteCategoryProps = {
  accessToken: string;
  categoryId: string;
};

export const getAllCategories = async (accessToken: string): Promise<Categories | undefined> => {
    try {
        const {data} = await axios.get(`${CATEGORIES_ENDPOINT}/get-user-categories`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        return data;
    } catch(error){
        console.error(`Error: ${error}`);
    };
};

export const deleteCuisineCategory = async ({accessToken, categoryId}: DeleteCategoryProps) => {
    try {
        const {data} = await axios.delete(`${CATEGORIES_ENDPOINT}/delete-category/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        return data;
    } catch(error){
        console.error(`Error: ${error}`)
    };
};