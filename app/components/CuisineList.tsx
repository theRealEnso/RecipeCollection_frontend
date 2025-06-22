import { FlatList, StyleSheet, View, } from "react-native";

import CategoryTile from "./CategoryTile";

import { Cuisine } from "@/api/categories";

type CategoriesData = {
    categoriesData: Cuisine[];
};

const CuisineList = ({categoriesData}: CategoriesData) => {
    return (
        <FlatList
            data={categoriesData}
            numColumns={2}
            renderItem={({item}) => (
                <View style={styles.grid}>
                    <CategoryTile cuisineData={item}></CategoryTile>
                </View>
            )} //renderItem gets called for every array element, represented as an object containing metadata. The `item` property inside this object contains the actual data that we need
            keyExtractor={(item) => {
                return item._id;
            }}
        >
        </FlatList>
    );
};

export default CuisineList;

const styles = StyleSheet.create({
    grid: {
        padding: 10,
        justifyContent: "space-between",
    }
});