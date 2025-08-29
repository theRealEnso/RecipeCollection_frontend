import { useContext, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";



// import component(s)
import CustomButton from "./CustomButton";
import FormInput from "./FormInput";
import Sublist from "./Sublist";

//import icon(s)
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// import colors
import colors from "../constants/colors";

//import utility function to generate random ID
import { generateUUID } from "@/utils/generateUUID";

const MultipleIngredientsList = () => {
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

    //function to show trash can UI to delete a sublist
    // const rightAction = (onDelete: () => void) => (
    //     <Pressable onPress={onDelete}>
    //         <View style={styles.deleteBox}>
    //             <Ionicons name="trash" size={24} color="white" />
    //             <Text style={styles.deleteText}>Delete</Text>
    //         </View>
    //     </Pressable>
    // );


    return (
        <View style={{flex: 1,}}>
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
                    <Text style={styles.tips}>{`* Create separate lists here by typing in the name of the list, then press the "+" button`}</Text>
                    <Text style={styles.tips}>{`* Tap on a list item to make changes. Press in the "X" icon to remove item from the list`}</Text>
                    <Text style={styles.tips}>{`* Swipe left or right on the list to view other lists that you have added`}</Text>
                    <Text style={styles.tips}>{`* Tap on the trash icon at the top right to delete the list`}</Text>
                    <Text style={styles.tips}>* You can also create your main list of ingredients here and name it something like Final Dish</Text>
                </View>
                
                <View style={styles.ingredientInputOuterContainer}>
                    <View style={styles.ingredientInputInnerContainer}>
                        <View style={{marginHorizontal: 5}}>
                            <FormInput 
                                placeholder="e.g. homemade Garam Masala Powder"
                                value={listName} 
                                width={280}
                                onChangeText={(typedValue) => setListName(typedValue)}
                            >
                            </FormInput>
                        </View>

                        <View style={{marginHorizontal: 5}}>
                            <CustomButton 
                                value={<FontAwesome6 name="add" size={30} color="white"></FontAwesome6>} 
                                width={50}
                                onButtonPress={addListName}
                            >
                            </CustomButton>
                        </View>
                    </View>

                    {
                        errorMessage && (
                            <View>
                                <Text style={styles.error}>{errorMessage}</Text>
                            </View>
                        )
                    }
                </View>
            </View>

            <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                data={sublistNames}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <Sublist
                        name={item.name}
                        id={item.id}
                        itemId={itemId}
                        setItemId={setItemId}
                        deleteList={removeSublistAndIngredients}
                    />
                )}
                // to add gap between each sublist
                ItemSeparatorComponent={() => (
                    <View style={{width: 10}}></View>
                )}
            >
            </FlatList>

            {
                sublistNames.length > 0 && (
                    <View style={styles.arrowContainer}>
                        <Entypo name="arrow-long-left" size={50} color={colors.primaryAccent900} />
                        <Text style={{fontSize: 24, fontWeight: "bold", color: colors.primaryAccent900}}>Swipe</Text>
                        <Entypo name="arrow-long-right" size={50} color={colors.primaryAccent900} />
                    </View>
                )
            }
        </View>
    );
};

export default MultipleIngredientsList;

const styles = StyleSheet.create({
    // swipeable: {
    //     marginTop: 10,
    //     borderRadius: 10,
    //     backgroundColor: "white",
    // },

    sublistContainer: {
        flex: 1,
        overflow: "hidden",
        borderRadius: 12,
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
    fontSize: 14,
    marginVertical: 2,
  },

  error: {
    color: "red",
    fontSize: 12,
  },

  arrowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    // paddingBottom: 5,
  }
});