import { useContext, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

//import components
// import FormInput from "./FormInput";
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from "./CustomButton";
import ListItem from "./ListItem";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

// import colors
import colors from "../constants/colors";

//import type definitions

//import utility function to generate random ID
import { generateUUID } from "@/utils/generateUUID";

type SublistProps = {
    name: string;
    id: string;
    itemId: string;
    setItemId: React.Dispatch<React.SetStateAction<string>>;
    // onDelete: () => void;
};


const Sublist = ({name, id, itemId, setItemId}: SublistProps) => {
    const {subIngredients, setSubIngredients} = useContext(RecipeContext);

    const [input, setInput] = useState<string>("");

    const handleInputChange = (userInput: string) => {
        setInput(userInput);
    };

    const addIngredient = () => {
        let subItem = {
            listId: id,
            nameOfIngredient: input,
            ingredient_id: generateUUID(),
        };

        let updatedIngredients = [...subIngredients, subItem];
        setSubIngredients(updatedIngredients);
        setInput("");
    };

    const updateIngredients = (ingredientId: string, updatedIngredientText: string) => {
        const updatedIngredientsList = subIngredients.map((ingredientObj) => ingredientObj.ingredient_id === ingredientId 
            ? {
                ...ingredientObj, 
                nameOfIngredient: updatedIngredientText
            }
            : ingredientObj
        );

        setSubIngredients(updatedIngredientsList);
    };

    const removeIngredient = (ingredientId: string) => {
        const updatedIngredientsList = subIngredients.filter((ingredientObj) => ingredientObj.ingredient_id !== ingredientId);
        setSubIngredients(updatedIngredientsList);
    };

    const filteredSubIngredients = subIngredients.filter((subIngredient) => subIngredient.listId === id);

    console.log(subIngredients);
    
    return (
        <ScrollView style={{height: 150}}>
            <Pressable style={styles.container}>
                <View style={{marginBottom: 10,}}>
                    <Text style={styles.listLabel}>{`Ingredients for ${name}`}</Text>
                </View>

                <View style={styles.inputContainer}>
                    <View style={{width: 280}}>
                        <TextInput 
                            placeholder="Add ingredient name and quantity" 
                            value={input}
                            onChangeText={(typedValue) => handleInputChange(typedValue) }
                            style={styles.textInputStyles}
                        >
                        </TextInput>
                    </View>
                    <View>
                        <CustomButton
                            value={<Ionicons name="bag-add" size={24} color="black" />}
                            width={35}
                            color={colors.primaryAccent900}
                            radius={20}
                            onButtonPress={addIngredient}
                        >
                        </CustomButton>
                    </View>
                </View>

                {
                    subIngredients 
                         && subIngredients.length > 0
                        && (
                            <FlatList
                                data={filteredSubIngredients}
                                keyExtractor={(item) => item.ingredient_id}
                                renderItem={({item}) => (
                                    <ListItem
                                        subItemName={item.nameOfIngredient}
                                        subItemId={item.ingredient_id}
                                        onEdit={updateIngredients}
                                        onDelete={removeIngredient}
                                        itemId={itemId}
                                        setItemId={setItemId}
                                    >
                                    </ListItem>
                                )}
                            >
                            </FlatList>
                        )
                }
            </Pressable>
        </ScrollView>
    )
};

export default Sublist;

const styles = StyleSheet.create({
    container: {
        // marginTop: 10,
        borderRadius: 10,
        backgroundColor: "white",
        padding: 5,
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