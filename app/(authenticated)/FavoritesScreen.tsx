import { useContext } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View, } from "react-native";

// import context(s)
import { UserContext } from "@/context/UserContext";

// import component(s)
import DiscoverItem from "../components/DiscoverItem";

import { useQuery } from "@tanstack/react-query";
// import axios helper function(s)
import { getFavoritedRecipes } from "@/api/recipes";
import colors from "../constants/colors";

const FavoritesScreen = () => {
    const { currentUser, accessToken } = useContext(UserContext);
    const userId = currentUser ? currentUser.id : null;

    const {data, isLoading, error,} = useQuery({
        queryKey: ["favoriteRecipes", userId],
        queryFn: () => getFavoritedRecipes(accessToken),
        staleTime: 0,
        gcTime: 0,
    });

    if(isLoading){
        return (
            <View style={[styles.outerContainer, {justifyContent: "center"}]}>
                <Text>Fetching favorite recipes...</Text>
                <ActivityIndicator size={24} color={colors.primaryAccent900}></ActivityIndicator>
            </View>
        );
    };

    if(error){
        return (
            <View style={[styles.outerContainer, {justifyContent: "center"}]}>
                <Text>Error fetching favorite recipes!</Text>
            </View>
        );
    };

    if(data && data.favoriteRecipes?.length){
        return (
            <View style={styles.outerContainer}>
                <FlatList
                    data={data.favoriteRecipes}
                    keyExtractor={(item) => item._id}
                    renderItem={({item}) => {
                        return (
                            <DiscoverItem recipeData={item}></DiscoverItem>
                        )
                    }}
                >

                </FlatList>
            </View>
        )
    };
};

export default FavoritesScreen;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1
    },
});