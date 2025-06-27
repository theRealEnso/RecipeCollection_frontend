import axios, { isAxiosError } from "axios";

//import types
import { User } from "@/types/User";
import { UserData } from "../app/RegisterScreen";

type UserInfoFromServer = {
  message: string;
  user: User;
}
 
const RECIPE_COLLECTION_ENDPOINT = process.env.EXPO_PUBLIC_RECIPE_COLLECTION_ENDPOINT_3;

const AUTH_ENDPOINT = `${RECIPE_COLLECTION_ENDPOINT}/auth`

export const registerUser = async (userData: UserData): Promise<UserInfoFromServer | undefined> => {
    try {
        const {data} = await axios.post(`${AUTH_ENDPOINT}/register`, userData);
        return data;
    } catch(error){
        if (isAxiosError(error)) {
          console.error("ERROR RESPONSE:", error.response);
        } else {
          console.error("ERROR:", error);
        }
    };  
};

export const loginUser = async (userData: UserData): Promise<UserInfoFromServer | undefined> => {
  try {
    const {data} = await axios.post(`${AUTH_ENDPOINT}/login`, userData);
    return data;
  } catch(error){
    console.error(`ERROR: ${error}`)
  }
};