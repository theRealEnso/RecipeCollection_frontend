import { useContext, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

//import components
// import FormInput from "./FormInput";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomButton from "./CustomButton";
import Instruction from "./Instruction";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

// import colors
import colors from "../constants/colors";

//import type definitions

//import utility function to generate random ID
import { generateUUID } from "@/utils/generateUUID";

type SubInstructionsProp = {
    name: string;
    id: string;
};

const SubInstructions = ({name, id,}: SubInstructionsProp) => {
    const subInstructionsRef = useRef(null)
    const {subInstructions, setSubInstructions} = useContext(RecipeContext);

    const [input, setInput] = useState<string>("");
    const [instructionID, setInstructionID] = useState<string>("");

    const handleInputChange = (userInput: string) => {
        setInput(userInput);
    };

    //function to add an instruction to the sub instructions array
    const addInstructions = () => {
        if(!input || input.length ===0 ){
            return;
        }

        let subInstruction = {
            sublistName: name,
            sublistId: id,
            instruction: input,
            instruction_id: generateUUID(),
        };

        let updatedInstructions = [...subInstructions, subInstruction];
        setSubInstructions(updatedInstructions);
        setInput("");
    };

    //function to remove a instruction from the sub instructions array
    const removeInstruction = (instructionId: string) => {
        const updatedSubInstructions = subInstructions.filter((subInstruction) => subInstruction.instruction_id !== instructionId);
        setSubInstructions(updatedSubInstructions);
    };

    //function to edit a specific instruction from the sub instructions array
    const updateInstruction = (instructionId: string, updatedInstruction: string) => {
        const updatedSubInstructions = subInstructions.map((subInstruction) => subInstruction.instruction_id === instructionId ? {...subInstruction, instruction: updatedInstruction} : subInstruction);

        setSubInstructions(updatedSubInstructions);
    };

    const filteredSubInstructions = subInstructions.filter((subInstruction) => subInstruction.sublistId === id);

    useEffect(() => {
        if(subInstructionsRef.current){
            subInstructionsRef.current.scrollToEnd({
                animated: true,
            });
        };
    }, [subInstructions]);
    
    return (
        <View style={styles.outerContainer}>
            <Pressable style={styles.container}>
                <View style={{marginBottom: 10,}}>
                    <Text style={styles.listLabel}>{`Prep/cooking instructions for ${name}`}</Text>
                </View>

                <View style={styles.inputContainer}>
                    <View style={{width: 280, marginHorizontal: 5}}>
                        <TextInput 
                            placeholder="Add food handling instructions" 
                            value={input}
                            onChangeText={(typedValue) => handleInputChange(typedValue) }
                            style={styles.textInputStyles}
                        >
                        </TextInput>
                    </View>
                    <View style={{marginHorizontal: 5}}>
                        <CustomButton
                            value={<MaterialIcons name="add-task" size={24} color="black" />}
                            width={35}
                            color={colors.primaryAccent900}
                            radius={20}
                            onButtonPress={addInstructions}
                        >
                        </CustomButton>
                    </View>
                </View>

                {
                    subInstructions 
                         && subInstructions.length > 0
                        && (
                            <FlatList
                                ref={subInstructionsRef}
                                data={filteredSubInstructions}
                                keyExtractor={(item) => item.instruction_id}
                                renderItem={({item}) => (
                                    <Instruction
                                        sublistName={item.sublistName}
                                        sublistId={item.sublistId}
                                        instruction={item.instruction}
                                        instructionId={item.instruction_id}
                                        onEdit={updateInstruction}
                                        onDelete={removeInstruction}
                                        instructionID={instructionID}
                                        setInstructionID={setInstructionID}
                
                                    >
                                    </Instruction>
                                )}
                            >
                            </FlatList>
                        )
                }
            </Pressable>
        </View>
    )
};

export default SubInstructions;

const styles = StyleSheet.create({
    outerContainer: {
        height: "100%",
        width: "80%",
        flex: 1,
        padding: 30,
    },

    container: {
        flex: 1,
        marginVertical: 20,
        borderRadius: 10,
        backgroundColor: "white",
        padding: 15,
        width: "100%",
    },

    textInputStyles: {
        borderRadius: 10,
        borderColor: colors.textPrimary600,
        borderWidth: 2,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    listLabel: {
        color: colors.textPrimary700,
        fontWeight: "bold",
    },
});