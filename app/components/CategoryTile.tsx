import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";

// import context
// import component(s)
import CustomButton from "./CustomButton";

import Ionicons from "@expo/vector-icons/Ionicons";


import { LinearGradient } from "expo-linear-gradient";

// import types
import { Cuisine } from "@/types/Category";
import AntDesign from '@expo/vector-icons/AntDesign';

type CuisineCategoryProps = {
    cuisineData: Cuisine,
    onLongPress: (id: string, categoryName: string) => void;
    isSelected: boolean;
    setShowWarningModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const CategoryTile = ({cuisineData, onLongPress, isSelected, setShowWarningModal, setShowEditModal}: CuisineCategoryProps) => {
    const router = useRouter();
    const [tileId, setTileId] = useState<string | null>(null);
    // const { tileId, setTileId } = useContext(RecipeContext);

    const categoryId = cuisineData._id;
    const categoryName = cuisineData.cuisineName;

    useEffect(() => {
        if(tileId){
            router.push({
                pathname: "/RecipesOverviewScreen",
                params: {
                    categoryId,
                    categoryName,
                }
            });
        }
    }, [tileId, categoryId, categoryName, router]);

    const displayWarning = () => {
        setShowWarningModal(true);
    };

    const displayEdit = () => {
        setShowEditModal(true);
    };

    return (
        <View style={styles.tileOuterContainer}>
            <View style={styles.tileInnerContainer}>
                <Pressable 
                    style={({pressed}) => [styles.pressable, pressed && styles.pressed]}
                    android_ripple={{color: "rgba(0,0,0,0.1)", foreground: true}}
                    onLongPress={() => onLongPress(cuisineData._id, cuisineData.cuisineName)}
                    delayLongPress={1000}
                    onPress={() => setTileId(categoryId)}
                >
                    <ImageBackground
                        source={{uri: cuisineData.cuisineImage}}
                        resizeMode="cover"
                        style={styles.image}
                        imageStyle={{borderRadius: 14}}
                    >
                        <LinearGradient
                            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.6)"]}
                            style={styles.gradientOverlay}
                        ></LinearGradient>

                        <Text style={styles.tileText}>{cuisineData.cuisineName}</Text>
                    </ImageBackground>
                </Pressable>

                {
                    isSelected && (
                        <View style={styles.buttonOuterContainer}>
                            <View style={styles.buttonInnerContainer}>
                                <CustomButton
                                    value={<AntDesign name="edit" size={24}></AntDesign>}
                                    width={40}
                                    onButtonPress={displayEdit}
                                >
                                </CustomButton>
                                <CustomButton
                                    value={<Ionicons name="trash" size={24}></Ionicons>}
                                    width={40}
                                    onButtonPress={displayWarning}
                                >
                                </CustomButton>
                            </View>
                        </View>
                    )
                }
            </View>
        </View>
    )
};

export default CategoryTile;

const styles = StyleSheet.create({
    tileOuterContainer: {
        margin: 10,
        overflow: "hidden",
        borderRadius: 14,
        position: "relative",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        backgroundColor: "white",
    },

    tileInnerContainer: {
        borderRadius: 14,
        overflow: "hidden",
    },

    pressable: {
        borderRadius: 14
    },

    pressed: {
        opacity: 0.9,
        transform: [{scale: 0.995}]
    },

    image: {
        padding: 20,
        width: 150,
        height: 150,
        alignItems: "center",
        justifyContent: "center",
    },

    tileText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,

    },

    buttonOuterContainer: {
        borderRadius: 12,
        position: "absolute",
        right: 5,
        top: 5,
        // backgroundColor: "black"
    },

    buttonInnerContainer: {
        flexDirection: "row"
    },

    gradientOverlay: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    }
});