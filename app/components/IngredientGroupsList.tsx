import { useContext, useRef, useState } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

// import component(s)
import CustomButton from "./CustomButton";
import SublistCard from "./SublistCard";

//import icon(s)
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// import colors
import colors from "../constants/colors";

//import utility function to generate random ID
import { generateUUID } from "@/utils/generateUUID";


const IngredientGroupsList = () => {
    const flatListRef = useRef(null);

    const [listName, setListName] = useState<string>(""); // for controlled input
    const [itemId, setItemId] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const {
        sublistNames,
        setSublistNames,
        subIngredients,
        setSubIngredients
    } = useContext(RecipeContext);

    const addListName = () => {
        if(!listName || listName.length === 0){
            setErrorMessage("Cannot add an empty list!");
            return;
        };

        const newId = generateUUID();

        const newListObj = {
            name: listName,
            id: newId,
        };

        const updatedListNames = [...sublistNames, newListObj];
        setSublistNames(updatedListNames);
        setListName("");
        setErrorMessage("");
    };

    const deleteSublistName = (list_id: string) => {
        const filteredLists = sublistNames.filter((sublist) => sublist.id !== list_id);
        setSublistNames(filteredLists);
    };

    const deleteSubIngredients = (list_id: string) => {
        const filteredSubIngredients = subIngredients.filter((subIngredient) => subIngredient.sublistId !== list_id);
        setSubIngredients(filteredSubIngredients);
    };

    const removeSublistAndIngredients = (list_id: string) => {
        deleteSublistName(list_id);
        deleteSubIngredients(list_id);
    };

    return (
        <View style={{flex: 1, alignItems: "center"}}>
            <FlatList
                data={sublistNames}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <SublistCard
                        name={item.name}
                        id={item.id}
                        itemId={itemId}
                        setItemId={setItemId}
                        deleteList={removeSublistAndIngredients}
                    />
                )}
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.cardContainer}
            >
            </FlatList>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Add ingredient group (e.g. Sauce)"
                    value={listName}
                    onChangeText={(textInput) => setListName(textInput)}
                    style={styles.addIngredientInput}
                />

                <View style={{marginHorizontal: 10,}}>
                    <CustomButton
                        value={<FontAwesome6 name="add" size={24} color="white" />}
                        width={40}
                        color={colors.primaryAccent700}
                        radius={6}
                        onButtonPress={addListName}
                    />
                </View>
            </View>
        </View>
    );
};

export default IngredientGroupsList;

const styles = StyleSheet.create({

    cardContainer: {
        alignItems: "center",
        justifyContent: "center",
    },

    addIngredientInput: {
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 10,
        width: "80%",
        paddingHorizontal: 20,
        // paddingVertical: 30,
    },

    inputContainer: {
        zIndex: 10,
        maxWidth: "80%", 
        width: "80%", 
        flexDirection: "row",
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        height: 80,
        borderRadius: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        marginBottom: 20,
        padding: 10,
    }
});