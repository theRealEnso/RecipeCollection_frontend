import { useContext, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";

//import components
import CustomButton from "./CustomButton";
import SubInstruction from "./SubInstruction";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

// import colors
import colors from "../constants/colors";

//import icon(s)
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

//import utility function to generate random ID
import { generateUUID } from "@/utils/generateUUID";

type SubInstructionsProp = {
    name: string;
    id: string;
};

const SubInstructions = ({name, id,}: SubInstructionsProp) => {
    const {width: screenWidth} = useWindowDimensions();

    const subInstructionsRef = useRef(null);
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

    // useEffect(() => {
    //     if(subInstructionsRef.current){
    //         subInstructionsRef.current.scrollToEnd({
    //             animated: true,
    //         });
    //     };
    // }, [subInstructions]);
    
    return (
        <View style={[styles.outerContainer, {width: screenWidth}]}>
            <View style={[styles.container, {width: screenWidth * .9}]}>
                <View style={{marginBottom: 10,}}>
                    <Text style={styles.listLabel}>{`Instructions for ${name}`}</Text>
                </View>

                <View style={styles.inputContainer}>
                    <View style={{width: "80%"}}>
                        <TextInput 
                            placeholder="Add prep/cooking instructions" 
                            value={input}
                            onChangeText={(typedValue) => handleInputChange(typedValue) }
                            style={styles.textInputStyles}
                            multiline={true}
                            numberOfLines={3}
                        >
                        </TextInput>
                    </View>
                    <View style={{marginRight: 10,}}>
                        <CustomButton
                            value={<FontAwesome6 name="add" size={24} color="white" />}
                            width={40}
                            color={colors.primaryAccent600}
                            radius={10}
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
                                    <SubInstruction
                                        sublistName={item.sublistName}
                                        sublistId={item.sublistId}
                                        instruction={item.instruction}
                                        instructionId={item.instruction_id}
                                        onEdit={updateInstruction}
                                        onDelete={removeInstruction}
                                        instructionID={instructionID}
                                        setInstructionID={setInstructionID}
                
                                    >
                                    </SubInstruction>
                                )}
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={false}
                            >
                            </FlatList>
                        )
                }
            </View>
        </View>
    )
};

export default SubInstructions;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        alignItems: "center",
    },

    container: {
        flex: 1,
        marginVertical: 20,
        borderRadius: 10,
        backgroundColor: "white",
        padding: 15,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 4,
    },

    textInputStyles: {
        borderRadius: 10,
        borderColor: colors.textPrimary600,
        borderWidth: 2,
        paddingHorizontal: 15,
        paddingVertical: 10,
        height: 70,
        textAlignVertical: "top"
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    listLabel: {
        color: colors.secondaryAccent900,
        fontWeight: "bold",
        fontSize: 20,
        padding: 10,
    },
});