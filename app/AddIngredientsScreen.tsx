import { useContext, useEffect } from "react";

import { StyleSheet, Text, View } from "react-native";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

import { generateUUID } from "@/utils/generateUUID";

import { useRouter } from "expo-router";

// import components(s)
import CustomButton from "./components/CustomButton";
import IngredientGroupsList from "./components/IngredientGroupsList";

import colors from "./constants/colors";

const AddRecipeScreen = () => {
    const {
        nameOfDish,
        sublistNames,
        setSublistNames,
    } = useContext(RecipeContext);

    // there should always be a main list for the main ingredients
    useEffect(() => {
        if(sublistNames.length === 0){
            const newId = generateUUID();
            const listName = "Main Ingredients"
            setSublistNames((previousValues) => [...previousValues, {name: listName, id: newId}]);
        }
    }, [sublistNames]);

    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    const continueToCookingInstructions = () => {
        router.push("./CookingInstructionsScreen");
    };

    return (
        <View style={styles.container}>
            {/* header / title */}
            <Text style={styles.ingredientsLabel}>{`Ingredients for ${nameOfDish}`}</Text>

            <View style={styles.header}>
                <Text style={{fontSize: 20, fontWeight: "bold", marginVertical: 10,}}>Ingredient Groups</Text>
                <Text>Add separate ingredient groups for sauces, fillings, sub-recipes, etc.</Text>
            </View>

            {/* render ingredient groups list */}
            <IngredientGroupsList></IngredientGroupsList>
            
            {/* navigation buttons */}
            <View style={styles.buttonNavContainer}>
                <View>
                    <CustomButton 
                        value="Go back" 
                        width={100}
                        radius={50} 
                        onButtonPress={goBack}
                        color={colors.secondaryAccent500}
                    />
                </View>
                <View>
                    <CustomButton 
                        value="Continue" 
                        width={100}
                        radius={50} 
                        onButtonPress={continueToCookingInstructions}
                        color={colors.primaryAccent700}
                    />
                </View>
            </View>
        </View>
    );
};

export default AddRecipeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 60,
        marginBottom: 30,
    },

    ingredientsLabel: {
        color: colors.primaryAccent600,
        fontWeight: "bold",
        fontSize: 28,
        marginBottom: 20,
        textAlign: "center",
        // paddingHorizontal: 40,
    },

    header: {
        paddingHorizontal: 30,
    }, 

    buttonNavContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 10,
    }
});