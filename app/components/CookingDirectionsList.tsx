import { useContext, useState } from "react";
import { StyleSheet, Text, View, } from "react-native";

//import context
import { RecipeContext } from "@/context/RecipeContext";

// import component(s)
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomButton from "./CustomButton";
import FormInput from "./FormInput";

// define types
type CookingDirections = {
    cookingDirections: string[];
};

const CookingDirectionsList = ({cookingDirections}: CookingDirections) => {
    const {setCookingDirections} = useContext(RecipeContext);

    const [directionsInput, setDirectionsInput] = useState<string>("");

    // function to add typed cooking instructions to array
    const addCookingInstruction = () => {
        const updatedCookingInstructions = [...cookingDirections, directionsInput];
        setCookingDirections(updatedCookingInstructions);
        setDirectionsInput("");
    };

    return (
        <View>
            {/* text input and button to add cooking directions to the list */}
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
                cookingDirections.map((cookingDirection, index) => (<Text key={index}>{cookingDirection}</Text>))
            }
        </View>
    )
};

export default CookingDirectionsList;

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

});