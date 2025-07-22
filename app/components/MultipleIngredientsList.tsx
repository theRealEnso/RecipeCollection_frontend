import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

// import component(s)
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import CustomButton from "./CustomButton";
import FormInput from "./FormInput";
import Sublist from "./Sublist";

// import colors
import colors from "../constants/colors";

//import utility function to generate random ID
import { generateUUID } from "@/utils/generateUUID";

const MultipleIngredientsList = () => {
    const [listName, setListName] = useState<string>("");

    const {
        sublistNames,
        setSublistNames,
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

    return (
        <View style={{flex: 1}}>
            <View style={styles.ingredientInputOuterContainer}>
                <View>
                    <Text>Enter name of sub-recipe list</Text>
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

            {
                sublistNames && 
                    sublistNames.length > 0 
                        && sublistNames.map((listNameObj) => <Sublist key={listNameObj.id} name={listNameObj.name} id={listNameObj.id}></Sublist>)
            }
        </View>
    );
};

export default MultipleIngredientsList;

const styles = StyleSheet.create({

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
});