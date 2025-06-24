import { Pressable, StyleSheet, Text, View } from "react-native";
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
        <View style={styles.tileOuterContainer}>
            <Pressable 
                android_ripple={{ color: colors.primaryAccent500 }}
                style={styles.pressable}
            >
                {({ pressed }) => (
                    <LinearGradient
                        colors={[colors.primaryAccent500, colors.primaryAccent700]}
                        style={[styles.tileInnerContainer, pressed && styles.pressed]}
                    >
                        <Text style={styles.tileText}>{cuisineData.cuisineName}</Text>
                    </LinearGradient>
                )}
            </Pressable>
        </View>
    )
};

export default CategoryTile;

const styles = StyleSheet.create({
    tileOuterContainer: {
        margin: 10,
        overflow: "hidden",
        borderRadius: 10,
    },

    pressable: {
        borderRadius: 10,
    },

    tileInnerContainer: {
        backgroundColor: colors.primaryAccent500,
        padding: 20,
        width: 150,
        height: 150,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderColor: colors.primaryAccent500,
        borderWidth: 1
    },

    tileText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 10,
    },

    pressed: {
        opacity: 0.75,
        transform: [{ scale: 0.98 }],
    },
});