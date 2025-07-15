import { useState } from "react";

import { StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";

// import components(s)
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import CustomButton from "./components/CustomButton";
import FormInput from "./components/FormInput";
import IngredientList from "./components/IngredientList";

import colors from "./constants/colors";

const AddRecipeScreen = () => {
    const router = useRouter();
    const [ingredientInput, setIngredientInput] = useState<string>("");
    const [ingredientsList, setIngredientsList] = useState<string[]>([]);

    const addIngredientToList = () => {
        const updatedIngredientList = [...ingredientsList, ingredientInput];
        setIngredientsList(updatedIngredientList);
        setIngredientInput("");
    };

    //function to capture user updates to a list item in the IngredientList component and update the ingredientsList array. Pass as props to IngredientList component
    const updateIngredients = (index: number, updatedIngredient: string) => {
        const updatedIngredientsList = ingredientsList.map((ingredient, i) => index === i ? updatedIngredient : ingredient);
        setIngredientsList(updatedIngredientsList);
    };

    //function to remove an ingredient from the list. Pass as props to IngredientList component
    const removeIngredient = (index: number) => {
        const updatedIngredientsList = ingredientsList.filter((_, i) => i !== index);
        setIngredientsList(updatedIngredientsList);
    };

    //function to back to previous screen
    const goBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.ingredientsLabel}>List of Ingredients</Text>
            <Text>Enter quantity and name of ingredient item</Text>

            <View style={styles.ingredientInputOuterContainer}>
                <View style={styles.ingredientInputInnerContainer}>
                    <View style={{marginTop: 10}}>
                        <FormInput 
                            placeholder="e.g 2 cups chicken stock"
                            value={ingredientInput} 
                            width={220}
                            onChangeText={(typedValue) => setIngredientInput(typedValue)}
                        >
                        </FormInput>
                    </View>

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

            {
                ingredientsList.length > 0 && (
                    <View style={styles.messageContainer}>
                        <Text style={styles.message}>* Tap on a list item to make edits, or tap on the trash icon to remove that item from the list *</Text>
                    </View>
                )
            }

            {/* render list of ingredients */}
            {
                ingredientsList && (
                    <IngredientList 
                        ingredients={ingredientsList} 
                        onEdit={updateIngredients}
                        onDelete={removeIngredient}
                    >
                    </IngredientList>
                )
            }

            <View>
                <CustomButton  value="Go back" width={100} onButtonPress={goBack}></CustomButton>
            </View>
        </View>
    );
};

export default AddRecipeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
        marginBottom: 50,
        alignItems: "center",
        justifyContent: "center",
    },

    ingredientInputOuterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    ingredientInputInnerContainer: {
        marginHorizontal: 5,
        // width: 300,
    },

    ingredientsLabel: {
        color: colors.primaryAccent500,
        fontWeight: 500,
        fontSize: 30,
        marginBottom: 10,
        textDecorationStyle: "dashed",
        textDecorationLine: "underline"
    },

    messageContainer: {
        width: 300,
    },

    message: {
        marginVertical: 10,
        color: colors.primaryAccent900,
    },
});