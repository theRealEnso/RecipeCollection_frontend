import { useContext, useState } from "react";

import { StyleSheet, Text, View } from "react-native";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

import { useRouter } from "expo-router";

// import components(s)
import Fontisto from '@expo/vector-icons/Fontisto';
import CustomButton from "./components/CustomButton";
import MultipleIngredientsList from "./components/MultipleIngredientsList";
import SingleIngredientList from "./components/SingleIngredientList";

import colors from "./constants/colors";

const AddRecipeScreen = () => {
    const [toggleNo, setToggleNo] = useState<boolean>(true);
    const [toggleYes, setToggleYes] = useState<boolean>(false);

    const {
        nameOfDish,
        setIngredientsList,
    } = useContext(RecipeContext);

    const router = useRouter();

    const pressNo = () => {
        setToggleNo(true);
        setToggleYes(false);
    };
    const pressYes = () => {
        setToggleNo(false);
        setToggleYes(true);
        setIngredientsList([]);
    };

    //function to back to previous screen
    const goBack = () => {
        router.back();
    };

    const continueToCookingDirections = () => {
        router.push("/CookingDirections");
    };

    return (
        <View style={styles.container}>
            {/* header / title */}
            <Text style={styles.ingredientsLabel}>{`Ingredients for ${nameOfDish}`}</Text>

            {/* ui that prompts user to select no or yes to create ingredient sublists */}
            <View style={{flexDirection: "row", width: 250, alignItems: "center", justifyContent: "space-evenly"}}>
                <View style={{width: 180}}>
                    <Text>Does this recipe contain sub-recipes or components that require separate lists of ingredients?</Text>
                </View>
                
                <View style={{flexDirection: "row"}}>
                    <View style={{flexDirection: "row", marginHorizontal: 10}}>
                        <Text style={{marginRight: 10}}>no</Text>
                        <Fontisto 
                            name="checkbox-passive" 
                            size={24} 
                            color={toggleNo ? colors.textPrimary600 : "black"} 
                            style={{
                                backgroundColor: toggleNo ? colors.textPrimary600 : "white",
                                borderColor: "black",
                            }}
                            onPress={pressNo} 
                        />
                    </View>
                    <View style={{flexDirection: "row", marginHorizontal: 10}}>
                        <Text style={{marginRight: 10}}>yes</Text>
                        <Fontisto 
                            name="checkbox-passive" 
                            size={24} 
                            color={toggleYes ? colors.textPrimary600 : "black"}
                            style={{
                                backgroundColor: toggleYes? colors.textPrimary600 : "white",
                                borderColor: "black",
                            }}
                            onPress={pressYes} 
                        />
                    </View>
                </View>
            </View>

            {/* render single or multi-ingredient list depending on user selection */}
            {
                toggleYes ? (
                    <MultipleIngredientsList></MultipleIngredientsList>
                ) : (
                    <SingleIngredientList></SingleIngredientList>
                )
            }
            
            {/* navigation buttons */}
            <View style={styles.buttonNavContainer}>
                <View>
                    <CustomButton  value="Go back" width={100} onButtonPress={goBack}></CustomButton>
                </View>
                <View>
                    <CustomButton  value="Continue" width={100} onButtonPress={continueToCookingDirections}></CustomButton>
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
        // alignItems: "center",
        // justifyContent: "center",
        paddingHorizontal: 40,
    },

    ingredientsLabel: {
        color: colors.primaryAccent500,
        fontWeight: 500,
        fontSize: 25,
        marginBottom: 20,
        textDecorationStyle: "dashed",
        textDecorationLine: "underline",
        textAlign: "center",
        // paddingHorizontal: 40,
    },

    buttonNavContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    }
});