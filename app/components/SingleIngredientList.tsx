import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

// import component(s)
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import CustomButton from "./CustomButton";
import FormInput from "./FormInput";
import IngredientList from "./IngredientList";

// import colors
import colors from "../constants/colors";

const SingleIngredientList = () => {
    const [error, setError] = useState<string>("");

    const {
        ingredientInput, 
        setIngredientInput,
        ingredientsList,
        setIngredientsList,
    } = useContext(RecipeContext);

    const addIngredientToList = () => {
        if(ingredientInput.length === 0){
            setError("Cannot add an empty ingredient to your list!");
            return;
        };

        const updatedIngredientList = [...ingredientsList, ingredientInput];
        setIngredientsList(updatedIngredientList);
        setIngredientInput("");
        setError("");
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

    return (
        <View style={styles.container}>
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
                        radius={12}
                        onButtonPress={addIngredientToList}
                    >
                    </CustomButton>
                </View>
            </View>

            {
                error && <Text style={styles.errorMessage}>{error}</Text>
            }

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
        </View>
    );
};

export default SingleIngredientList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        marginVertical: 20,
    },
    ingredientInputOuterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        // backgroundColor: "white",
        // borderRadius: 10,
    },

    ingredientInputInnerContainer: {
        marginHorizontal: 5,
        // width: 300,
        alignItems: "center",
        justifyContent: "center",
    },

    messageContainer: {
        width: 300,
        marginVertical: 10,

    },
    
    message: {
        marginVertical: 10,
        color: colors.primaryAccent900,
    },

    errorMessage: {
        color: "red",
    }
});