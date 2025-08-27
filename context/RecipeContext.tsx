import { createContext, ReactNode, useState } from "react";

//import types
import {
    ListNameProps,
    RecipeContextTypes,
    RecipeForm,
    RecipeSubDirections,
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
    cookingDirections: [],
    setCookingDirections: () => {},
    subDirections: [],
    setSubDirections: () => {},
    selectedImageUri: "",
    setSelectedImageUri: () => {},
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
    const [ingredientsList, setIngredientsList] = useState<string[]>([]);
    const [sublistNames, setSublistNames] = useState<ListNameProps[]>([]);
    const [subIngredients, setSubIngredients] = useState<SubIngredient[]>([]);
    const [cookingDirections, setCookingDirections] = useState<string[]>([]);
    const [subDirections, setSubDirections] = useState<RecipeSubDirections[]>([]);
    const [selectedImageUri, setSelectedImageUri] = useState<string>("");
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
        setCookingDirections([]);
        setIngredientsList([]);
        setSubDirections([]);
        setSubIngredients([]);
        setSublistNames([]);
        setSelectedImageUri("");
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
        selectedImageUri,
        setSelectedImageUri,
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
        cookingDirections,
        setCookingDirections,
        subDirections,
        setSubDirections,
        resetRecipeState,
    };

    return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
};

