import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

// import component(s)
import CookingDirectionsList from "./components/CookingDirectionsList";
import CustomButton from "./components/CustomButton";
import Subdirections from "./components/Subdirections";

// import colors
import colors from "./constants/colors";


//UI needs to be dynamic.
//If there are multiple lists for sub recipes, then this screen needs to display cooking and/or preparation directions for each sub list
//so, map through sublistNames array and display UI to add cooking / prep directions for each sublist name
//if no sublist name exists, then just display UI to add cooking / prep directions for the single ingredient list
const CookingDirections = () => {
    const {cookingDirections, sublistNames} = useContext(RecipeContext);

    const router = useRouter();

    const goBack = () => router.back();

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Cooking Directions</Text>
            </View>

            {
                sublistNames && 
                    sublistNames.length > 0 ?
                        (
                            sublistNames.map((sublistName) => (<Subdirections name={sublistName.name} key={sublistName.id} id={sublistName.id}></Subdirections>))
                        ) : (
                            <CookingDirectionsList cookingDirections={cookingDirections}></CookingDirectionsList>
                        )
            }

            {/* navigation buttons */}
            <View style={styles.buttonNavContainer}>
                <View style={{marginHorizontal: 20}}>
                    <CustomButton  value="Go back" width={100} onButtonPress={goBack}></CustomButton>
                </View>
                <View style={{marginHorizontal: 20}}>
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
        marginTop: 70,
    },

    headerContainer: {
        marginBottom: 10,
    },

    header: {
        color: colors.primaryAccent500,
        fontWeight: "bold",
        fontSize: 30,
    },

    buttonNavContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
    },
})