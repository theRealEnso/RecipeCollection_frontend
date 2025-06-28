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

type AddCategoryProps = {
    accessToken: string;
    categoryText: string;
};

export const getAllCategories = async (accessToken: string): Promise<Categories | undefined> => {
    try {
        const { data } = await axios.get(`${CATEGORIES_ENDPOINT}/get-user-categories`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        return data;

    } catch(error){
        console.error(`Error: ${error}`);
    };
};

export const addCuisineCategory = async ({accessToken, categoryText}: AddCategoryProps) => {
    try {
        const { data } = await axios.post(`${CATEGORIES_ENDPOINT}/add-category`, {name: categoryText}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },);

        return data;

    } catch(error){
        console.error(`Error adding a cuisine category: ${error}`)
    };
};

export const deleteCuisineCategory = async ({accessToken, categoryId}: DeleteCategoryProps) => {
    try {
        const { data } = await axios.delete(`${CATEGORIES_ENDPOINT}/delete-category/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        return data;

    } catch(error){
        console.error(`Error: ${error}`)
    };
};