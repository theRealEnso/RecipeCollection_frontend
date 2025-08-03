export type RecipeForm = {
    recipeOwner?: string;
    nameOfDish: string;
    difficultyLevel: string;
    timeToCook: string;
    numberOfServings: string;
    specialEquipment?: string;
    components?: string[]; 
};

export type ListNameProps = {
    name: string;
    id: string;
};

export type SublistItem = {
    listId: string;
    nameOfIngredient: string;
    ingredient_id: string;
};


export type RecipeContextTypes = {
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
    subIngredients: SublistItem[];
    setSubIngredients: React.Dispatch<React.SetStateAction<SublistItem[]>>;
    cookingDirections: string[],
    setCookingDirections: React.Dispatch<React.SetStateAction<string[]>>;
    subDirections: RecipeSubDirections[],
    setSubDirections: React.Dispatch<React.SetStateAction<RecipeSubDirections[]>>
};

export type RecipeSubDirections = {
    sublistName: string;
    sublistId: string;
    direction: string;
    direction_id: string;
};