import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//import context
import { RecipeContext } from "@/context/RecipeContext";
import { UserContext } from "@/context/UserContext";

//import components(s)
import CuisineList from "../components/CuisineList";
import CustomButton from "../components/CustomButton";

//import Modal component(s)
import AddCategoryModal from "../components/modals/category/AddCategoryModal";

//import api function to fetch categories of cuisines belonging to the user
import { getAllCategories } from "@/api/categories";
import { useQuery } from "@tanstack/react-query";

// import icons

import colors from "../constants/colors";

const HomeScreen = () => {
    const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);

    const {data, isLoading, error} = useQuery({
        queryKey: ["userCategories"],
        queryFn: () => getAllCategories(accessToken),
        // refetchOnMount: "always",
    });

    const router = useRouter();
    const {currentUser, handleSetUser, handleSetTokens, accessToken,} = useContext(UserContext);
    const { resetRecipeState, } = useContext(RecipeContext);

    const displayAddModal = () => setShowAddCategoryModal(true);
    
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

    // if(accessToken) console.log("access token is:", accessToken);
    // if(refreshToken) console.log("refresh token is: ", refreshToken);

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                {
                    isLoading
                        ? <ActivityIndicator size="large"></ActivityIndicator>
                        : error ? <Text>Error fetching user categories!</Text>
                        : data && data.categories && Array.isArray(data.categories) && data.categories.length ? (
                            <View style={{flex: 1}}>
                                <CuisineList categoriesData={data.categories}></CuisineList>
                            </View>
                        )
                        : (
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
        paddingVertical: 50,
    },

    contentContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 10,
    },
});