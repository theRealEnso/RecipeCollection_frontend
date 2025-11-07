import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

// import { useRouter } from "expo-router";

// import colors
import colors from "./constants/colors";

// import icon(s)
import AntDesign from '@expo/vector-icons/AntDesign';

// import component(s)

//import type(s)
import { CookingInstructions, Ingredient, ListName, RecipeSubInstructions, SubIngredient } from "@/types/Recipe";

type RecipeDetailsProps = {
    recipeOwner: string;
    nameOfDish: string;
    imageUrl: string;
    specialEquipment: string;
    ingredients: Ingredient[];
    subIngredients: SubIngredient[];
    cookingInstructions: CookingInstructions[];
    subInstructions: RecipeSubInstructions[];
    sublists: ListName[];
};

const RecipeDetailsScreen = (
    {
        recipeOwner, 
        nameOfDish, 
        imageUrl,
        specialEquipment,
        ingredients,
        subIngredients,
        cookingInstructions,
        subInstructions, 
        sublists,
    }: RecipeDetailsProps) => {

        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.mainContentContainer}>
                    {/* header */}
                    <View style={{alignItems: "center"}}>
                        <Text style={styles.header}>{nameOfDish}</Text>
                        {
                            recipeOwner && recipeOwner.length > 0 && (
                                <Text style={styles.author}>Courtesy of {recipeOwner}</Text>
                            )
                        }
                    </View>

                    {/* image container */}
                    <View style={styles.imageContainer}>
                        <Image src={imageUrl} style={styles.image} />
                    </View>

                    {/* display dish ingredients */}
                    <View style={styles.ingredientsContainer}>
                        <Text style={styles.subHeader}>Ingredients</Text>
                        {
                            // if we only have a single ingredient list, then just display each ingredient name
                            ingredients.length > 0 ? (
                                <View style={styles.ingredientsContainer}>
                                    {
                                        ingredients.map((ingredient) => {
                                            return (
                                                <View key={ingredient.ingredient_id} style={styles.ingredientItem}>
                                                    <View style={{marginHorizontal: 5}}>
                                                       <AntDesign name="star" size={8} color={colors.secondaryAccent500} /> 
                                                    </View>
                                                    <View style={{marginHorizontal: 5}}>
                                                        <Text style={styles.text}>{ingredient.nameOfIngredient}</Text>
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
                                        sublists.map((sublist) => {
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
                                                                            key={ingredient.nameOfIngredient} 
                                                                            style={styles.ingredientItem}
                                                                        >
                                                                            <View style={{paddingHorizontal: 2}}> 
                                                                                <AntDesign name="star" size={8} color={colors.secondaryAccent500} />
                                                                            </View>

                                                                            <View style={{paddingHorizontal: 2}}>
                                                                                <Text style={styles.text}>{ingredient.nameOfIngredient}</Text>
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

                    {/* Display special equipment */}
                    <View style={{alignItems: "center", marginVertical: 20,}}>
                        <View>
                            <Text style={styles.subHeader}>Special Equipment</Text>
                        </View>
                        <View>
                            {
                                specialEquipment.length > 0 ? (
                                    <Text style={[styles.text, {marginVertical: 10}]}>{specialEquipment}</Text>
                                ) : (
                                    <Text style={[styles.text, {marginVertical: 10}]}>None</Text>
                                )
                            }
                        </View>
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
                                                    <View style={{marginHorizontal: 5}}>
                                                        <AntDesign name="star" size={8} color={colors.secondaryAccent500} />
                                                    </View>
                                                    <View style={{marginHorizontal: 5}}>
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
                                          sublists.map((sublist) => {
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
                                                                        <AntDesign name="star" size={8} color={colors.secondaryAccent500} />
                                                                    </View>
                                                                    <View style={{maxWidth: "95%", paddingHorizontal: 5}}>
                                                                        <Text style={styles.text}>{instruction.instruction}</Text>
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
                    {/* <View>
                        <CustomButton
                            onButtonPress={() => router.back()}
                            value="Go Back"
                            width={100}
                        >

                        </CustomButton>
                    </View> */}
                </View>
            </ScrollView>
        );
};

export default RecipeDetailsScreen;

const styles = StyleSheet.create({
    mainContentContainer: {
        alignItems: "center",
        flex: 1,
        paddingVertical: 30,
    },

    imageContainer: {
        height: 350,
        width: 350,
        borderRadius: 50,
        overflow: "hidden",
        marginVertical: 20,
        elevation: 12,
    },

    image: {
        height: 350,
        width: 350,
        objectFit: "cover",
    },

    header: {
        fontSize: 30,
        color: colors.secondaryAccent900,
        fontWeight: "bold",
        marginVertical: 20,
    },

    subHeader: {
        fontSize: 40,
        color: colors.secondaryAccent900,
        fontWeight: "bold",
    },

    author: {
        fontSize: 16,
        color: colors.primaryAccent900,
        fontWeight: "bold",
        marginBottom: 20,
    },

    ingredientsContainer: {
        alignItems: "center",
        // justifyContent: "center",
        marginVertical: 10,
        // maxWidth: "90%",
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
    },

    instructionContainer: {
        alignItems: "center",
        justifyContent: "center",
    },

    instructionItem: {
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "center",
        marginVertical: 10,
        maxWidth: "95%",
    },

    text: {
        color: colors.primaryAccent800,
        fontSize: 16,
        fontWeight: "700",
    }
});