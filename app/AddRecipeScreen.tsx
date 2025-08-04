import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

//import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

// import component(s)
import CustomButton from "./components/CustomButton";
import FormInput from "./components/FormInput";

// import colors from "@/app/constants/colors";

//define types

type FormErrors = {
    dishName: string | null;
    level: string | null;
    cookingTime: string | null;
    servingSize: string | null;
}

const AddRecipeScreen = () => {
    const router = useRouter();
    
    const {
        recipeOwner,
        nameOfDish,
        difficultyLevel,
        timeToCook,
        numberOfServings,
        specialEquipment,
        setRecipeForm,
    } = useContext(RecipeContext);

    const [formErrors, setFormErrors] = useState<FormErrors>({
        dishName: null,
        level: null,
        cookingTime: null,
        servingSize: null,
    });

    const handleInputChange = (fieldName: string, value: string) => {
        setRecipeForm((previousState) => {
            return ({
                ...previousState,
                [fieldName]: value,
            });
        });
    };

    // function that validates required fields and then navigates to the next screen to continue adding the recipe ingredients
    const continueToAddIngredients = () => {
        const validationErrors: FormErrors = {
            dishName: null,
            level: null,
            cookingTime: null,
            servingSize: null,
        };

        if(!nameOfDish.trim()){
            validationErrors.dishName = "Missing required field!"
        };

        if(!difficultyLevel.trim()){
            validationErrors.level = "Missing required field!";
        };

        if(!timeToCook.trim()){
            validationErrors.cookingTime = "Missing required field!";
        };

        if(!numberOfServings.trim()){
            validationErrors.servingSize = "Missing required field!";
        }

        setFormErrors(validationErrors);

        const formHasErrors = Object.values(validationErrors).some(field => field !== null);

        if(!formHasErrors){
            router.push("/AddIngredientsScreen");
            //add small delay so that React can update recipe context values from calling setRecipeForm before navigating
            // setTimeout(() => {
            //     router.push("/AddIngredientsScreen");
            // }, 1000);
        };
    };

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.inputContainer}>
                    <Text>Enter the name / title of your dish!</Text>
                    <FormInput 
                        placeholder="recipe title"  
                        value={nameOfDish} 
                        width={380}
                        onChangeText={(typedValue) => handleInputChange("nameOfDish", typedValue)} 
                    >
                    </FormInput>
                    {
                        formErrors.dishName && <Text style={styles.warning}>{formErrors.dishName}</Text>
                    }
                </View>

                <View style={styles.inputContainer}>
                    <Text>{`Enter name of recipe owner/creator (optional)`}</Text>
                    <FormInput 
                        placeholder="name of recipe owner (optional)"  
                        value={recipeOwner} 
                        width={380}
                        onChangeText={(typedValue) => handleInputChange("recipeOwner", typedValue)} 
                    >
                    </FormInput>
                </View>

                <View style={styles.inputContainer}>
                    <Text>Enter the dish&apos;s difficulty level</Text>
                    <FormInput 
                        placeholder="e.g easy, medium, or hard"
                        value={difficultyLevel} 
                        width={380}
                        onChangeText={(typedValue) => handleInputChange("difficultyLevel", typedValue)} 
                    >
                    </FormInput>
                    {
                        formErrors.level && <Text style={styles.warning}>{formErrors.level}</Text>
                    }
                </View>

                <View style={styles.inputContainer}>
                    <Text>Enter estimated time to cook</Text>
                    <FormInput 
                        placeholder="e.g 30 minutes"
                        value={timeToCook} 
                        width={380}
                        onChangeText={(typedValue) => handleInputChange("timeToCook", typedValue)}
                    >
                    </FormInput>

                    {
                        formErrors.cookingTime && <Text style={styles.warning}>{formErrors.cookingTime}</Text>
                    }
                </View>

                <View style={styles.inputContainer}>
                    <Text>{`(Optional) if any special equipment is required, then enter them separated by commas`}</Text>
                    <FormInput 
                        placeholder="e.g. pressure cooker, sous vide machine, pasta maker, etc  "
                        value={specialEquipment} 
                        width={380}
                        onChangeText={(typedValue) => handleInputChange("specialEquipment", typedValue)}
                    >
                    </FormInput>
                </View>

                <View style={styles.inputContainer}>
                    <Text>Enter estimated amount of servings this recipe yields</Text>
                    <FormInput 
                        placeholder="e.g 3-4 servings"
                        value={numberOfServings} 
                        width={380}
                        onChangeText={(typedValue) => handleInputChange("numberOfServings", typedValue)} 
                    >
                    </FormInput>

                    {
                        formErrors.servingSize && <Text style={styles.warning}>{formErrors.servingSize}</Text>
                    }
                </View>
            </View>

            {/* button to go to next screen to continue the form */}
            <View style={styles.buttonsContainer}>
                <View style={styles.buttonContainer}>
                    <CustomButton value="Cancel" width={100} radius={20} onButtonPress={() => router.replace("/RecipesOverview")}></CustomButton>
                </View>
                <View style={styles.buttonContainer}>
                    <CustomButton value="Next" width={100} radius={20} onButtonPress={continueToAddIngredients}></CustomButton>
                </View>
            </View>
        </View>
    );
};

export default AddRecipeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 60,
        paddingHorizontal: 20,
        marginTop: 50,
    },

    inputContainer: {
        marginVertical: 10,
        // alignItems: "center",
        // justifyContent: "center",
    },

    buttonsContainer: {
        flex: 6,
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        marginTop: 50,
    },

    buttonContainer: {
        marginHorizontal: 5,
        borderRadius: 20,
        width: 100,
    },

    warning: {
        color: "red",
    }
});