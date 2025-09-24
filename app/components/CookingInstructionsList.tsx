import { useContext, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

//import context
import { RecipeContext } from "@/context/RecipeContext";

// import component(s)
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomButton from "./CustomButton";
import FormInput from "./FormInput";
import Instruction from "./Instruction";

//import utility function(s)
import { generateUUID } from "@/utils/generateUUID";

const CookingInstructionsList = () => {
    const instructionsListRef = useRef(null);

    const { cookingInstructions, setCookingInstructions } = useContext(RecipeContext);

    const [instructionsInput, setInstructionsInput] = useState<string>("");
    const [error, setError] = useState<string>("");

    // function to add typed cooking instructions to array
    const addCookingInstruction = () => {
        if(instructionsInput.length === 0){
            setError("Cannot add an empty instruction!");
            return;
        };

        const newId = generateUUID();
        const newInstruction = {
            instruction: instructionsInput,
            instruction_id: newId,
        };
        
        const updatedCookingInstructions = [...cookingInstructions, newInstruction];
        setCookingInstructions(updatedCookingInstructions);
        setInstructionsInput("");
        setError("");
    };

    const removeCookingInstruction = (instructionId: string) => {
        const updatedCookingInstructions = cookingInstructions.filter((cookingInstruction) => cookingInstruction.instruction_id !== instructionId);

        setCookingInstructions(updatedCookingInstructions);

    }

    useEffect(() => {
        if(instructionsListRef && instructionsListRef.current){
            instructionsListRef.current.scrollToEnd({
                animated: true,
            })
        }
    }, [cookingInstructions]);

    // console.log(instructionsInput);
    // console.log(cookingInstructions);

    return (
        <View style={{flex: 1}}>
            {/* text input and button to add cooking instructions to the list */}
            <View style={styles.inputContainer}>
                <View>
                    <FormInput 
                        placeholder="Enter step-by-step cooking instructions" 
                        value={instructionsInput} 
                        width={300}
                        onChangeText={(typedValue) => setInstructionsInput(typedValue)}
                    >
                    </FormInput>
                </View>

                <View>
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
                error && (
                    <View style={{alignItems: "center"}}>
                        <Text style={styles.errorMessage}>{error}</Text>
                    </View>
                )
            }

            {
                cookingInstructions.length > 0 &&
                    <FlatList
                        ref={instructionsListRef}
                        data={cookingInstructions}
                        keyExtractor={(item) => item.instruction_id}
                        renderItem={({item}) => {
                            return (
                                <Instruction instructionData={item} onDelete={removeCookingInstruction}></Instruction>
                            )
                        }}
                        showsVerticalScrollIndicator={false}
                    >

                    </FlatList>
            }

        </View>
    )
};

export default CookingInstructionsList;

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginVertical: 10,
        width: "100%",
    },

    errorMessage: {
        color: "red",
        fontSize: 16,
    }
});