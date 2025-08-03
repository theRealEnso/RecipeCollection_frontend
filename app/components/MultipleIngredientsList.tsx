import { useContext, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

//import components for creating a swipeable
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

// import component(s)
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from "./CustomButton";
import FormInput from "./FormInput";
import Sublist from "./Sublist";

// import colors
import colors from "../constants/colors";

//import utility function to generate random ID
import { generateUUID } from "@/utils/generateUUID";

const MultipleIngredientsList = () => {
    const [listName, setListName] = useState<string>(""); // for controlled input
    const [itemId, setItemId] = useState<string>("");

    const {
        sublistNames,
        setSublistNames,
        subIngredients,
        setSubIngredients
    } = useContext(RecipeContext);

    const addListName = () => {
        const newId = generateUUID();

        const newListObj = {
            name: listName,
            id: newId,
        };

        const updatedListNames = [...sublistNames, newListObj];
        setSublistNames(updatedListNames);
        setListName("");
    };

    const deleteSublistName = (list_id: string) => {
        const filteredLists = sublistNames.filter((sublist) => sublist.id !== list_id);
        setSublistNames(filteredLists);
    };

    const deleteSubIngredients = (list_id: string) => {
        const filteredSubIngredients = subIngredients.filter((subIngredient) => subIngredient.listId !== list_id);
        setSubIngredients(filteredSubIngredients);
    };

    const removeSublistAndIngredients = (list_id: string) => {
        deleteSublistName(list_id);
        deleteSubIngredients(list_id);
    };
    //function to show trash can UI to delete a sublist
    const rightAction = (onDelete: () => void) => (
        <Pressable onPress={onDelete}>
            <View style={styles.deleteBox}>
                <Ionicons name="trash" size={24} color="white" />
                <Text style={styles.deleteText}>Delete</Text>
            </View>
        </Pressable>
    );


    return (
        <Pressable style={{flex: 1,}}>
            <View style={styles.ingredientInputOuterContainer}>
                <View>
                    <View style={styles.tipsContainer}>
                        <View style={{marginRight: 5,}}>
                            <Text style={styles.tipsHeader}>Tips</Text>
                        </View>
                        <View style={{marginRight: 5,}}>
                            <FontAwesome5 name="lightbulb" size={24} color="black" />
                        </View>
                    </View>
                    <Text style={styles.tips}>* Create separate lists here by typing in the name of the list</Text>
                    <Text style={styles.tips}>* To remove a list, swipe left on the list and press delete icon</Text>
                    <Text style={styles.tips}>* You can also create your main list of ingredients here and name it something like Final Dish</Text>
                </View>
                
                <View style={styles.ingredientInputInnerContainer}>
                    <View style={{marginTop: 10}}>
                        <FormInput 
                            placeholder="e.g. homemade Garam Masala Powder"
                            value={listName} 
                            width={300}
                            onChangeText={(typedValue) => setListName(typedValue)}
                        >
                        </FormInput>
                    </View>

                    <View style={styles.ingredientInputInnerContainer}>
                        <CustomButton 
                            value={<FontAwesome6 name="add" size={30} color="white"></FontAwesome6>} 
                            width={50}
                            onButtonPress={addListName}
                        >
                        </CustomButton>
                    </View>

                </View>
            </View>

            <FlatList
                data={sublistNames}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <GestureHandlerRootView>
                        <ReanimatedSwipeable
                            containerStyle={styles.swipeable}
                            friction={2}
                            enableTrackpadTwoFingerGesture
                            rightThreshold={40}
                            //renderRightActions expects a function that returns a React node, or in other words, our swipeable UI
                            renderRightActions={() => rightAction(() => removeSublistAndIngredients(item.id))} 
                        >
                            <Sublist
                                name={item.name}
                                id={item.id}
                                itemId={itemId}
                                setItemId={setItemId}
                            >
                            </Sublist>
                        </ReanimatedSwipeable>
                    </GestureHandlerRootView>
                )}
            >
            </FlatList>
        </Pressable>
    );
};

export default MultipleIngredientsList;

const styles = StyleSheet.create({
    swipeable: {
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: "white",
        // height: "100%",
        // width: 600,
        // alignItems: 'center',
        // justifyContent: "center"
    },

    ingredientInputOuterContainer: {
        // alignItems: "center",
        // justifyContent: "center",
        marginTop: 20,
    },

    ingredientInputInnerContainer: {
        marginHorizontal: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    messageContainer: {
        width: 300,
    },
    
    message: {
        marginVertical: 10,
        color: colors.primaryAccent900,
    },

    deleteBox: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
  },

  tipsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  tipsHeader: {
    fontSize: 16,
    color: colors.primaryAccent600,
    fontWeight: "bold",
  },

  tips: {
    fontSize: 12,
  }
});