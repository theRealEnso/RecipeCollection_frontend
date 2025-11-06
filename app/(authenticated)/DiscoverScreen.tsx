import { useContext, useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, useWindowDimensions, View } from "react-native";

// import context(s)
import { UserContext } from "@/context/UserContext";

import { getAllPublicRecipes } from "@/api/recipes";
import { useQuery } from "@tanstack/react-query";

// import component(s)
import DiscoverItem from "../components/DiscoverItem";
import colors from "../constants/colors";

const DiscoverScreen = () => {
    const { width: screenWidth } = useWindowDimensions();

    const { accessToken } = useContext(UserContext);

    const numColumns = useMemo(() => {
        if(screenWidth >= 1024) return 4;

        if(screenWidth >= 768) return 3;
        return 2;
    }, [screenWidth]);

    const {
        data: publicRecipesData, 
        isLoading: publicRecipesIsLoading, 
        error: publicRecipesError
    } = useQuery({
        queryKey: ["publicRecipes"],
        queryFn: () => getAllPublicRecipes(accessToken),
    });

    const recipes = publicRecipesData && publicRecipesData.publicRecipes.length ? publicRecipesData.publicRecipes : [];

    if(publicRecipesIsLoading){
        return (
            <View style={styles.outerContainer}>
                <ActivityIndicator size={32} color={colors.primaryAccent900}></ActivityIndicator>
                <Text>Loading public recipes...</Text>
            </View>
        );
    };

    if(publicRecipesError){
        return (
            <View style={styles.outerContainer}>
                <Text>{`Error loading public recipes: ${publicRecipesError}`}</Text>
            </View>
        )
    };

    return (
        <View style={styles.outerContainer}>
            <FlatList 
                data={recipes}
                keyExtractor={(item) => item._id }
                renderItem={({item}) => {
                    return (
                        <DiscoverItem recipeData={item}></DiscoverItem>
                    )
                }}
                horizontal={false}
                numColumns={numColumns}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={numColumns > 1 ? styles.rowGap : undefined}
                showsVerticalScrollIndicator={false}
            />
        </View>

    );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },

    listContent: {
        paddingHorizontal: 15,
        rowGap: 10,

    },

    rowGap: {
        columnGap: 10,
    }
});