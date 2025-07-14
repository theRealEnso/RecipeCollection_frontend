import { useState } from "react";
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import FontAwesome from '@expo/vector-icons/FontAwesome';

import colors from "../constants/colors";

type IngredientListProps = {
    ingredients: string[];
    onEdit: (index: number, updatedIngredient: string) => void;
    onDelete: (index: number) => void;
};

const IngredientList = ({ingredients, onEdit, onDelete}: IngredientListProps) => {
    const [itemIndex, setItemIndex] = useState<number | null>(null);
    const [itemText, setItemText] = useState<string>("");

    const handleItemPress = (itemText: string, index: number) => {
        setItemText(itemText);
        setItemIndex(index);
    };

    // const handleInputChange = () => {

    // }

    const handleTextSubmit = (index: number) => {
        onEdit(index, itemText);
        setItemIndex(null);
    };

    const handleItemDelete = (index: number) => {
        onDelete(index);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                    setItemIndex(null);
                }}
            >
                <View>                    
                    <FlatList
                        data={ingredients}
                        renderItem={({item, index}) => {
                            return (
                                <View style={styles.listContainer}>
                                    <Text style={[styles.text, {fontSize: 25, fontWeight: "bold"}]}>{"\u2022"}</Text>
                                    <View style={styles.touchableContainer}>
                                        {
                                            itemIndex === index 
                                            ? (
                                                <TextInput
                                                    style={styles.textInput} 
                                                    value={itemText}
                                                    onChangeText={(newText) => setItemText(newText)}
                                                    onSubmitEditing={() => handleTextSubmit(index)}
                                                ></TextInput>
                                            ) 
                                            : (
                                                <View style={styles.listItem}>
                                                    <View>
                                                        <TouchableOpacity style={styles.touchable}>
                                                            <Text 
                                                                style={styles.text2} 
                                                                onPress={() => handleItemPress(item, index)}
                                                                
                                                            >
                                                                {item}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View>
                                                        <FontAwesome 
                                                            name="trash-o" 
                                                            size={24} color="black" 
                                                            onPress={() => handleItemDelete(index)} 
                                                        />
                                                    </View>

                                                </View>
                                            )
                                        }
                                    </View>
                                </View>
                            )
                        }}
                        keyExtractor={(_, index) => index.toString()}
                    >
                    </FlatList>
                </View>
            </TouchableWithoutFeedback>
         </KeyboardAvoidingView>
    );
};

export default IngredientList;

const styles = StyleSheet.create({
    listContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    listItem: {
        flexDirection: "row",
        alignItems: "center",
    },

    text: {
        marginHorizontal: 5,
    },

    text2: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
    },

    touchableContainer: {
        width: 120,
    },

    touchable: {
        marginHorizontal: 5,
        backgroundColor: colors.textPrimary700,
        borderWidth: 1,
        borderColor: colors.textPrimary700,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: "center",
        justifyContent: "center",
        width: 120,
    },

    textInput: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: colors.textPrimary700,
        padding: 5,
        width: 100,
    },
});

