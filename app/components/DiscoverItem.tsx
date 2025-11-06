import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View, } from "react-native";
import colors from "../constants/colors";

// import type(s)
import { RecipeData } from "@/types/Recipe";
type Recipe = {
    recipeData: RecipeData
};

const DiscoverItem = ({recipeData}: Recipe) => {
    const router = useRouter();
    const {nameOfDish, difficultyLevel, timeToCook, imageUrl} = recipeData;

    const _id = recipeData._id

    const navigateToRecipeScreen = () => {
        router.push({
            pathname: "/RecipeScreen",
            params: {
                _id,
            }
        });
    };

    return (
        <View style={styles.card}>
            <Pressable 
                style={({pressed}) => [styles.pressable, pressed && styles.cardPressed]}
                android_ripple={{color: "rgba(0,0,0,0.1)"}}
                onPress={navigateToRecipeScreen}
            >
            <View style={styles.imageContainer}>
                <Image source={{uri: imageUrl}} style={styles.image}></Image>

                <View style={styles.textContainer}>
                    <Text style={styles.textBubble}>{timeToCook}</Text>
                    <Text style={styles.textBubble}>{difficultyLevel}</Text>
                </View>      
            </View>

            <View style={{width: "100%"}}>
                <Text style={styles.title}>{nameOfDish}</Text>   
            </View>

        </Pressable>
        </View>

    );
};

export default DiscoverItem;

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 14,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: {width: 2, height: 10,},
        overflow: "hidden",
        backgroundColor: "white",
    },

    pressable: {
        borderRadius: 14,
        overflow: "hidden",
    },

    cardPressed: {
        opacity: 0.9,
        transform: [{scale: 0.995}],
    },

    image: {
        objectFit: "cover",
        width: "100%",
        aspectRatio: 1,
        backgroundColor: "#F3F4F6",
    },

    imageContainer: {
        position: "relative",
        width: "100%",
    },

    textContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        top: 8,
        left: 8,
        right: 8,
        gap: 8
    },

    textBubble: {
        color: "white",
        backgroundColor: "rgba(0,0,0,0.6)",
        overflow: "hidden",
        fontSize: 12,
        fontWeight: "600",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 12,
    },

    title: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.primaryAccent000,
        padding: 10,
        width: "100%",
    }
});