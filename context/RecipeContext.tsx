import { createContext, ReactNode, useState } from "react";

//import types
import {
    CookingInstructions,
    Ingredient,
    ListName,
    RecipeContextTypes,
    RecipeForm,
    RecipeSubInstructions,
    SubIngredient,
} from "@/types/Recipe";

// define additional type(s)
type RecipeProviderProps = {
    children: ReactNode;
};


////////////////////////////////////////////////////////////////

export const RecipeContext = createContext<RecipeContextTypes>({
    categoryName: "",
    setCategoryName: () => {},
    categoryId: "",
    setCategoryId: () => {},
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
    cookingInstructions: [],
    setCookingInstructions: () => {},
    subInstructions: [],
    setSubInstructions: () => {},
    selectedImageUrl: "",
    setSelectedImageUrl: () => {},
    selectedImageType: "",
    setSelectedImageType: () => {},
    selectedImageName: "",
    setSelectedImageName: () => {},
    base64Url: "",
    setBase64Url: () => {},
    resetRecipeState: () => {},
});

export const RecipeProvider = ({children}: RecipeProviderProps) => {
    const [categoryName, setCategoryName] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [ingredientInput, setIngredientInput] = useState<string>("");
    const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
    const [sublistNames, setSublistNames] = useState<ListName[]>([]);
    const [subIngredients, setSubIngredients] = useState<SubIngredient[]>([]);
    const [cookingInstructions, setCookingInstructions] = useState<CookingInstructions[]>([]);
    const [subInstructions, setSubInstructions] = useState<RecipeSubInstructions[]>([]);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
    const [selectedImageType, setSelectedImageType] = useState<string>("");
    const [selectedImageName, setSelectedImageName] = useState<string>("");
    const [base64Url, setBase64Url] = useState<string>("");
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

    const resetRecipeState = () => {
        setCookingInstructions([]);
        setIngredientsList([]);
        setSubInstructions([]);
        setSubIngredients([]);
        setSublistNames([]);
        setSelectedImageUrl("");
        setSelectedImageType("");
        setBase64Url("");
        setRecipeForm({
            recipeOwner: "",
            nameOfDish: "",
            difficultyLevel: "",
            timeToCook: "",
            numberOfServings: "",
            specialEquipment: "",
        });
    };


    const value = {
        categoryName,
        setCategoryName,
        categoryId,
        setCategoryId,
        recipeOwner,
        nameOfDish,
        difficultyLevel,
        timeToCook,
        numberOfServings,
        specialEquipment,
        setRecipeForm,
        selectedImageUrl,
        setSelectedImageUrl,
        selectedImageType,
        setSelectedImageType,
        selectedImageName,
        setSelectedImageName,
        base64Url,
        setBase64Url,
        ingredientInput,
        setIngredientInput,
        ingredientsList,
        setIngredientsList,
        sublistNames,
        setSublistNames,
        subIngredients,
        setSubIngredients,
        cookingInstructions,
        setCookingInstructions,
        subInstructions,
        setSubInstructions,
        resetRecipeState,
    };

    return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
};

