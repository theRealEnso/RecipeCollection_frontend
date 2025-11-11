import { RecipeContext } from "@/context/RecipeContext";
import { useContext, useEffect, useRef, useState } from "react";

import { Dimensions, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

//import component(s)
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import colors from "../constants/colors";
import CustomButton from "./CustomButton";
import ListItem from "./ListItem";

//import icons

// import utility function(s)
import { generateUUID } from "@/utils/generateUUID";

const { width } = Dimensions.get("window");

type SublistProps = {
    name: string;
    id: string;
    itemId: string;
    setItemId: React.Dispatch<React.SetStateAction<string>>;
    deleteList: (listId: string) => void
};

const Sublist = ({ name, id, itemId, setItemId, deleteList }: SublistProps) => {
    const { subIngredients, setSubIngredients } = useContext(RecipeContext);
    const subIngredientsRef = useRef(null); // to set up scrolling to end of flatlist

    const [input, setInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (userInput: string) => setInput(userInput);

    const addIngredient = () => {
        if (input.trim().length === 0) {
            setErrorMessage("Cannot add an empty ingredient!");
            return;
        }

        const subItem = {
            sublistName: name,
            sublistId: id,
            nameOfIngredient: input,
            ingredient_id: generateUUID(),
        };

        setSubIngredients((prev) => [...prev, subItem]);
        setInput("");
        setErrorMessage("");
    };

    const updateIngredients = (ingredientId: string, updatedIngredientText: string) => {
        setSubIngredients((prev) =>
            prev.map((ingredientObj) =>
                ingredientObj.ingredient_id === ingredientId
                    ? { ...ingredientObj, nameOfIngredient: updatedIngredientText }
                    : ingredientObj
            )
        );
    };

    const removeIngredient = (ingredientId: string) => {
        setSubIngredients((prev) =>
            prev.filter((ingredientObj) => ingredientObj.ingredient_id !== ingredientId)
        );
    };

    const filteredSubIngredients = subIngredients.filter(
        (subIngredient) => subIngredient.sublistId === id
    );

    //handle automatic scroll to end when items are added to the list
    useEffect(() => {
        if(subIngredientsRef.current){
            subIngredientsRef.current.scrollToEnd({
                animated: true
            });
        };
    }, [subIngredients])

    return (
        <View style={styles.container}>
            <View style={styles.trashIcon}>
                <MaterialCommunityIcons name="delete-forever" size={32} color="red" onPress={() => deleteList(id)} />
            </View>
            <View style={{ marginTop: 25, marginBottom: 10, alignItems: "center", width: "80%", paddingHorizontal: 20,}}>
                <Text style={styles.listLabel}>{`Ingredients for ${name}`}</Text>
            </View>

            <View style={styles.inputContainer}>
                <View style={{marginHorizontal: 5}}>
                    <TextInput
                        placeholder="Add ingredient name and quantity"
                        value={input}
                        onChangeText={handleInputChange}
                        style={styles.textInputStyles}
                    />
                </View>
                <View style={{marginHorizontal: 5}}>
                    <CustomButton
                        value={<MaterialIcons name="add-task" size={24} color="black" />}
                        width={40}
                        color={colors.primaryAccent900}
                        radius={20}
                        onButtonPress={addIngredient}
                    />
                </View>
            </View>

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            <FlatList
                ref={subIngredientsRef}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                data={filteredSubIngredients}
                extraData={subIngredients}
                keyExtractor={(item) => item.ingredient_id}
                renderItem={({ item }) => (
                    <ListItem
                        subItemName={item.nameOfIngredient}
                        subItemId={item.ingredient_id}
                        onEdit={updateIngredients}
                        onDelete={removeIngredient}
                        itemId={itemId}
                        setItemId={setItemId}
                    />
                )}
                
            />
        </View>
    );
};

export default Sublist;

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        height: "100%",
        width: width,
        borderRadius: 10,
        backgroundColor: "white",
        padding: 5,
        alignItems: "center",
        // overflow: "hidden",
        position: "relative",
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
    },

    textInputStyles: {
        borderRadius: 10,
        borderColor: colors.textPrimary600,
        borderWidth: 2,
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: width * 0.6,
    },
    listLabel: {
        color: colors.textPrimary700,
        fontWeight: "bold",
    },
    error: {
        color: "red",
        fontSize: 12,
        marginTop: 10,
    },
    
    trashIcon: {
        position: "absolute",
        left: 380,
    },
});
