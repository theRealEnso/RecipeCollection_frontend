import axios from "axios";

const RECIPE_COLLECTION_ENDPOINT = process.env.EXPO_PUBLIC_RECIPE_COLLECTION_ENDPOINT_3;
const CATEGORIES_ENDPOINT = `${RECIPE_COLLECTION_ENDPOINT}/categories`;

type Category = {
    user: string;
    category: string;
};

export const getAllCategories = async (accessToken: string): Promise<Category[] | undefined> => {
    try {
        const {data} = await axios.get(`${CATEGORIES_ENDPOINT}/get-user-categories`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return data;
    } catch(error){
        console.error(`Error: ${error}`);
    }
};