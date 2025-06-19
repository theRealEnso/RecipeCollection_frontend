import axios from "axios";

const RECIPE_COLLECTION_ENDPOINT = process.env.EXPO_PUBLIC_RECIPE_COLLECTION_ENDPOINT_3;
const CATEGORIES_ENDPOINT = `${RECIPE_COLLECTION_ENDPOINT}/categories`;

export type Cuisine = {
    _id: string;
    user: string;
    cuisineName: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

type Categories = {
    categories: Cuisine[]
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
    }
};