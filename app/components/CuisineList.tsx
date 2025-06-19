import { FlatList } from "react-native";

import CategoryTile from "./CategoryTile";

import { Cuisine } from "@/api/categories";

type CategoriesData = {
    categoriesData: Cuisine[];
};

const CuisineList = ({categoriesData}: CategoriesData) => {
    return (
        <FlatList
            data={categoriesData}
            renderItem={({item}) => <CategoryTile cuisineData={item}></CategoryTile> } //renderItem gets called for every array element, represented as an object containing metadata. The `item` property inside this object contains the actual data that we need
            keyExtractor={(item) => {
                return item._id;
            }}
        >
        </FlatList>
    );
};

export default CuisineList;