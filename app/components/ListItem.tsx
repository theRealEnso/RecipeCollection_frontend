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
    subItemName: string;
    subItemId: string;
    onEdit: (ingredientId: string, updatedIngredient: string) => void;
    onDelete: (ingredientId: string) => void;
    itemId: string;
    setItemId: React.Dispatch<React.SetStateAction<string>>;
};

const ListItem = ({subItemName, subItemId, onEdit, onDelete, itemId, setItemId}: SubIngredientProps) => {
    const [ingredient, setIngredient] = useState<string>("");
    
    const pressSubItem = () => {
        setItemId(subItemId);
    };

    const handleTextSubmit = (itemId: string) => {
        onEdit(itemId, ingredient);
        setItemId("");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <TouchableWithoutFeedback onPress={() => setItemId("")}>
                <View style={styles.container}>
                    {
                        itemId === subItemId 
                        ? (
                            <View style={styles.textInputContainer}>
                                <TextInput 
                                    style={styles.textInput} 
                                    value={ingredient}
                                    onChangeText={(typedValue) => setIngredient(typedValue)}
                                    onSubmitEditing={() => handleTextSubmit(itemId)}
                                >
                                </TextInput>
                            </View>
                        ) : (
                            <View style={styles.container}>
                                <View style={styles.listItem}>
                                    <Text style={{color: "white"}} onPress={pressSubItem}>{subItemName}</Text>
                                </View>
                                <View style={{marginHorizontal: 5}}>
                                    <CustomButton
                                        value={<Ionicons name="trash" size={20} color="black" />}
                                        width={30}
                                        color={colors.primaryAccent900}
                                        radius={50}
                                        onButtonPress={() => onDelete(subItemId)}
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

export default ListItem;

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