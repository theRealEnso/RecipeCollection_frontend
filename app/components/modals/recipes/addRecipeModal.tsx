import { useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

// import component(s)
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import CustomButton from "../../CustomButton";
import FormInput from "../../FormInput";

import colors from "@/app/constants/colors";

type RecipeProps = {
    nameOfDish: string;
    difficultyLevel: string;
    timeToCook: string;
    numberOfServings: string;
    specialEquipment?: string;
    ingredientsList: string[];
    components: string[];
}

const AddRecipeModal = ({categoryId, setShowForm}) => {
    let [recipeForm, setRecipeForm] = useState<RecipeProps>({
        nameOfDish: "",
        difficultyLevel: "",
        timeToCook: "",
        numberOfServings: "",
        specialEquipment: "",
        ingredientsList: [],
        components: [],
    });

    const [ingredientInput, setIngredientInput] = useState<string>("");

    let {
        nameOfDish,
        difficultyLevel,
        timeToCook,
        numberOfServings,
        ingredientsList,
        specialEquipment,
        components
    } = recipeForm;

    const closeForm = () => {
        setShowForm(false);
    };

    const handleInputChange = (fieldName: string, value: string) => {
        setRecipeForm((previousState) => {
            return ({
                ...previousState,
                [fieldName]: value,
            })
        })
    };

    const addIngredientToList = () => {
        ingredientsList = [...ingredientsList, ingredientInput];
        setIngredientInput("");
    };

    return (
        <Modal
            animationType="fade"
            transparent={false}
            visible={true}
        >
            <View style={styles.container}>
                <View>
                    <View style={styles.inputContainer}>
                        <Text>Enter the name / title of your dish!</Text>
                        <FormInput 
                            placeholder="recipe title"  
                            value={nameOfDish} 
                            width={350}
                            onChangeText={(typedValue) => handleInputChange("nameOfDish", typedValue)} 
                        >
                        </FormInput>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text>Enter the dish&apos;s difficulty level</Text>
                        <FormInput 
                            placeholder="e.g easy, medium, hard"
                            value={difficultyLevel} 
                            width={350}
                            onChangeText={(typedValue) => handleInputChange("difficultyLevel", typedValue)} 
                        >
                        </FormInput>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text>Enter estimated time to cook</Text>
                        <FormInput 
                            placeholder="e.g 30 minutes"
                            value={timeToCook} 
                            width={350}
                            onChangeText={(typedValue) => handleInputChange("timeToCook", typedValue)}
                        >
                        </FormInput>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text>Enter estimated amount of servings this recipe yields</Text>
                        <FormInput 
                            placeholder="e.g 3-4 servings"
                            value={numberOfServings} 
                            width={350}
                            onChangeText={(typedValue) => handleInputChange("numberOfServings", typedValue)} 
                        >
                        </FormInput>
                    </View>

                    <View style={[styles.inputContainer, {marginVertical: 20}]}>
                        <Text style={styles.ingredientsLabel}>List of Ingredients</Text>
                        <View style={styles.ingredientInputOuterContainer}>
                            <View style={styles.ingredientInputInnerContainer}>
                                <FormInput 
                                    placeholder="Add ingredient..."
                                    value={ingredientInput} 
                                    width={300}
                                    onChangeText={(typedValue) => setIngredientInput(typedValue)}
                                >
                                </FormInput>
                            </View>
                            <View style={styles.ingredientInputInnerContainer}>
                                <CustomButton 
                                    value={<FontAwesome6 name="add" size={30} color="white"></FontAwesome6>} 
                                    width={50}
                                    onButtonPress={addIngredientToList}
                                >
                                </CustomButton>
                            </View>
                        </View>
                    </View>

                </View>

                <View style={styles.buttonsContainer}>
                    <View style={styles.buttonContainer}>
                        <CustomButton value="Cancel" width={100} onButtonPress={closeForm}></CustomButton>
                    </View>
                    <View style={styles.buttonContainer}>
                        <CustomButton value="Create" width={100} onButtonPress={closeForm}></CustomButton>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddRecipeModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
    },

    inputContainer: {
        marginVertical: 5,
        // alignItems: "center",
        // justifyContent: "center",
    },

    ingredientInputOuterContainer: {
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "center",
    },

    ingredientInputInnerContainer: {
        marginHorizontal: 5,
    },

    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
    },

    buttonContainer: {
        marginHorizontal: 5,
    },

    ingredientsLabel: {
        color: colors.primaryAccent500,
        fontWeight: 500,
        fontSize: 30,
        marginBottom: 10,
        textDecorationStyle: "dashed",
        textDecorationLine: "underline"
    }
});