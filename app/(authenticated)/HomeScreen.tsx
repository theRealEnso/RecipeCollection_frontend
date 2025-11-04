import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//import context
import { RecipeContext } from "@/context/RecipeContext";
import { UserContext } from "@/context/UserContext";

//import components(s)
import CuisineList from "../components/CuisineList";
import CustomButton from "../components/CustomButton";
import SearchedRecipesList from "../components/SearchedRecipesList";

//import Modal component(s)
import AddCategoryModal from "../components/modals/category/AddCategoryModal";

//import api function to fetch categories of cuisines belonging to the user
import { getAllCategories, } from "@/api/categories";
import { getUserSearchedRecipes } from "@/api/recipes";
import { useQuery } from "@tanstack/react-query";

// import icons
import Feather from '@expo/vector-icons/Feather';

import colors from "../constants/colors";


// define debounce function (helper)
const debounce = <T,>(func: (value: T) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (value: T) => { // the returned debounced function that wraps the original function that was passed in and accepts the original arguments. Not executed yet
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            //func and delay are "remembered" here due to closures
            func(value);
        }, delay)
    };
};

// writing another function / custom hook that returns a debounced input
const useDebouncedInput = <T,>(
    value: T, 
    delay: number, 
    debounceFn: <X,>(func: (value: X) => void, delay: number) => (value: X) => void,
    ) => {
    const [debouncedInput, setDebouncedInput] = useState<T>(value) //  debouncedInput === searchInput
    
    // our function that debounces the searchInput
    const debouncedSetter = useCallback(debounceFn((value: T) => {
        setDebouncedInput(value);
    }, delay), [delay, debounceFn]);

    useEffect(() => {
        debouncedSetter(value);
    }, [value, debouncedSetter]);

    // return a debounced input
    return debouncedInput;
};

const HomeScreen = () => {
    const router = useRouter();
    const {currentUser, handleSetUser, handleSetTokens, accessToken,} = useContext(UserContext);
    const userId = currentUser ? currentUser.id : null;

    const { resetRecipeState, } = useContext(RecipeContext);

    const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");

    const debouncedSearchInput = useDebouncedInput(searchInput, 500, debounce);
   
    //to fetch user categories when signing in
    const {data, isLoading, error} = useQuery({
        queryKey: ["userCategories"],
        queryFn: () => getAllCategories(accessToken),
        enabled: !!userId,
    });

    //to fetch user recipes based on what they search
    const {
        data: searchedRecipesData, 
        isLoading: searchedRecipesIsLoading, 
        error: searchedRecipesError,
    } = useQuery({
        queryKey: ["userSearchRecipes", userId, debouncedSearchInput],
        queryFn: ({signal}) => getUserSearchedRecipes(accessToken, debouncedSearchInput, signal),
        enabled: !!debouncedSearchInput && !!userId,
        // placeholderData: {userRecipes: []},
    });

    const displayAddModal = () => setShowAddCategoryModal(true);

    const handleSearch = (userInput: string) => {
        setSearchInput(userInput);
    };

    const logOut = () => {
        handleSetUser(null);
        handleSetTokens("", "");
        resetRecipeState();
    };

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
                <View style={styles.searchBoxContainer}>
                    {/* icon */}
                    <Feather name="search" size={24} color="black" style={styles.searchIcon} />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={handleSearch}
                        value={searchInput}
                        placeholder="Search recipes..."
                    />
                </View>

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
                            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                                <View style={styles.contentContainer}>
                                    <View style={{paddingHorizontal: 30, marginVertical: 10}}>
                                        <Text>You currently do not have any cuisine categories added. Press the button below to start adding!</Text>
                                    </View>

                                    <View style={{marginVertical: 10}}>
                                        <CustomButton 
                                            width={150} 
                                            value="Add Category"
                                            onButtonPress={displayAddModal}
                                            radius={75}
                                        >
                                        </CustomButton>
                                    </View>
                                </View>

                                <View style={{marginVertical: 10, flex: 1,}}>
                                    <CustomButton 
                                        width={100} 
                                        value="Sign out"
                                        onButtonPress={logOut}
                                        radius={50}
                                        color="#E95C3C"
                                    >
                                    </CustomButton>
                                </View>
                            </View> 
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

    contentContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 10,
    },

    textInput: {
        borderWidth: 2,
        borderColor: colors.primaryAccent000,
        width: 250,
        borderRadius: 20,
        paddingLeft: 35,
    },

    searchBoxContainer: {
        position: "relative",
        marginBottom: 20,
    },

    searchIcon: {
        position: "absolute",
        top: 10,
        left: 10,
    }
});

//  (
//                             <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
//                                 <View style={styles.contentContainer}>
//                                     <View style={{paddingHorizontal: 30, marginVertical: 10}}>
//                                         <Text>You currently do not have any cuisine categories added. Press the button below to start adding!</Text>
//                                     </View>

//                                     <View style={{marginVertical: 10}}>
//                                         <CustomButton 
//                                             width={150} 
//                                             value="Add Category"
//                                             onButtonPress={displayAddModal}
//                                             radius={75}
//                                         >
//                                         </CustomButton>
//                                     </View>
//                                 </View>

//                                 <View style={{marginVertical: 10, flex: 1,}}>
//                                     <CustomButton 
//                                         width={100} 
//                                         value="Sign out"
//                                         onButtonPress={logOut}
//                                         radius={50}
//                                         color="#E95C3C"
//                                     >
//                                     </CustomButton>
//                                 </View>
//                             </View> 
//                         ) 

