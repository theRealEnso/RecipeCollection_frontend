import axios from "axios";
import { useContext, } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";
import { UserContext } from "@/context/UserContext";

import { createNewRecipe } from "@/api/recipes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// import component(s)
import CookingInstructionsList from "./components/CookingInstructionsList";
import CustomButton from "./components/CustomButton";
import SubInstructions from "./components/SubInstructions";

//import icons
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

// import colors
import colors from "./constants/colors";

// environment variables
const RECIPE_COLLECTION_ENDPOINT = process.env.EXPO_PUBLIC_RECIPE_COLLECTION_ENDPOINT_3
const RECIPES_ENDPOINT = `${RECIPE_COLLECTION_ENDPOINT}/recipes`;
// const cloudinary_name = process.env.EXPO_PUBLIC_CLOUDINARY_API_NAME;
// const cloudinary_key = process.env.EXPO_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET_NAME;


//UI needs to be dynamic.
//If there are multiple lists for sub recipes, then this screen needs to display cooking and/or preparation instructions for each sub list
//so, map through sublistNames array and display UI to add cooking / prep instructions for each sublist name
//if no sublist name exists, then just display UI to add cooking / prep instructions for the single ingredient list
const CookingInstructionsScreen = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { accessToken } = useContext(UserContext);
    const {
        categoryName,
        categoryId,
        recipeOwner,
        nameOfDish,
        difficultyLevel,
        timeToCook,
        numberOfServings,
        specialEquipment,
        selectedImageUrl,
        base64Url,
        ingredientsList,
        subIngredients,
        cookingInstructions,
        subInstructions,
        sublistNames,
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
        imageUrl: selectedImageUrl,
        ingredients: ingredientsList,
        subIngredients,
        cookingInstructions,
        subInstructions,
        sublists: sublistNames,
    };

    //helper function to upload image + sign preset to cloudinary, ultimately to get a secure_url
    const uploadToCloudinarySigned = async (
        base64Url: string,
        signature: string,
        timestamp: number,
        apikey: string,
        cloudname: string,
        uploadPreset: string,
        folder: string,
    ) => {
        try {
            const formData = new FormData();
            formData.append("file", base64Url);
            formData.append("api_key", apikey);
            formData.append("timestamp", timestamp.toString());
            formData.append("upload_preset", uploadPreset);
            formData.append("signature", signature);
            formData.append("folder", folder)

            const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${cloudname}/image/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });

            return data;
        } catch(error: any){
            if (axios.isAxiosError(error)) {
                console.error("Cloudinary error response:", error.response?.data); // actual message
                console.error("Cloudinary error status:", error.response?.status); // 400
            } else {
                console.error("Unexpected error:", error);
            }

            throw error; // rethrow so React Query / caller can still catch it
        }
    };

    const createNewRecipeWithCloudinaryUrl = useMutation({
        // need to first get signature from api endpoint,
        // then upload the image to cloudinary with the signature to get the secure url,
        // and finally create the recipe with the secure url

        mutationFn: async ({accessToken, base64Url}: {accessToken: string, base64Url: string}) => {
            const { data } = await axios.get(`${RECIPES_ENDPOINT}/get-cloudinary-signature`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const {
                signature,
                timestamp,
                apikey,
                cloudname,
                uploadPreset,
                folder,
            } = data;

            // console.log("Upload preset is:", uploadPreset);

            return await uploadToCloudinarySigned(base64Url, signature, timestamp, apikey, cloudname, uploadPreset, folder);
        },
        onSuccess: (data) => {
            if(data?.secure_url){
                createNewRecipeMutation.mutate({
                    accessToken,
                    recipeData: {
                        ...recipeData,
                        imageUrl: data.secure_url,
                    }
                });

                resetRecipeState();
            }
        },
        onError: (error) => {
            console.error("Cloudinary upload failed:", error)
        },
    });

    const createNewRecipeMutation = useMutation({
        mutationFn: createNewRecipe,
        onSuccess: (data) => {
            if(data){
                console.log(data);
                resetRecipeState(); // clear recipe form 
                queryClient.invalidateQueries({queryKey: ["categoryRecipes"]}); // force refetch of recipes to display updated list
                router.push({
                    pathname: "/RecipesOverviewScreen",
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

    const handleCreateRecipe = async () => {
        try {
            if(selectedImageUrl && selectedImageUrl.length > 0){
                console.log("Sending base64 length:", base64Url?.length);

                createNewRecipeWithCloudinaryUrl.mutate({
                    accessToken,
                    base64Url,
                });
            } else {
                createNewRecipeMutation.mutate({
                    accessToken,
                    recipeData: {
                        ...recipeData,
                        imageUrl: process.env.EXPO_PUBLIC_DEFAULT_RECIPE_IMAGE as string,
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
                <Text style={styles.header}>Cooking Instructions</Text>
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
                        <Text style={styles.tips}>{`* Swipe left or right on the screen to move between lists of instructions for each of your individual sub recipes`}</Text>
                        <Text style={styles.tips}>{`* Tap on individual instruction items to make edits to that instruction `}</Text>
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
                                        <SubInstructions name={item.name} key={item.id} id={item.id}></SubInstructions>
                                    )}
                                    // to add gap between each sublist
                                    ItemSeparatorComponent={() => (
                                        <View style={{width: 5}}></View>
                                    )}
                                    showsVerticalScrollIndicator={false}
                                >
                                </FlatList>
                            ) : (
                                <CookingInstructionsList></CookingInstructionsList>
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
                    <CustomButton 
                        value="Go back" 
                        width={100}
                        radius={50} 
                        onButtonPress={goBack}
                        >
                    </CustomButton>
                </View>
                <View style={{marginHorizontal: 20}}>
                    <CustomButton 
                        value="Create Recipe" 
                        width={120}
                        radius={60} 
                        onButtonPress={handleCreateRecipe}
                        >
                    </CustomButton>
                </View>
            </View>
        </View>
    )
};

export default CookingInstructionsScreen;

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
        marginBottom: 20,
        padding: 5,
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