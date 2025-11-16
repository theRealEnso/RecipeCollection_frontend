import { useContext } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { RecipeContext } from "@/context/RecipeContext";

// import icons
import Feather from '@expo/vector-icons/Feather';

// import colors
import colors from "../constants/colors";

const SearchRecipesInput = () => {
    const { searchRecipesInput, setSearchRecipesInput } = useContext(RecipeContext);

    const handleSearch = (userInput: string) => {
        setSearchRecipesInput(userInput);
    };

    return (
        <View style={styles.searchBoxContainer}>

            {/* icon */}
            <Feather name="search" size={24} color={colors.primaryAccent700} style={styles.searchIcon} />
            <TextInput
                style={styles.textInput}
                onChangeText={handleSearch}
                value={searchRecipesInput}
                placeholder="Search recipes..."
                placeholderTextColor={colors.secondaryAccent900}
            />
        </View>
    )
};

export default SearchRecipesInput;

const styles = StyleSheet.create({
    searchBoxContainer: {
        position: "relative",
        marginBottom: 20,
        // alignItems: "center",
        // justifyContent: "center",
    },

    textInput: {
        color: colors.secondaryAccent900,
        borderWidth: 2,
        borderColor: colors.primaryAccent800,
        width: 250,
        borderRadius: 20,
        paddingLeft: 35,
        fontWeight: "bold",
        fontSize: 16,
    },

    searchIcon: {
        position: "absolute",
        top: 10,
        left: 10,
        // alignItems: "center",
        // justifyContent: "center",
    }
})