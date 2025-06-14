import axios from "axios";

const RECIPE_COLLECTION_ENDPOINT = process.env.EXPO_PUBLIC_RECIPE_COLLECTION_ENDPOINT_3;
const CATEGORIES_ENDPOINT = `${RECIPE_COLLECTION_ENDPOINT}/categories`;

export const getAllCategories = async () => {
    try {
        const {data} = await axios.get(`${CATEGORIES_ENDPOINT}/get-all-categories`);
        return data;
    } catch(error){
        console.error(`Error: ${error}`);
    }
};