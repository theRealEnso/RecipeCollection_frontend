export type RecipeForm = {
    recipeOwner?: string;
    nameOfDish: string;
    difficultyLevel: string;
    timeToCook: string;
    numberOfServings: string;
    specialEquipment?: string;
};

export type ListNameProps = {
    name: string;
    id: string;
};

export type RecipeContextTypes = {
    categoryName: string;
    setCategoryName: React.Dispatch<React.SetStateAction<string>>;
    categoryId: string;
    setCategoryId: React.Dispatch<React.SetStateAction<string>>;
    recipeOwner?: string;
    nameOfDish: string;
    difficultyLevel: string;
    timeToCook: string;
    numberOfServings: string;
    specialEquipment?: string;
    setRecipeForm: React.Dispatch<React.SetStateAction<RecipeForm>>;
    selectedImageUri: string;
    setSelectedImageUri: React.Dispatch<React.SetStateAction<string>>;
    selectedImageType: string;
    setSelectedImageType: React.Dispatch<React.SetStateAction<string>>;
    selectedImageName: string;
    setSelectedImageName: React.Dispatch<React.SetStateAction<string>>;
    base64Url: string;
    setBase64Url: React.Dispatch<React.SetStateAction<string>>;
    ingredientInput: string;
    setIngredientInput: React.Dispatch<React.SetStateAction<string>>;
    ingredientsList: string[];
    setIngredientsList: React.Dispatch<React.SetStateAction<string[]>>;
    sublistNames: ListNameProps[];
    setSublistNames: React.Dispatch<React.SetStateAction<ListNameProps[]>>;
    subIngredients: SubIngredient[];
    setSubIngredients: React.Dispatch<React.SetStateAction<SubIngredient[]>>;
    cookingDirections: string[],
    setCookingDirections: React.Dispatch<React.SetStateAction<string[]>>;
    subDirections: RecipeSubDirections[],
    setSubDirections: React.Dispatch<React.SetStateAction<RecipeSubDirections[]>>;
    resetRecipeState: () => void;

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

export type CookingDirections = {
    direction: string;
    direction_id: string;
};

export type RecipeSubDirections = {
    sublistName: string;
    sublistId: string;
    direction: string;
    direction_id: string;
};

export type RecipeData = RecipeForm & {
    categoryName: string;
    categoryId: string;
    cookingDirections: string[],
    subDirections: RecipeSubDirections[],
    ingredients: string[],
    subIngredients: SubIngredient[],
    imageUri: string;
};