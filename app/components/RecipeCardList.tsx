import { FlatList, StyleSheet } from "react-native";

// import component(s)
import RecipeCard from "./RecipeCard";

//import type definition(s)
import { RecipeData } from "@/types/Recipe";


export type RecipeDataProps = RecipeData & { // this type represents the shape of the data for each recipe
    _id: string;
    cuisineCategory: object,
    createdAt: string;
    updatedAt: string;
    __v: number
};

type RecipesData = {
    recipesData : RecipeDataProps[]; // represents an array of recipes obtained from the databse
};

const RecipeCardList = ({recipesData}: RecipesData) => {
    return (
        <FlatList
            data={recipesData}
            keyExtractor={(item) => item._id}
            renderItem={({item}) => (<RecipeCard recipe={item}></RecipeCard>)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
        </FlatList>
    );
};

export default RecipeCardList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        // backgroundColor: "black",
        // marginVertical: 10
    }
});