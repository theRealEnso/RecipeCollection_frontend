import { createContext, ReactNode, useState } from "react";

//import types
import {
    ListNameProps,
    RecipeContextTypes,
    RecipeForm,
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
    components: [],
    setRecipeForm: () => {},
    ingredientInput: "",
    setIngredientInput: () => {},
    ingredientsList: [],
    setIngredientsList: () => {},
    sublistNames: [],
    setSublistNames: () => {},
    subIngredients: [],
    setSubIngredients: () => {}
});

export const RecipeProvider = ({children}: RecipeProviderProps) => {
    const [ingredientInput, setIngredientInput] = useState<string>("");
    const [ingredientsList, setIngredientsList] = useState<string[]>([]);
    const [sublistNames, setSublistNames] = useState<ListNameProps[]>([]);
    const [subIngredients, setSubIngredients] = useState<SublistItem[]>([])
    const [recipeForm, setRecipeForm] = useState<RecipeForm>({
        recipeOwner: "",
        nameOfDish: "",
        difficultyLevel: "",
        timeToCook: "",
        numberOfServings: "",
        specialEquipment: "",
        components: [],
    });

    const {
        recipeOwner,
        nameOfDish,
        difficultyLevel,
        timeToCook,
        numberOfServings,
        specialEquipment,
        components
    } = recipeForm;

    const value = {
        recipeOwner,
        nameOfDish,
        difficultyLevel,
        timeToCook,
        numberOfServings,
        specialEquipment,
        components,
        setRecipeForm,
        ingredientInput,
        setIngredientInput,
        ingredientsList,
        setIngredientsList,
        sublistNames,
        setSublistNames,
        subIngredients,
        setSubIngredients
    };

    return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
};

