import { useRouter } from "expo-router";
import { FlatList, Image, Platform, Pressable, StyleSheet, Text, useWindowDimensions } from "react-native";

// import colors
import colors from "../constants/colors";

// import type(s)
import { RecipeData } from "@/types/Recipe";
type RecipesData = {
    recipesData: RecipeData[];
};

const SearchedRecipesList = ({ recipesData }: RecipesData) => {
    const { width: ScreenWidth } = useWindowDimensions();
    const router = useRouter();
    return (
        <FlatList
            style={styles.outerContainer}
            data={recipesData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
                const {_id} = item
                const navigateToRecipeScreen = () => {
                    router.push({
                        pathname: "/RecipeScreen",
                        params: {
                            _id,
                        }
                    })
                };
                return (
                    <Pressable
                        style={[styles.itemContainer, {width: ScreenWidth / 2.25}]}
                        onPress={navigateToRecipeScreen}
                    >
                        <Image src={item.imageUrl} style={styles.image}></Image>
                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 16 }]}>{item.nameOfDish}</Text>
                        <Text style={styles.text}>{`Est: ${item.timeToCook}`}</Text>
                    </Pressable>
                )
            }}
            horizontal={false}
            numColumns={2}
        />     
    )
};

export default SearchedRecipesList;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },

    itemContainer: {
        backgroundColor: colors.primaryAccent500,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        padding: 10,
        margin: 10,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
            },
            android: {
                elevation: 8,
            }
        }),
    },

    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 5,
    },

    text: {
        marginVertical: 5,
        color: "white",
    },
});