import { RecipeContext } from "@/context/RecipeContext";
import { useContext, useRef, useState } from "react";

import { FlatList, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";

//import component(s)
import colors from "../constants/colors";
import CustomButton from "./CustomButton";
import ListItem from "./ListItem";

//import icons
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';

// import utility function(s)
import { generateUUID } from "@/utils/generateUUID";

type SublistProps = {
    name: string;
    id: string;
    itemId: string;
    setItemId: React.Dispatch<React.SetStateAction<string>>;
    deleteList: (listId: string) => void
};

const SublistCard = ({ name, id, itemId, setItemId, deleteList }: SublistProps) => {
    const { width: screenWidth } = useWindowDimensions();
    const { sublistNames, subIngredients, setSubIngredients } = useContext(RecipeContext);
    
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
    // useEffect(() => {
    //     if(subIngredientsRef.current){
    //         subIngredientsRef.current.scrollToEnd({
    //             animated: true
    //         });
    //     };
    // }, [subIngredients])

    return (
        <View style={[styles.container, {width: screenWidth * .90}]}>
            <View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Text style={styles.listName}>{name}</Text>
                    <Octicons 
                        name="trash" 
                        size={24} 
                        color={colors.textSecondary600} 
                        style={{paddingHorizontal: 15}}
                        onPress={() => deleteList(id)} 
                    />
                </View>
                

                <View style={styles.inputContainer}>
                    <View style={{marginHorizontal: 5, maxWidth: "90%", width: "85%"}}>
                        <TextInput
                            placeholder="Add ingredient (e.g. 3 tbsp cumin seeds)"
                            value={input}
                            onChangeText={handleInputChange}
                            style={styles.textInputStyles}
                        />
                    </View>
                    

                    <View style={{marginHorizontal: 5}}>
                        <CustomButton
                            value={<FontAwesome6 name="add" size={24} color="white" />}
                            width={40}
                            color={colors.primaryAccent700}
                            radius={6}
                            onButtonPress={addIngredient}
                        />
                    </View>
                </View>
            </View>

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            <FlatList
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
                ref={subIngredientsRef}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default SublistCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginVertical: 12,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 4,
        alignItems: "center",
    },

    listName: {
        padding: 10,
        fontSize: 20,
        fontWeight: "bold",
        color: colors.secondaryAccent900,
        marginBottom: 10,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

    textInputStyles: {
        borderRadius: 10,
        borderColor: colors.textPrimary600,
        borderWidth: 1,
        borderTopWidth: 1.25,
        paddingHorizontal: 20,
        paddingVertical: 10,
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
