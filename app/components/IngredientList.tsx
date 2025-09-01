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

//import type(s);
import { Ingredient } from "@/types/Recipe";

type IngredientListProps = {
    ingredients: Ingredient[];
    onEdit: (ingredientId: string, updatedIngredient: string) => void;
    onDelete: (ingredientId: string) => void;
};

const IngredientList = ({ingredients, onEdit, onDelete}: IngredientListProps) => {
    const [itemId, setItemId] = useState<string>("");
    const [itemText, setItemText] = useState<string>("");

    const handleItemPress = (itemText: string, ingredientId: string) => {
        setItemText(itemText);
        setItemId(ingredientId);
    };

    const handleTextSubmit = (ingredientId: string) => {
        onEdit(ingredientId, itemText);
        setItemId("");
    };

    const handleItemDelete = (ingredientId: string) => {
        onDelete(ingredientId);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex: 1}}
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                    setItemId("");
                }}
            >
                <View>                    
                    <FlatList
                        data={ingredients}
                        renderItem={({item}) => {
                            return (
                                <View style={styles.listContainer}>
                                    <View style={styles.touchableContainer}>
                                        {
                                            itemId === item.ingredient_id 
                                            ? (
                                                <TextInput
                                                    style={styles.textInput} 
                                                    value={itemText}
                                                    onChangeText={(newText) => setItemText(newText)}
                                                    onSubmitEditing={() => handleTextSubmit(item.ingredient_id)}
                                                ></TextInput>
                                            ) 
                                            : (
                                                <View style={styles.listItem}>
                                                    <View>
                                                        <TouchableOpacity style={styles.touchable}>
                                                            <Text 
                                                                style={styles.text2} 
                                                                onPress={() => handleItemPress(item.nameOfIngredient, item.ingredient_id)}
                                                                
                                                            >
                                                                {item.nameOfIngredient}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View>
                                                        <FontAwesome 
                                                            name="trash-o" 
                                                            size={24} color="black" 
                                                            onPress={() => handleItemDelete(item.ingredient_id)} 
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
        marginVertical: 5,
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
        width: 300,
        alignItems: "center",
        justifyContent: "center",
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
        width: 250,
    },

    textInput: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: colors.textPrimary700,
        paddingHorizontal: 10,
        paddingVertical: 8,
        width: 250,
    },
});

