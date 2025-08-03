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
    direction: string;
    directionId: string;
    onEdit: (directionId: string, updatedDirection: string) => void;
    onDelete: (directionId: string) => void;
    dirId: string;
    setDirId: React.Dispatch<React.SetStateAction<string>>;
};

const Direction = ({sublistName, sublistId, direction, directionId, onEdit, onDelete, dirId, setDirId}: SubIngredientProps) => {
    const [directionText, setDirectionText] = useState<string>("");
    
    const pressSubDirection = () => {
        setDirId(directionId);
    };

    const handleTextSubmit = (directionId: string) => {
        onEdit(directionId, directionText);
        setDirId("");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <TouchableWithoutFeedback onPress={() => setDirId("")}>
                <View style={styles.container}>
                    {
                        dirId === directionId 
                        ? (
                            <View style={styles.textInputContainer}>
                                <TextInput 
                                    style={styles.textInput} 
                                    value={directionText}
                                    onChangeText={(typedValue) => setDirectionText(typedValue)}
                                    onSubmitEditing={() => handleTextSubmit(directionId)}
                                >
                                </TextInput>
                            </View>
                        ) : (
                            <View style={styles.container}>
                                <View style={styles.listItem}>
                                    <Text style={{color: "white"}} onPress={pressSubDirection}>{direction}</Text>
                                </View>
                                <View style={{marginHorizontal: 5}}>
                                    <CustomButton
                                        value={<Ionicons name="trash" size={20} color="black" />}
                                        width={30}
                                        color={colors.primaryAccent900}
                                        radius={50}
                                        onButtonPress={() => onDelete(directionId)}
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

export default Direction;

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
        width: 200,
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