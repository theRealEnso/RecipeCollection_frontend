import { useState } from "react";

import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native";

//import component(s)
import CategoryTile from "./CategoryTile";

import { Cuisine } from "@/api/categories";

type CategoriesData = {
    categoriesData: Cuisine[];
};

const CuisineList = ({categoriesData}: CategoriesData) => {
    const [selectedTileId, setSelectedTileId] = useState<string | null>(null);

    const handleLongPress = (id: string) => {
        setSelectedTileId((previous) => previous === id ? null : id);
    };

    console.log(selectedTileId);

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.listContainer}
        >
            <Pressable onPress={() => setSelectedTileId(null)} style={styles.pressable}>
                <FlatList
                    data={categoriesData}
                    numColumns={2}
                    renderItem={({item}) => (
                        <View style={styles.grid}>
                            <CategoryTile 
                                cuisineData={item} 
                                onLongPress={handleLongPress}
                                isSelected={item._id === selectedTileId}
                            >
                            </CategoryTile>
                        </View>
                    )} //renderItem gets called for every array element, represented as an object containing metadata. The `item` property inside this object contains the actual data that we need, which is each element inside of our categories array
                    keyExtractor={(item) => {
                        return item._id;
                    }}
                >
                </FlatList>
            </Pressable>
        </KeyboardAvoidingView>
    );
};

export default CuisineList;

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
    }, 

    pressable: {
        flex: 1,
        marginVertical: 60,
    },

    grid: {
        padding: 10,
        justifyContent: "space-between",
    },

    buttonOuterContainer: {
        borderRadius: 12,
    }
});