import { StyleSheet, Text } from "react-native";
// import {BlurView} from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import colors from "../constants/colors";

// import types
import { Cuisine } from "@/api/categories";

type CuisineCategoryProps = {
    cuisineData: Cuisine
};

const CategoryTile = ({cuisineData}: CuisineCategoryProps) => {
    console.log(cuisineData);
    if(!cuisineData) return null;

    return (
        <LinearGradient colors={[colors.primaryAccent500, colors.primaryAccent700]}style={styles.tileContainer}>
            <Text style={styles.tileText}>{cuisineData.cuisineName}</Text>
        </LinearGradient>
    )
};

export default CategoryTile;

const styles = StyleSheet.create({
    tileContainer: {
        width: 120,
        height: 120,
        backgroundColor: colors.primaryAccent500,
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        margin: 10,
    },

    tileText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 10,
    },
});