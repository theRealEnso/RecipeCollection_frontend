import { createContext, ReactNode, useState } from "react";

//import types
import {
    CookingInstructions,
    Ingredient,
    ListName,
    RecipeContextTypes,
    RecipeData,
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
    tileId: "",
    setTileId: () => {},
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
    selectedImageSize: 0,
    setSelectedImageSize: () => {},
    base64Url: "",
    setBase64Url: () => {},
    resetRecipeState: () => {},
    setGeneratedRecipe: () => {},
    isPublic: false,
    setIsPublic: () => {},
    isClaimed: false,
    setIsClaimed: () => {}
});

export const RecipeProvider = ({children}: RecipeProviderProps) => {
    const [tileId, setTileId] = useState<string>("");
    const [categoryName, setCategoryName] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [isClaimed, setIsClaimed] = useState<boolean>(false);
    const [ingredientInput, setIngredientInput] = useState<string>("");
    const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
    const [sublistNames, setSublistNames] = useState<ListName[]>([]);
    const [subIngredients, setSubIngredients] = useState<SubIngredient[]>([]);
    const [cookingInstructions, setCookingInstructions] = useState<CookingInstructions[]>([]);
    const [subInstructions, setSubInstructions] = useState<RecipeSubInstructions[]>([]);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
    const [selectedImageType, setSelectedImageType] = useState<string>("");
    const [selectedImageName, setSelectedImageName] = useState<string>("");
    const [selectedImageSize, setSelectedImageSize] = useState<number>(0);
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

    //to reset state
    const resetRecipeState = () => {
        setIsClaimed(false);
        setIsPublic(false);
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

    // function to store AI generated recipes inside of this context
    const setGeneratedRecipe = async (recipe: RecipeData) => {
        try {
            const {
                nameOfDish,
                difficultyLevel,
                numberOfServings,
                specialEquipment,
                timeToCook,
                ingredients,
                cookingInstructions,
                sublists,
                subIngredients,
                subInstructions,
            } = recipe;

            if(cookingInstructions.length > 0 || ingredients.length > 0){
                await setRecipeForm({
                    recipeOwner: "",
                    nameOfDish,
                    difficultyLevel,
                    timeToCook,
                    numberOfServings,
                    specialEquipment,
                });
                await setIngredientsList(ingredients);
                await setCookingInstructions(cookingInstructions);
            } else {
                await setRecipeForm({
                    recipeOwner: "",
                    nameOfDish,
                    difficultyLevel,
                    timeToCook,
                    numberOfServings,
                    specialEquipment,
                });
                await setSublistNames(sublists);
                await setSubIngredients(subIngredients);
                await setSubInstructions(subInstructions);
            }
        } catch(error){
            console.error(error);
        }
    };

    const value = {
        tileId,
        setTileId,
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
        setGeneratedRecipe,
        selectedImageSize,
        setSelectedImageSize,
        isPublic,
        setIsPublic,
        isClaimed,
        setIsClaimed,
    };

    return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
};

