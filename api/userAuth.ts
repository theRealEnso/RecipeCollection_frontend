import axios from "axios";


//import types
import { UserInfoFromServer } from "@/types/User";
import { UserData } from "../app/RegisterScreen";


const RECIPE_COLLECTION_ENDPOINT = process.env.EXPO_PUBLIC_RECIPE_COLLECTION_ENDPOINT_3;

export const AUTH_ENDPOINT = `${RECIPE_COLLECTION_ENDPOINT}/auth`;

export const registerNewUser = async (userData: UserData): Promise<UserInfoFromServer | undefined> => {
    try {
        const {data} = await axios.post(`${AUTH_ENDPOINT}/register`, userData);
        return data;
    } catch(error: any){
        if (axios.isAxiosError(error)) {
            console.error("ERROR RESPONSE:", error.response?.data);
            console.error("ERROR STATUS:", error.response?.status);
            console.error("ERROR REQUEST:", error.request);
        } else {
            console.error("ERROR:", error);
        }
        throw error;
    }   
};

export const loginUser = async (userData: UserData): Promise<UserInfoFromServer | undefined> => {
  try {
    const {data} = await axios.post(`${AUTH_ENDPOINT}/login`, userData);
    return data;
  } catch(error){
    // console.log(typeof error);
    // console.log(typeof error.message)
    // console.error("Error:", error.message);
    console.error("Error:", error);
    throw new Error(`${error}`)
  }
};
