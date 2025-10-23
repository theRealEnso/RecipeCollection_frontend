import { useContext, useState } from "react";

import { useRouter } from "expo-router";

// import context(s)
import { RecipeContext } from "@/context/RecipeContext";

import { Image, ScrollView, StyleSheet, Text, View, } from "react-native";

// import component(s)
import CustomButton from "./components/CustomButton";
import SaveGeneratedRecipeModal from "./components/modals/recipes/SaveGeneratedRecipeModal";

// import colors
import colors from "./constants/colors";

// import icon(s)
import AntDesign from '@expo/vector-icons/AntDesign';

// import type(s)
// import { ListName } from "@/types/Recipe";

const RecipeGeneratedScreen = () => {
    const router = useRouter();

    const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

    const {
        nameOfDish,
        difficultyLevel,
        timeToCook,
        numberOfServings,
        specialEquipment,
        ingredientsList,
        cookingInstructions,
        sublistNames,
        subIngredients,
        subInstructions,
        selectedImageUrl,
    } = useContext(RecipeContext);

    return (
        <View style={styles.outerContainer}>
            <ScrollView style={{flexGrow: 1}}>
                <View style={styles.mainContentContainer}>
                    {/* header */} 
                    <View style={{alignItems: "center",}}>
                        <Text style={styles.header}>{nameOfDish}</Text>
                    </View>

                    {/* image container */}
                    <View style={styles.imageContainer}>
                        <Image src={selectedImageUrl} style={styles.image} />
                    </View>

                    {/* quick info container */}
                    <View style={styles.quickInfo}>
                        <View style={styles.infoContainer}>
                            <Text style={styles.quickInfoLabel}>Difficulty</Text>
                            <Text style={styles.quickInfoValue}>{difficultyLevel}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.quickInfoLabel}>Est. cooking time</Text>
                            <Text style={styles.quickInfoValue}>{timeToCook}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.quickInfoLabel}>Serving Size</Text>
                            <Text style={styles.quickInfoValue}>{numberOfServings}</Text>
                        </View>

                    </View>

                    {/* special equipment */}

                    <View style={styles.specialEquipmentContainer}>
                        <Text style={styles.subHeader}>Special Equipment</Text>
                        <Text>
                            {
                                specialEquipment === "" || specialEquipment === "None" ? "None" : specialEquipment
                            }
                        </Text>
                    </View>


                    {/* display dish ingredients */}
                    <View style={styles.ingredientsContainer}>
                        <Text style={styles.subHeader}>Ingredients</Text>
                        {
                            // if we only have a single ingredient list, then just display each ingredient name
                            ingredientsList.length > 0 ? (
                                <View style={styles.ingredientsContainer}>
                                    {
                                        ingredientsList.map((ingredient) => {
                                            return (
                                                <View key={ingredient.ingredient_id} style={styles.ingredientItem}>
                                                    <View style={{paddingHorizontal: 5}}>
                                                        <AntDesign name="star" size={8} color="black" /> 
                                                    </View>
                                                    <View style={{paddingHorizontal: 5}}>
                                                        <Text style={{fontSize: 16}}>{ingredient.nameOfIngredient}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>

                            ) : (
                                //however, if our recipe contains sub-ingredients, then display sublist with their respective ingredients
                                <View>
                                    {
                                        sublistNames.map((sublist) => {
                                            const filteredIngredients = subIngredients.filter((ingredient) => ingredient.sublistName === sublist.name);

                                            return (
                                                <View key={sublist.id} style={{maxWidth: "70%", marginVertical: 10,}}>
                                                    <View style={{marginBottom: 10, alignItems: "center",}}>
                                                        <Text style={styles.sublistHeader}>{sublist.name}</Text>
                                                    </View>
                                                    <View>
                                                        {
                                                            filteredIngredients.length > 0 ? (
                                                                filteredIngredients.map((ingredient) => {
                                                                    return (
                                                                        <View 
                                                                            key={ingredient.ingredient_id} 
                                                                            style={styles.ingredientItem}
                                                                        >
                                                                            <View style={{paddingHorizontal: 2}}> 
                                                                                <AntDesign name="star" size={8} color="black" />
                                                                            </View>

                                                                            <View style={{paddingHorizontal: 2}}>
                                                                                <Text style={{fontSize: 16,}}>{ingredient.nameOfIngredient}</Text>
                                                                            </View>
                                                                            
                                                                        </View>
                                                                    )
                                                                })
                                                            ) : (
                                                                <Text>No ingredients for this section</Text>
                                                            )
                                                        }
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>

                            )    
                        }
                    </View>

                    {/* display cooking and prep instructions */}
                    <View style={styles.instructionContainer}>
                        <View>
                            <Text style={styles.subHeader}>Cooking Instructions</Text>
                        </View>
                        

                        <View>
                            {/* for single instruction lists, just render each instruction */}
                            {
                                cookingInstructions.length > 0 ? (
                                    <View>
                                        {
                                        cookingInstructions.map((instruction) => {
                                            return (
                                                <View key={instruction.instruction_id} style={styles.instructionItem}>
                                                    <View style={{paddingHorizontal: 5}}>
                                                        <AntDesign name="star" size={8} color="black" />
                                                    </View>
                                                    <View style={{paddingHorizontal: 5}}>
                                                        <Text>{instruction.instruction}</Text>
                                                    </View>
                                                    
                                                </View>
                                            )
                                        })
                                        } 
                                    </View>
                                ): (
                                    <View>
                                        {
                                            sublistNames.map((sublist) => {
                                            const filteredInstructions = subInstructions.filter((instruction) => instruction.sublistName === sublist.name);

                                            return (
                                                <View key={sublist.id} style={styles.sublistContainer}>
                                                    <View>
                                                        <Text style={styles.sublistHeader}>{sublist.name}</Text>
                                                    </View>
                                                    <View>
                                                        {filteredInstructions.map((instruction) => {
                                                            return (
                                                                <View key={instruction.instruction_id} style={styles.instructionItem}>
                                                                    <View style={{paddingHorizontal: 5}}>
                                                                        <AntDesign name="star" size={8} color="black" />
                                                                    </View>
                                                                    <View style={{maxWidth: "95%", paddingHorizontal: 5}}>
                                                                        <Text style={{fontSize: 16}}>{instruction.instruction}</Text>
                                                                    </View>
                                                                </View>
                                                            )
                                                        })}
                                                    </View>
                                                </View>
                                            )
                                            })  
                                        }
                                    </View>
                                )
                            }

                            {/* however, for instructions tied specifically to each sub list or sub component, then group them together */}
                        </View>

                        
                    </View>
                </View>

                {/* display save modal */}
                {
                    showSaveModal && <SaveGeneratedRecipeModal setShowSaveModal={setShowSaveModal}></SaveGeneratedRecipeModal>
                }
            </ScrollView>

            {/* buttons */}
            <View style={styles.buttonsContainer}>
                <View style={styles.buttons}>
                    <CustomButton
                        value="Go back"
                        width={100}
                        onButtonPress={() => router.back()}
                    >
                    </CustomButton>
                </View>
                <View style={styles.buttons}>
                    <CustomButton
                        value="Save Recipe"
                        width={100}
                        onButtonPress={() => setShowSaveModal(true)}
                    >
                    </CustomButton>
                </View>
            </View>
        </View>
    );
};

export default RecipeGeneratedScreen;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
    },

    mainContentContainer: {
        flex: 1,
        paddingVertical: 50,
        alignItems: "center",
        // justifyContent: "center",
    },

    imageContainer: {
        height: 350,
        width: 350,
        borderRadius: 50,
        overflow: "hidden",
        marginVertical: 20,
        elevation: 12,
        // alignItems: "center",
        // justifyContent: "center",
    },

    image: {
        height: 350,
        width: 350,
        objectFit: "cover",
        // alignItems: "center",
        // justifyContent: "center",
    },

    quickInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginVertical: 20,
        paddingHorizontal: 10,
        // maxWidth: "85%",
    },

    infoContainer: {
        paddingHorizontal: 25,
        alignItems: "center",
        borderRightWidth: 2,
        borderColor: colors.primaryAccent500
    },

    quickInfoLabel: {
        color: colors.primaryAccent500,
        fontSize: 16,
        fontWeight: "bold",
        flexShrink: 1,
        textAlign: "center",
        flexWrap: "wrap",
    },

    quickInfoValue: {
        textAlign: "center",
        flexWrap: "wrap",
        marginTop: 10,
    },

    header: {
        fontSize: 30,
        color: colors.primaryAccent900,
        fontWeight: "bold",
        marginVertical: 20,
    },

    subHeader: {
        fontSize: 32,
        color: colors.primaryAccent600,
        fontWeight: "bold",
        alignItems: "center",
    },

    specialEquipmentContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },

    ingredientsContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },

    sublistContainer: {
        alignItems: "center",
        marginVertical: 15,
    },

    sublistHeader: {
        color: colors.primaryAccent900,
        fontSize: 20,
        fontWeight: "bold",
        textDecorationLine: "underline",
    },

    ingredientItem: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
        paddingHorizontal: 5,
    },

    instructionContainer: {
        alignItems: "center",
        justifyContent: "center",
    },

    instructionItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 10,
        width: "90%",
    },

    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingVertical: 20,
        // marginVertical: 20,
    },

    buttons: {
        marginHorizontal: 30,
        marginVertical: 20,
    }
});