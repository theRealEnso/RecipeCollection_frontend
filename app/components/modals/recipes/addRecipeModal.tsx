import { useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

// import component(s)
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import CustomButton from "../../CustomButton";
import FormInput from "../../FormInput";
import IngredientList from "../../IngredientList";

import colors from "@/app/constants/colors";

type AddRecipeModalProps = {
    categoryId: string;
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

type RecipeProps = {
    recipeOwner?: string;
    nameOfDish: string;
    difficultyLevel: string;
    timeToCook: string;
    numberOfServings: string;
    specialEquipment?: string;
    // ingredientsList: string[];
    components: string[];
};

const AddRecipeModal = ({categoryId, setShowForm}: AddRecipeModalProps) => {
    let [recipeForm, setRecipeForm] = useState<RecipeProps>({
        recipeOwner: "",
        nameOfDish: "",
        difficultyLevel: "",
        timeToCook: "",
        numberOfServings: "",
        specialEquipment: "",
        // ingredientsList: [],
        components: [],
    });

    const [ingredientInput, setIngredientInput] = useState<string>("");
    const [ingredientsList, setIngredientsList] = useState<string[]>([]);

    let {
        recipeOwner,
        nameOfDish,
        difficultyLevel,
        timeToCook,
        numberOfServings,
        // ingredientsList,
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
            });
        });
    };

    const addIngredientToList = () => {
        const updatedIngredientList = [...ingredientsList, ingredientInput];
        setIngredientsList(updatedIngredientList);
        setIngredientInput("");
    };

    //function to capture user updates to items in the IngredientList component and update the ingredientsList array. Pass as props to IngredientList component
    const updateIngredients = (index: number, updatedIngredient: string) => {
        const updatedIngredientsList = ingredientsList.map((ingredient, i) => index === i ? updatedIngredient : ingredient);
        setIngredientsList(updatedIngredientsList);
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
                            width={380}
                            onChangeText={(typedValue) => handleInputChange("nameOfDish", typedValue)} 
                        >
                        </FormInput>
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
                            placeholder="e.g easy, medium, hard"
                            value={difficultyLevel} 
                            width={380}
                            onChangeText={(typedValue) => handleInputChange("difficultyLevel", typedValue)} 
                        >
                        </FormInput>
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
                    </View>

                    <View style={styles.inputContainer}>
                        <Text>{`(Optional) if any special equipment is required, then enter them separated by commas`}</Text>
                        <FormInput 
                            placeholder="e.g. pressure cooker, sous vide machine, paster maker, etc  "
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
                    </View>

                    {/* //// *****  ingredients section *****   //// */}

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
                
                {/* //// *****  end of ingredients section *****   //// */}


                {/* render list of ingredients */}
                {
                    ingredientsList && (
                        <IngredientList ingredients={ingredientsList} onEdit={updateIngredients}></IngredientList>
                    )
                }


                {/* cancel and add buttons */}
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