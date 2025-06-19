import { StyleSheet, Text, View } from "react-native";

// import types
import { Cuisine } from "@/api/categories";

type CuisineCategoryProps = {
    cuisineData: Cuisine
};

const CategoryTile = ({cuisineData}: CuisineCategoryProps) => {
    console.log(cuisineData);
    if(!cuisineData) return null;

    return (
        <View style={styles.tileContainer}>
            <Text style={styles.textColor}>{cuisineData.cuisineName}</Text>
        </View>
    )
};

export default CategoryTile;

const styles = StyleSheet.create({
    tileContainer: {
        width: 100,
        height: 100,
    },

    textColor: {
        color: "red"
    },
})