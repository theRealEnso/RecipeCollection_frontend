import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

// import component(s)
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CookingDirectionsList from "./components/CookingDirectionsList";
import CustomButton from "./components/CustomButton";
import FormInput from "./components/FormInput";

// import colors
import colors from "./constants/colors";

const CookingDirections = () => {
    const {cookingDirections, setCookingDirections} = useContext(RecipeContext);

    const [directionsInput, setDirectionsInput] = useState<string>("");

    // function to add typed cooking instructions to array
    const addCookingInstruction = () => {
        const updatedCookingInstructions = [...cookingDirections, directionsInput];
        setCookingDirections(updatedCookingInstructions);
        setDirectionsInput("");
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Cooking Directions</Text>
            </View>

            <View style={styles.inputContainer}>
                <View style={{marginHorizontal: 5}}>
                    <FormInput 
                        placeholder="Enter step-by-step cooking instructions" 
                        value={directionsInput} 
                        width={280}
                        onChangeText={(typedValue) => setDirectionsInput(typedValue)}
                    >
                    </FormInput>
                </View>

                <View style={{marginHorizontal: 5}}>
                    <CustomButton
                        value={<MaterialIcons name="add-task" size={24} color="black" />}
                        width={40}
                        radius={25}
                        onButtonPress={addCookingInstruction}
                    >
                    </CustomButton>
                </View>
            </View>

            {
                cookingDirections && 
                    cookingDirections.length > 0 &&
                        (
                            <CookingDirectionsList cookingDirections={cookingDirections}></CookingDirectionsList>
                        )
            }

            <View style={styles.buttonNavContainer}>
                <View>
                    <CustomButton  value="Go back" width={100}></CustomButton>
                </View>
                <View>
                    <CustomButton  value="Continue" width={100}></CustomButton>
                </View>
            </View>
        </View>
    )
};

export default CookingDirections;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        // justifyContent: "center",
        marginTop: 100,
    },

    headerContainer: {
        marginBottom: 10,
    },

    header: {
        color: colors.primaryAccent500,
        fontWeight: "bold",
        fontSize: 30,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    buttonNavContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
})