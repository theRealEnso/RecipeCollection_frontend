import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";

// import component(s)
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from "./CustomButton";

// import colors
import colors from "../constants/colors";


// define types
type SubIngredientProps = {
    sublistName: string;
    sublistId: string;
    instruction: string;
    instructionId: string;
    onEdit: (instructionId: string, updatedInstruction: string) => void;
    onDelete: (instructionId: string) => void;
    instructionID: string;
    setInstructionID: React.Dispatch<React.SetStateAction<string>>;
};

const Instruction = ({sublistName, sublistId, instruction, instructionId, onEdit, onDelete, instructionID, setInstructionID}: SubIngredientProps) => {
    const [instructionText, setInstructionText] = useState<string>("");
    
    const pressSubInstruction = () => {
        setInstructionID(instructionId);
    };

    const handleTextSubmit = (instructionId: string) => {
        onEdit(instructionId, instructionText);
        setInstructionID("");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <TouchableWithoutFeedback onPress={() => setInstructionID("")}>
                <View style={styles.container}>
                    {
                        instructionId === instructionID 
                        ? (
                            <View style={styles.textInputContainer}>
                                <TextInput 
                                    style={styles.textInput} 
                                    value={instructionText}
                                    onChangeText={(typedValue) => setInstructionText(typedValue)}
                                    onSubmitEditing={() => handleTextSubmit(instructionId)}
                                >
                                </TextInput>
                            </View>
                        ) : (
                            <View style={styles.container}>
                                <View style={styles.listItem}>
                                    <Text style={{color: "white"}} onPress={pressSubInstruction}>{instruction}</Text>
                                </View>
                                <View style={{marginHorizontal: 5}}>
                                    <CustomButton
                                        value={<Ionicons name="trash" size={20} color="black" />}
                                        width={30}
                                        color={colors.primaryAccent900}
                                        radius={50}
                                        onButtonPress={() => onDelete(instructionId)}
                                    >
                                    </CustomButton>
                                </View>
                            </View>
                        )
                    }
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default Instruction;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginTop: 5,
    },

    listItem: {
        borderRadius: 15,
        backgroundColor: colors.primaryAccent600,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 300,
        alignItems: "center",
        justifyContent: "center",
    },

    textInputContainer: {
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",

    },

    textInput: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: colors.primaryAccent600,
        paddingHorizontal: 15,
        paddingVertical: 5,
        width: 200,
    },
});