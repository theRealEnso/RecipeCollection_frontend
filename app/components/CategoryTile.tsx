import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, } from "react-native";

// import component(s)
import CustomButton from "./CustomButton";

import Ionicons from "@expo/vector-icons/Ionicons";

import colors from "../constants/colors";

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

    const categoryId = cuisineData._id;
    const categoryName = cuisineData.cuisineName;

    useEffect(() => {
        if(tileId){
            router.push({
                pathname: "/RecipesOverview",
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
            <Pressable 
                android_ripple={{ color: colors.primaryAccent500 }}
                style={styles.pressable}
                onLongPress={() => onLongPress(cuisineData._id, cuisineData.cuisineName)}
                delayLongPress={1000}
                onPress={() => setTileId(categoryId)}
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
    )
};

export default CategoryTile;

const styles = StyleSheet.create({
    tileOuterContainer: {
        margin: 10,
        overflow: "hidden",
        borderRadius: 10,
        position: "relative",
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

    buttonOuterContainer: {
        borderRadius: 12,
        position: "absolute",
        right: 5,
        top: 5,
        // backgroundColor: "black"
    },

    buttonInnerContainer: {
        flexDirection: "row"
    }
});