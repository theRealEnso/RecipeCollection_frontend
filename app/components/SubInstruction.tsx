import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

// import component(s)
import CustomButton from "./CustomButton";

// import icon(s)
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';

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

const SubInstruction = ({sublistName, sublistId, instruction, instructionId, onEdit, onDelete, instructionID, setInstructionID}: SubIngredientProps) => {
    const [instructionText, setInstructionText] = useState<string>("");
    
    const editSubInstruction = () => {
        setInstructionID(instructionId);
        setInstructionText(instruction);
    };

    const handleInstructionUpdate = (instructionId: string) => {
        onEdit(instructionId, instructionText);
        setInstructionID("");
    };

    return (
        <View style={{flex: 1}}>
            {
                instructionId === instructionID 
                ? (
                    <View style={styles.textInputContainer}>
                        <TextInput 
                            style={styles.textInput} 
                            value={instructionText}
                            onChangeText={(typedValue) => setInstructionText(typedValue)}
                        >
                        </TextInput>

                        <View style={styles.iconsContainer}>
                            <View>
                                <CustomButton
                                    value={<Feather name="check" size={22} color={colors.primaryAccent900} />}
                                    width={40}
                                    radius={20}
                                    onButtonPress={() => handleInstructionUpdate(instructionId)}
                                >
                                </CustomButton>
                            </View>
                            <View>
                                <CustomButton
                                    value={<Fontisto name="close-a" size={16} color={colors.secondaryAccent900} />}
                                    width={40}
                                    radius={20}
                                    onButtonPress={() => setInstructionID("")}
                                >
                                </CustomButton>
                            </View>
                        </View>

                    </View>
                ) : (
                    <View style={styles.instructionsContainer}>
                        <Text style={styles.instructionText}>{instruction}</Text>
                    
                        <View style={styles.iconsContainer}>
                            <View>
                                <CustomButton
                                    value={<Entypo name="edit" size={22} color="black" />}
                                    width={40}
                                    radius={20}
                                    onButtonPress={() => editSubInstruction()}
                                >
                                </CustomButton>
                            </View>
                            <View>
                                <CustomButton
                                    value={<Ionicons name="trash" size={22} color={colors.secondaryAccent900} />}
                                    width={40}
                                    radius={20}
                                    onButtonPress={() => onDelete(instructionId)}
                                >
                                </CustomButton>
                            </View>
                        </View>

                    </View>
                )
            }
        </View>
          

    );
};

export default SubInstruction;

const styles = StyleSheet.create({
    instructionsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 5,
        paddingHorizontal: 10,
    },

    textInputContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },

        textInput: {
        borderBottomWidth: 2,
        borderRadius: 10,
        borderColor: colors.primaryAccent600,
        // paddingHorizontal: 15,
        paddingVertical: 5,
        maxWidth: "90%",
        width: "75%",
        fontSize: 16,
        fontWeight: 400,
        color: colors.secondaryAccent900,
    },


    instructionText: {        
        color: colors.textPrimary600,
        fontWeight: "400",
        fontSize: 16,
    },

    iconsContainer: {
        flexDirection: "row",
    }
});