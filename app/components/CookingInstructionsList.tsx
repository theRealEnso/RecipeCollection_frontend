import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

//import context
import { RecipeContext } from "@/context/RecipeContext";

// import component(s)
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomButton from "./CustomButton";
import FormInput from "./FormInput";

// define types
// type CookingInstructions = {
//     cookingInstructions: string[];
// };

const CookingInstructionsList = () => {
    const { cookingInstructions, setCookingInstructions } = useContext(RecipeContext);

    const [instructionsInput, setInstructionsInput] = useState<string>("");
    const [error, setError] = useState<string>("");

    // function to add typed cooking instructions to array
    const addCookingInstruction = () => {
        if(instructionsInput.length === 0){
            setError("Cannot add an empty instruction!");
            return;
        };
        
        const updatedCookingInstructions = [...cookingInstructions, instructionsInput];
        setCookingInstructions(updatedCookingInstructions);
        setInstructionsInput("");
    };

    // console.log(instructionsInput);
    // console.log(cookingInstructions);

    return (
        <View style={{flex: 1}}>
            {/* text input and button to add cooking instructions to the list */}
            <View style={styles.inputContainer}>
                <View style={{marginHorizontal: 5}}>
                    <FormInput 
                        placeholder="Enter step-by-step cooking instructions" 
                        value={instructionsInput} 
                        width={280}
                        onChangeText={(typedValue) => setInstructionsInput(typedValue)}
                    >
                    </FormInput>
                </View>

                <View style={{marginHorizontal: 5}}>
                    <CustomButton
                        value={<MaterialIcons name="add-task" size={24} color="black" />}
                        width={40}
                        radius={25}
                        onButtonPress={addCookingInstruction}
                    >
                    </CustomButton>
                </View>
            </View>

            {
                error && <Text style={styles.errorMessage}>{error}</Text>
            }

            {
                cookingInstructions.length > 0 &&
                    cookingInstructions.map((cookingInstruction, index) => (<Text key={index}>{cookingInstruction}</Text>))
            }

        </View>
    )
};

export default CookingInstructionsList;

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    errorMessage: {
        color: "red",
        fontSize: 16,
    }
});