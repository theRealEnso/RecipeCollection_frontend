import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

//import components
// import FormInput from "./FormInput";
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from "./CustomButton";

// import colors
import colors from "../constants/colors";

type SublistProps = {
    name: string;
    id: string;
};

const Sublist = ({name, id}: SublistProps) => {
    const [input, setInput] = useState<string>("");
    const [subIngredients, setSubIngredients] = useState<string>("");

    const handleInputChange = (userInput: string) => {
        setInput(userInput);
    };
    
    return (
        <View style={styles.container}>
            <View style={{marginBottom: 10,}}>
                <Text>{`Ingredients for ${name}`}</Text>
            </View>

            <View style={styles.inputContainer}>
                <View>
                    <TextInput 
                        placeholder="Add ingredient" 
                        value={input}
                        onChangeText={(typedValue) => handleInputChange(typedValue) }
                        style={styles.textInputStyles}
                    >
                    </TextInput>
                </View>
                <View>
                    <CustomButton
                        value={<Ionicons name="bag-add" size={24} color="black" />}
                        width={35}
                        color={colors.primaryAccent900}
                    >
                    </CustomButton>
                </View>
            </View>

        </View>
    )
};

export default Sublist;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },

    textInputStyles: {
        borderRadius: 10,
        borderColor: colors.textPrimary600,
        borderWidth: 2,
        padding: 20,
    },

    inputContainer: {
        flexDirection: "row",
    },
});