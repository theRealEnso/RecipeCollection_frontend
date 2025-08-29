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
    selectedImageUrl: string;
    setSelectedImageUrl: React.Dispatch<React.SetStateAction<string>>;
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
    cookingInstructions: string[],
    setCookingInstructions: React.Dispatch<React.SetStateAction<string[]>>;
    subInstructions: RecipeSubInstructions[],
    setSubInstructions: React.Dispatch<React.SetStateAction<RecipeSubInstructions[]>>;
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
    categoryName: string;
    categoryId: string;
    cookingInstructions: string[],
    subInstructions: RecipeSubInstructions[],
    ingredients: string[],
    subIngredients: SubIngredient[],
    imageUrl: string;
};