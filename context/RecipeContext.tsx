import { createContext, ReactNode, useState } from "react";

// define types

type RecipeProviderProps = {
    children: ReactNode;
};

type RecipeForm = {
    recipeOwner?: string;
    nameOfDish: string;
    difficultyLevel: string;
    timeToCook: string;
    numberOfServings: string;
    specialEquipment?: string;
    components?: string[]; 
};

type ListNameProps = {
    name: string;
    id: string;
};


type RecipeContextTypes = {
    recipeOwner?: string;
    nameOfDish: string;
    difficultyLevel: string;
    timeToCook: string;
    numberOfServings: string;
    specialEquipment?: string;
    components?: string[];
    setRecipeForm: React.Dispatch<React.SetStateAction<RecipeForm>>;
    ingredientInput: string;
    setIngredientInput: React.Dispatch<React.SetStateAction<string>>;
    ingredientsList: string[];
    setIngredientsList: React.Dispatch<React.SetStateAction<string[]>>;
    sublistNames: ListNameProps[];
    setSublistNames: React.Dispatch<React.SetStateAction<ListNameProps[]>>;
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
});

export const RecipeProvider = ({children}: RecipeProviderProps) => {
    const [ingredientInput, setIngredientInput] = useState<string>("");
    const [ingredientsList, setIngredientsList] = useState<string[]>([]);
    const [sublistNames, setSublistNames] = useState<ListNameProps[]>([]);
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
    };

    return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
};

