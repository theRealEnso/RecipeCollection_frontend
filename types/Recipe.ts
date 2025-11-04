import React from "react";

export type RecipeForm = {
    recipeOwner?: string;
    nameOfDish: string;
    difficultyLevel: string;
    timeToCook: string;
    numberOfServings: string;
    specialEquipment?: string;
};

export type RecipeContextTypes = {
    tileId: string;
    setTileId: React.Dispatch<React.SetStateAction<string>>
    categoryName: string;
    setCategoryName: React.Dispatch<React.SetStateAction<string>>;
    categoryId: string;
    setCategoryId: React.Dispatch<React.SetStateAction<string>>;
    isPublic: boolean;
    setIsPublic: React.Dispatch<React.SetStateAction<boolean>>;
    isClaimed: boolean;
    setIsClaimed: React.Dispatch<React.SetStateAction<boolean>>;
    recipeOwner?: string;
    nameOfDish: string;
    difficultyLevel: string;
    timeToCook: string;
    numberOfServings: string;
    specialEquipment?: string;
    setRecipeForm: React.Dispatch<React.SetStateAction<RecipeForm>>;
    selectedImageUrl: string;
    setSelectedImageUrl: React.Dispatch<React.SetStateAction<string>>;
    selectedImageType: string;
    setSelectedImageType: React.Dispatch<React.SetStateAction<string>>;
    selectedImageName: string;
    setSelectedImageName: React.Dispatch<React.SetStateAction<string>>;
    selectedImageSize: number,
    setSelectedImageSize: React.Dispatch<React.SetStateAction<number>>,
    base64Url: string;
    setBase64Url: React.Dispatch<React.SetStateAction<string>>;
    ingredientInput: string;
    setIngredientInput: React.Dispatch<React.SetStateAction<string>>;
    ingredientsList: Ingredient[];
    setIngredientsList: React.Dispatch<React.SetStateAction<Ingredient[]>>;
    sublistNames: ListName[];
    setSublistNames: React.Dispatch<React.SetStateAction<ListName[]>>;
    subIngredients: SubIngredient[];
    setSubIngredients: React.Dispatch<React.SetStateAction<SubIngredient[]>>;
    cookingInstructions: CookingInstructions[],
    setCookingInstructions: React.Dispatch<React.SetStateAction<CookingInstructions[]>>;
    subInstructions: RecipeSubInstructions[],
    setSubInstructions: React.Dispatch<React.SetStateAction<RecipeSubInstructions[]>>;
    resetRecipeState: () => void;
    setGeneratedRecipe: (recipe: RecipeData) => void;
};

export type ListName = {
    name: string;
    id: string;
};

export type Ingredient = {
    nameOfIngredient: string;
    ingredient_id: string;
};

export type SubIngredient = {
    sublistName: string;
    sublistId: string;
    nameOfIngredient: string;
    ingredient_id: string;
};

export type CookingInstructions = {
    instruction: string;
    instruction_id: string;
};

export type RecipeSubInstructions = {
    sublistName: string;
    sublistId: string;
    instruction: string;
    instruction_id: string;
};

export type RecipeData = RecipeForm & {
    _id: string;
    categoryName: string;
    cuisineCategory: string;
    ingredients: Ingredient[],
    cookingInstructions: CookingInstructions[],
    sublists: ListName[];
    subIngredients: SubIngredient[];
    subInstructions: RecipeSubInstructions[];
    imageUrl: string;
    isPublic: boolean;
    ownerUserId: string;
    isClaimed: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number
};