import axios from "axios";

import { UserData } from "../RegisterScreen";

// import env variable for server endpoint
 
const RECIPE_COLLECTION_ENDPOINT = process.env.EXPO_PUBLIC_RECIPE_COLLECTION_ENDPOINT_3;

const AUTH_ENDPOINT = `${RECIPE_COLLECTION_ENDPOINT}/auth`

export const registerUser = async (userData: UserData) => {
    try {
        const {data} = await axios.post(`${AUTH_ENDPOINT}/register`, userData);
        return data;
    } catch(error){
        if (axios.isAxiosError(error)) {
          console.error("ERROR RESPONSE:", error.response);
        } else {
          console.error("ERROR:", error);
        }
    };  
};

export const loginUser = async (userData: UserData) => {
  try {
    const {data} = await axios.post(`${AUTH_ENDPOINT}/login`, userData);
    return data;
  } catch(error){
    console.error(`ERROR: ${error}`)
  }
};