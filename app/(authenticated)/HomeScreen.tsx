import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//import context
import { RecipeContext } from "@/context/RecipeContext";
import { UserContext } from "@/context/UserContext";

//import components(s)
import CuisineList from "../components/CuisineList";
import EmptyCategories from "../components/EmptyCategories";
import SearchedRecipesList from "../components/SearchedRecipesList";
import SearchRecipesInput from "../components/SearchRecipesInput";

//import Modal component(s)
import AddCategoryModal from "../components/modals/category/AddCategoryModal";

//import api function to fetch categories of cuisines belonging to the user
import { getAllCategories, } from "@/api/categories";
import { getUserSearchedRecipes } from "@/api/recipes";
import { useQuery } from "@tanstack/react-query";

// import debounce utility functions
import { debounce, useDebouncedInput } from "@/utils/debounceHelpers";

import colors from "../constants/colors";

const HomeScreen = () => {
    const router = useRouter();
    const { currentUser, accessToken } = useContext(UserContext);
    const userId = currentUser ? currentUser.id : null;

    const { searchRecipesInput } = useContext(RecipeContext);

    const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);

    const debouncedSearchInput = useDebouncedInput(searchRecipesInput, 500, debounce);
   
    //to fetch user categories when signing in
    const {data, isLoading, error} = useQuery({
        queryKey: ["userCategories"],
        queryFn: () => getAllCategories(accessToken),
        enabled: !!userId,
    });

    //to fetch user recipes based on what they search. Feed the debounced input into useQuery
    const {
        data: searchedRecipesData, 
        isLoading: searchedRecipesIsLoading, 
        error: searchedRecipesError,
    } = useQuery({
        queryKey: ["userSearchRecipes", userId, debouncedSearchInput],
        queryFn: ({signal}) => getUserSearchedRecipes(accessToken, debouncedSearchInput, signal),
        enabled: !!debouncedSearchInput && !!userId,
    });

    // useEffect to handle signing out and re-directing to the login screen
    useEffect(() => {
        if(
            (!currentUser || currentUser === null) ||
            (!accessToken || !accessToken.length)
        ){
            router.replace("./LoginScreen");  
        }  
    }, [router, currentUser, accessToken]);

    if(searchedRecipesData){
        console.log(searchedRecipesData.userRecipes);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                {/* display the search bar */}
                {
                    data && (
                        <View style={{alignItems: "center", justifyContent: "center"}}>
                            <SearchRecipesInput></SearchRecipesInput>
                        </View>
                    )
                }

                {/* conditionally render cuisine categories and user search results */}
                {
                    // prioritize user search first
                    !!debouncedSearchInput && !!userId 
                    ? (
                        searchedRecipesIsLoading ? (
                            <ActivityIndicator color={colors.primaryAccent000} size={32} style={{flex: 1}}></ActivityIndicator>
                        ) : searchedRecipesError ? (
                            <Text>Error searching for recipes...</Text>
                        )
                        : searchedRecipesData.userRecipes.length > 0
                        ? (<SearchedRecipesList recipesData={searchedRecipesData.userRecipes}></SearchedRecipesList>)
            
                        : (
                            <View style={{flex: 1}}>
                                <Text>No recipes found...</Text>
                            </View>
                        )  
                    ) 
                    : (
                        // if there's no search happening, then show categories
                        isLoading ? (
                            <ActivityIndicator size="large"></ActivityIndicator>
                        ): error ? (
                            <Text>Error fetching user categories!</Text>
                        ) : data && data.categories && Array.isArray(data.categories) && data.categories.length ? (
                            <View style={{flex: 1}}>
                                <CuisineList categoriesData={data.categories}></CuisineList>
                            </View>
                        ) : (
                            <EmptyCategories setShowAddCategoryModal={setShowAddCategoryModal}></EmptyCategories>
                        )
                    )
                }

                {
                    showAddCategoryModal && (
                        <AddCategoryModal
                            setShowAddCategoryModal={setShowAddCategoryModal}
                        >
                        </AddCategoryModal>
                    )
                }

            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.backgroundPrimary,
    },

    container: {
        backgroundColor: colors.backgroundPrimary,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
});
