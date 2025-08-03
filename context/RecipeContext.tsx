import { createContext, ReactNode, useState } from "react";

//import types
import {
    ListNameProps,
    RecipeContextTypes,
    RecipeForm,
    RecipeSubDirections,
    SublistItem,
} from "@/types/RecipeTypes";

// define additional type(s)
type RecipeProviderProps = {
    children: ReactNode;
};


////////////////////////////////////////////////////////////////

export const RecipeContext = createContext<RecipeContextTypes>({
    recipeOwner: "",
    nameOfDish: "",
    difficultyLevel: "",
    timeToCook: "",
    numberOfServings: "",
    specialEquipment: "",
    setRecipeForm: () => {},
    ingredientInput: "",
    setIngredientInput: () => {},
    ingredientsList: [],
    setIngredientsList: () => {},
    sublistNames: [],
    setSublistNames: () => {},
    subIngredients: [],
    setSubIngredients: () => {},
    cookingDirections: [],
    setCookingDirections: () => {},
    subDirections: [],
    setSubDirections: () => {},
});

export const RecipeProvider = ({children}: RecipeProviderProps) => {
    const [ingredientInput, setIngredientInput] = useState<string>("");
    const [ingredientsList, setIngredientsList] = useState<string[]>([]);
    const [sublistNames, setSublistNames] = useState<ListNameProps[]>([]);
    const [subIngredients, setSubIngredients] = useState<SublistItem[]>([]);
    const [cookingDirections, setCookingDirections] = useState<string[]>([]);
    const [subDirections, setSubDirections] = useState<RecipeSubDirections[]>([])
    const [recipeForm, setRecipeForm] = useState<RecipeForm>({
        recipeOwner: "",
        nameOfDish: "",
        difficultyLevel: "",
        timeToCook: "",
        numberOfServings: "",
        specialEquipment: "",
    });

    const {
        recipeOwner,
        nameOfDish,
        difficultyLevel,
        timeToCook,
        numberOfServings,
        specialEquipment,
    } = recipeForm;


    const value = {
        recipeOwner,
        nameOfDish,
        difficultyLevel,
        timeToCook,
        numberOfServings,
        specialEquipment,
        setRecipeForm,
        ingredientInput,
        setIngredientInput,
        ingredientsList,
        setIngredientsList,
        sublistNames,
        setSublistNames,
        subIngredients,
        setSubIngredients,
        cookingDirections,
        setCookingDirections,
        subDirections,
        setSubDirections,
    };

    return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
};

