import { useLocalSearchParams, useRouter } from "expo-router";

import { Button, StyleSheet, Text, View } from "react-native";

//import component(s)
import CustomButton from "./components/CustomButton";

import colors from "./constants/colors";

const RecipesOverview = () => {

    const { categoryId, categoryName } = useLocalSearchParams();

    const router = useRouter(); 

    const returnToHomeScreen = () => {
        router.replace("/HomeScreen");
    };

    const navigateToAddRecipe = () => {
        router.replace("/AddRecipeScreen");
    }

    // const displayForm = () => {
    //     setShowForm(true);
    // }

    return (
        <View style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>All recipes inside of your <Text>{categoryName}</Text> food collection</Text>
                </View>
                
                <View style={styles.buttonContainer}>
                    <CustomButton value="Add a recipe!" width={100} onButtonPress={navigateToAddRecipe}></CustomButton>
                </View>
                
            </View>

            <Button title="Go back" onPress={returnToHomeScreen}></Button>
        </View>
    )
};

export default RecipesOverview;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 50,
    },

    mainContent: {
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center"
    },

    headerContainer: {
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 20,
    },

    header: {
        color: colors.primaryAccent500,
        fontWeight: "600",
        fontSize: 30,
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 50,
    }
});