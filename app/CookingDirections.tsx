// import axios from "axios";
import { useContext } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";
import { UserContext } from "@/context/UserContext";

import { createCloudinaryURL, createNewRecipe } from "@/api/recipes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// import component(s)
import CookingDirectionsList from "./components/CookingDirectionsList";
import CustomButton from "./components/CustomButton";
import Subdirections from "./components/Subdirections";

//import icons
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

// import colors
import colors from "./constants/colors";

// //environment variables
// const cloudinary_name = process.env.EXPO_PUBLIC_CLOUDINARY_API_NAME;
// const cloudinary_key = process.env.EXPO_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET_NAME;


//UI needs to be dynamic.
//If there are multiple lists for sub recipes, then this screen needs to display cooking and/or preparation directions for each sub list
//so, map through sublistNames array and display UI to add cooking / prep directions for each sublist name
//if no sublist name exists, then just display UI to add cooking / prep directions for the single ingredient list
const CookingDirections = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { accessToken } = useContext(UserContext);
    const {
        sublistNames,
        categoryName,
        categoryId,
        recipeOwner,
        nameOfDish,
        difficultyLevel,
        timeToCook,
        numberOfServings,
        specialEquipment,
        selectedImageUri,
        base64Url,
        ingredientsList,
        subIngredients,
        cookingDirections,
        subDirections,
        resetRecipeState
    } = useContext(RecipeContext);

    let recipeData = {
        categoryName,
        categoryId,
        recipeOwner,
        nameOfDish,
        difficultyLevel,
        timeToCook,
        numberOfServings,
        specialEquipment,
        imageUri: selectedImageUri,
        ingredients: ingredientsList,
        subIngredients,
        cookingDirections,
        subDirections,
    };

    const createNewRecipeMutation = useMutation({
        mutationFn: createNewRecipe,
        onSuccess: (data) => {
            if(data){
                console.log(data);
                resetRecipeState(); // clear recipe form 
                queryClient.invalidateQueries({queryKey: ["categoryRecipes"]}); // force refetch of recipes to display updated list
                router.push({
                    pathname: "/RecipesOverview",
                    params: {
                        categoryName,
                        categoryId,
                    }
                });
            }
        },
        onError: (error) => {
            console.error(error);
        }
    });

    const createCloudinaryUrlMutation = useMutation({
        mutationFn: ({accessToken, base64Url}: {accessToken: string, base64Url: string}) => createCloudinaryURL({accessToken, base64Url}),
        onSuccess: (data) => {
            if(data?.imageUrl){
                console.log(data);
                createNewRecipeMutation.mutate({
                    accessToken,
                    recipeData: {
                        ...recipeData,
                        imageUri: data.imageUrl,
                    }
                })
            }
        },
        onError: (error) => {
            console.error(error);
        },
    })

    // // function to upload user selected image to cloudinary. Returns back an object containing data about the uploaded image
    // const uploadImageToCloudinary = async () => {
    //     try {
    //         const formData = new FormData();
    //         formData.append("upload_preset", cloudinary_key as string);
    //         formData.append("file", {
    //             uri: selectedImageUri,
    //             type: selectedImageType,
    //             name: selectedImageName,
    //         } as any);

    //         const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${cloudinary_name}/image/upload`, formData, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //             }
    //         });

    //         return data;
    //     } catch(error){
    //         console.error(error);
    //         throw error;
    //     }
    // };

    const handleCreateRecipe = async () => {
        try {
            if(selectedImageUri && selectedImageUri.length > 0){
                // const uploadedImage = await uploadImageToCloudinary();
                // const cloudinaryImageUrl = uploadedImage?.secure_url;
                console.log("Sending base64 length:", base64Url?.length);


                createCloudinaryUrlMutation.mutate({
                    accessToken,
                    base64Url
                });

                // createNewRecipeMutation.mutate({
                //     accessToken,
                //     recipeData: {
                //         ...recipeData, 
                //         imageUri: cloudinaryImageUrl,
                //     },
                // });
            } else {
                createNewRecipeMutation.mutate({
                    accessToken,
                    recipeData: {
                        ...recipeData,
                        imageUri: process.env.default_image as string,
                    }
                })
            }
        } catch(error){
            console.error("Error creating recipe: ", error)
        }
    };

    const goBack = () => router.back();

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Cooking Directions</Text>
            </View>

            {
                sublistNames.length > 0 ? (
                <View style={{padding: 20,}}>
                    <View style={styles.tipsContainer}>
                        <View style={{marginRight: 5,}}>
                            <Text style={styles.tipsHeader}>Tips</Text>
                        </View>
                        <View style={{marginRight: 5,}}>
                            <FontAwesome5 name="lightbulb" size={24} color="black" />
                        </View>
                    </View>
                        <Text style={styles.tips}>{`* Swipe left or right on the screen to move between lists of directions for each of your individual sub recipes`}</Text>
                        <Text style={styles.tips}>{`* Tap on individual direction items to make edits to that direction `}</Text>
                    </View>
                ) : null
            }

            <View style={styles.sublistContainer}>
                {
                    sublistNames && 
                        sublistNames.length > 0 ?
                            (
                                <FlatList
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    pagingEnabled={true}
                                    data={sublistNames}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({item}) => (
                                        <Subdirections name={item.name} key={item.id} id={item.id}></Subdirections>
                                    )}
                                    // to add gap between each sublist
                                    ItemSeparatorComponent={() => (
                                        <View style={{width: 10}}></View>
                                    )}
                                >
                                </FlatList>
                            ) : (
                                <CookingDirectionsList cookingDirections={cookingDirections}></CookingDirectionsList>
                            )
                }

                {
                    sublistNames.length > 0 && (
                        <View style={styles.arrowContainer}>
                            <Entypo name="arrow-long-left" size={50} color={colors.primaryAccent900} />
                            <Text style={{fontSize: 24, fontWeight: "bold", color: colors.primaryAccent900}}>Swipe</Text>
                            <Entypo name="arrow-long-right" size={50} color={colors.primaryAccent900} />
                        </View>
                    )
                }
            </View>


            {/* navigation buttons */}
            <View style={styles.buttonNavContainer}>
                <View style={{marginHorizontal: 20}}>
                    <CustomButton  value="Go back" width={100} onButtonPress={goBack}></CustomButton>
                </View>
                <View style={{marginHorizontal: 20}}>
                    <CustomButton  value="Create Recipe" width={100} onButtonPress={handleCreateRecipe}></CustomButton>
                </View>
            </View>
        </View>
    )
};

export default CookingDirections;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 70,
    },

    headerContainer: {
        // marginBottom: 5,
    },

    header: {
        color: colors.primaryAccent500,
        fontWeight: "bold",
        fontSize: 30,
    },

    tipsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    tipsHeader: {
        fontSize: 16,
        color: colors.primaryAccent600,
        fontWeight: "bold",
    },

    tips: {
        fontSize: 16,
        marginVertical: 5,
    },

    buttonNavContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        // flex: 1,
        marginBottom: 20,
    },

    sublistContainer: {
        flex: 12,
    },

    arrowContainer: {
        marginBottom: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
  },
});