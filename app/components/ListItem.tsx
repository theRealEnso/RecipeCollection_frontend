import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";

// import icon(s)
import FontAwesome from '@expo/vector-icons/FontAwesome';

//import component(s)
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
        setIngredient(subItemName);
    };

    const handleTextSubmit = (itemId: string) => {
        onEdit(itemId, ingredient);
        setItemId("");
    };

    return (
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
                                    value={<FontAwesome name="remove" size={15} color={colors.primaryAccent800} />}
                                    width={30}
                                    color={colors.secondaryAccent500}
                                    radius={15}
                                    onButtonPress={() => onDelete(subItemId)}
                                >
                                </CustomButton>
                            </View>
                        </View>
                    )
                }
            </View>
        </TouchableWithoutFeedback>
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
        backgroundColor: colors.primaryAccent000,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 250,
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