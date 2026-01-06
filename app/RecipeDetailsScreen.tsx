import { useContext, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View
} from "react-native";

// import { useRouter } from "expo-router";

// import context(s)
import { UserContext } from "@/context/UserContext";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios helper function(s)
import {
    addFavoriteRecipe,
    addRecipeReview,
    getRecipeReviewsPaged,
    removeFavoriteRecipe,
} from "@/api/recipes";

// import colors
import colors from "./constants/colors";

// import icon(s)
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// import component(s)
import StarRating from "react-native-star-rating-widget";
import ConfirmReviewDeletion from "./components/ConfirmReviewDeletion";
import CustomButton from "./components/CustomButton";
import EditMenu from "./components/EditMenu";
import UserReview from "./components/UserReview";

//import type(s)
import {
    CookingInstructions,
    Ingredient,
    ListName,
    RecipeSubInstructions,
    SubIngredient
} from "@/types/Recipe";

export type Review = {
    user: {
        firstName: string;
        lastName: string;
        image: string;
    }
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    _id: string
};

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
    id: string;
    // reviews: Review[],
    averageRating: number,
    ratingCount: number,
};

const REVIEWS_PAGE_LIMIT = 10;

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
        id,
        // reviews,
        averageRating,
        ratingCount,
    }: RecipeDetailsProps) => {
        const {width: screenWidth} = useWindowDimensions();
        const queryClient = useQueryClient();
        const { accessToken, currentUser, setCurrentUser } = useContext(UserContext);

        // console.log(currentUser);
        const user = currentUser ? currentUser : null;

        const isInitiallyFavorited = !!(user && user.favoriteRecipes.includes(id));

        const [isFavorited, setIsFavorited] = useState<boolean>(isInitiallyFavorited);
        const [showToast, setShowToast] = useState<boolean>(false);
        const [rating, setRating] = useState<number>(0);
        const [avgRating, setAvgRating] = useState<number>(averageRating);
        const [comment, setComment] = useState<string>("");
        const [showEditMenu, setShowEditMenu] = useState<boolean>(false);
        const [userReviewId, setUserReviewId] = useState<string | null>("");
        const [isEditing, setIsEditing] = useState<boolean>(false);
        const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

        const toastAnimation = useRef(new Animated.Value(0)).current;
        const heartAnimation = useRef(new Animated.Value(1)).current;

        /*
        =============================================================
                        *****   define mutations    *****
        =============================================================            
        */
        const recipeReviewsQuery = useInfiniteQuery({
            initialPageParam: null,
            queryKey: ["recipeReviews", id],
            queryFn: ({pageParam}) => getRecipeReviewsPaged({
                accessToken,
                recipeId: id,
                limit: REVIEWS_PAGE_LIMIT,
                cursor: pageParam,
            }),
            getNextPageParam: (lastPage) => {
                // console.log("getNextPageParam called with:", lastPage.nextCursor);
                return lastPage.nextCursor ?? null;
            },
            enabled: !!id,
        });

        // console.log(recipeReviewsQuery.data?.pages);

        const addToFavorites = useMutation({
            mutationFn: () => addFavoriteRecipe(accessToken, id),
            onSuccess: (data) => {
                // console.log(data);
                queryClient.invalidateQueries({queryKey: ["favoriteRecipes", user?.id ]});
                setCurrentUser((previous) => previous && {...previous, favoriteRecipes: data.favoriteRecipes});
            },
            onError: (error) => {
                console.error(error);
            }
        });

        const removeFromFavorites = useMutation({
            mutationFn: () => removeFavoriteRecipe(accessToken, id),
            onSuccess: (data) => {
                // console.log(data);
                queryClient.invalidateQueries({queryKey: ["favoriteRecipes", user?.id ]});
                setCurrentUser((previous) => previous && {...previous, favoriteRecipes: data.favoriteRecipes});
            },
            onError: (error) => {
                console.error(error);
            }
        });

        const addReview = useMutation({
            mutationFn: () => addRecipeReview(accessToken, rating, comment, id),
            onSuccess: (data) => {
                queryClient.invalidateQueries({queryKey: ["recipeReviews", id]});
                setComment("");
                setRating(0);
            },
            onError: (error) => {
                console.error(error);
            },
        });

        /*
        ================================================================
        *   to show toast animation and animate heart when favoriting *
        ================================================================
        */

        const showAddedToast = () => {
            setShowToast(true);

            Animated.timing(toastAnimation, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }).start(() => {
                setTimeout(() => {
                    Animated.timing(toastAnimation, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }).start(() => {
                        setShowToast(false);
                    })
                }, 1000);
            });
        };

        const animateHeart = () => {
            Animated.timing(heartAnimation, {
                toValue: 1.3,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setTimeout(() => {
                    Animated.timing(heartAnimation, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }).start()
                }, 10)
            })
        };

        /*
        ================================================================
                    *****   toggle favoriting   *****
        ================================================================
        */
        const handleFavorited = () => {
            let favorited = !isFavorited // on first render, isFavorited = true, so favorited is flipped to false now
            animateHeart();
            setIsFavorited(favorited); // isFavorited will flip to true on the next render

            // will execute immediately instead of next re-render because favorited is true in this render cycle
            if(favorited){
                addToFavorites.mutate();
                showAddedToast();
            } else {
                removeFromFavorites.mutate();
                showAddedToast();
            }
        };

        // console.log(id);
        // console.log(rating);

        const userReviews = recipeReviewsQuery.data?.pages.flatMap((page) => page.items) || [];
        const handleEndReached = () => {
            if(!recipeReviewsQuery.hasNextPage || recipeReviewsQuery.isFetchingNextPage){
                //  console.log("No more pages or fetching");
                 return;
            }
            // console.log("Fetching next page...");
            recipeReviewsQuery.fetchNextPage();
        };
    
        const ListHeaderComponent = (
                <View>
                    <View style={styles.mainContentContainer}>
                        {/* ******      header section      ****** */}
                        {/* favorited icon / button */}
                        <View style={styles.favoritesContainer}>
                            <View style={{marginHorizontal: 5}}>
                                <Text style={styles.favoriteText}>
                                    {
                                        isFavorited ? "Recipe favorited !" : "Add to favorites?"
                                    }
                                </Text>
                            </View>
                            <View style={{marginHorizontal: 5}}>
                                <Animated.View style={{transform: [{scale: heartAnimation}]}}>
                                    <MaterialIcons 
                                        name={isFavorited ? "favorite" : "favorite-outline"} 
                                        size={32} 
                                        color={isFavorited ? colors.secondaryAccent900 : colors.primaryAccent900  } 
                                        onPress={handleFavorited} 
                                    />
                                </Animated.View>
                            </View>
                        </View>

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

                        {/* ******      ingredients section     ****** */}
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
                                <View style={styles.ingredientsContainer}>
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

                        {/* ******      Special equipment section       ****** */}
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

                        {/* ******      cooking instructions section        ****** */}
                        <View style={styles.instructionContainer}>
                            <View style={{alignItems: "center", marginVertical: 10,}}>
                                <Text style={styles.subHeader}>Instructions</Text>
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
                                                            <Text style={styles.text}>{instruction.instruction}</Text>
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
                        
                        {/* empty container with bottom border for cleaner looking separation from reviews section */}
                        <View style={{borderBottomWidth: 2, borderColor: "gray", height: 50, width: 150,}}>

                        </View>

                        {/* ******      ratings and reviews section     ****** */}
                        <View>
                            <View style={{alignItems: "center",}}>
                                <Text style={[styles.reviewHeaderText, {marginVertical: 30}]}>Let us know what you think about this recipe!</Text>
                                <Text style={{fontSize: 18, color: colors.primaryAccent900}}>Leave a review</Text>

                                <StarRating 
                                    rating={rating}
                                    onChange={(rating) => setRating(rating)}
                                    maxStars={5}
                                    step="full"
                                    style={{marginVertical: 25}}
                                >
                                </StarRating>
                                
                                <TextInput
                                    multiline={true}
                                    numberOfLines={4}
                                    placeholder="Write your review..."
                                    value={comment}
                                    onChangeText={(text) => setComment(text)}
                                    style={styles.commentBox}
                                    textAlignVertical="top"
                                >
                                </TextInput>
                            </View>
                            
                            <View style={styles.postButtonContainer}>
                                <CustomButton
                                    value="Post"
                                    width={100}
                                    radius={10}
                                    color={colors.secondaryAccent700}
                                    onButtonPress={() => addReview.mutate()}
                                    mutationPending={addReview.isPending}
                                >
                                </CustomButton>
                            </View>
                        </View>

                        {/* empty container with bottom border for cleaner looking separation between sections */}
                        <View style={{borderBottomWidth: 2, borderColor: "gray", height: 50, width: 150, marginBottom: 20,}}></View>
                    </View>

                    {/* section to display all reviews for recipe */}
                    { 
                        userReviews.length > 0 ?
                        (
                            <View style={{marginTop: 20}}>

                                <View style={{alignItems: "center", justifyContent: "center", marginVertical: 20,}}>
                                    <Text style={styles.reviewHeaderText}>What others are saying</Text>
                                </View>

                                
                                <View style={{flexDirection: "row", maxWidth: "80%", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingHorizontal: 30}}>
                                    <View>
                                        <Text style={{fontSize: 20}}>
                                            {
                                                ratingCount === 1 ? "1 Review" : `${ratingCount} Reviews`
                                            }
                                        </Text>
                                    </View>

                                    <View style={{flexDirection: "row"}}>
                                        <StarRating
                                            rating={averageRating}
                                            onChange={() => setAvgRating(averageRating)}
                                            maxStars={5}
                                            step="full"
                                            starSize={16}
                                            style={{marginHorizontal: 10}}
                                        >
                                        </StarRating>

                                        <Text>{`${averageRating}/5 stars`}</Text>
                                    </View>

                                </View>
                            </View>
                        ) :
                        (
                            <View style={{marginTop: 20, alignItems: "center"}}>
                                <Text style={styles.reviewHeaderText}>No reviews yet.</Text>
                                <Text style={styles.reviewHeaderText}>Be the first!</Text>
                            </View>
                        )
                    }
                

                    {/* conditionally render the animated component */}
                    {
                        showToast && isFavorited ? (
                            <Animated.View
                                style={[styles.toast, {
                                    opacity: toastAnimation, 
                                    transform: [
                                    {translateY: toastAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-10, 0]
                                    })}
                                ]}]}
                            >
                                <Text style={styles.toastText}>Successfully added to favorites!</Text>
                            </Animated.View>
                        ) : 

                        (
                            <Animated.View
                                style={[styles.toast, {
                                    opacity: toastAnimation, 
                                    transform: [
                                    {translateY: toastAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-10, 0]
                                    })}
                                ]}]}
                            >
                                <Text style={styles.toastText}>Successfully removed from favorites!</Text>
                            </Animated.View>
                        )
                    }

                    {/* conditionally render the edit menu */}
                    {
                        showEditMenu && (
                            <View style={{position: "absolute", bottom: 10,}}>
                                <EditMenu 
                                    setShowMenu={setShowEditMenu}
                                    showEditMenu={showEditMenu} 
                                    userReviewId={userReviewId} 
                                    setIsEditing={setIsEditing}
                                    setShowDeleteModal={setShowDeleteModal}
                                >
                                </EditMenu>
                            </View>
                        )
                    }

                    {/* conditionally render the confirm deletion modal */}
                    {
                        showDeleteModal && (
                            <ConfirmReviewDeletion
                                showDeleteModal={showDeleteModal}
                                setShowDeleteModal={setShowDeleteModal}
                                recipeId={id}
                            >

                            </ConfirmReviewDeletion>
                        )
                    }
                </View>
            );

    return (
        <FlatList
            data={userReviews}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({item}) => 
                <UserReview 
                    item={item} 
                    setShowMenu={setShowEditMenu}
                    userReviewId={userReviewId} 
                    setId={setUserReviewId} 
                    isEditing={isEditing} 
                    setIsEditing={setIsEditing}
                    recipeId={id}
                />
            }
            horizontal={false}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            onEndReached={handleEndReached}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={
                recipeReviewsQuery.isFetchingNextPage ? (
                    <ActivityIndicator size={24} color={colors.primaryAccent000}></ActivityIndicator>
                ) : null
            }
            refreshing={recipeReviewsQuery.isFetching && !recipeReviewsQuery.isFetchingNextPage}
            onRefresh={() => recipeReviewsQuery.refetch()}
            contentContainerStyle={{
                width: screenWidth * .90,
            }}
        />
    );      
};

export default RecipeDetailsScreen;

const styles = StyleSheet.create({
    mainContentContainer: {
        alignItems: "center",
        flex: 1,
        padding: 10,
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
        marginHorizontal: 10,
        paddingHorizontal: 25,
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
        marginVertical: 10,
        paddingHorizontal: 30,
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
        // alignItems: "center",
        // justifyContent: "center",
        paddingHorizontal: 10,
        paddingBottom: 20,
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
    },

    favoritesContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginLeft: "auto",
        marginVertical: 20,
    },

    favoriteText: {
        fontSize: 18,
        color: colors.primaryAccent900,
    },

    toast: {
        position: "absolute",
        top: 70,
        right: 20,
        alignSelf: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: colors.primaryAccent900,
    },

    toastText: {
        color: "#fff",
    },

    reviewHeaderText: {
        fontSize: 28,
        color: colors.secondaryAccent700,
        paddingHorizontal: 40,
        // marginVertical: 20,
    },

    commentBox: {
        width: "80%",
        // maxWidth: "70%",
        height: 125,
        borderRadius: 10,
        borderColor: colors.textPrimary500,
        borderWidth: 2,
        padding: 10,
    },

    postButtonContainer: {
        marginTop: 10,
        alignItems: "flex-end",
        paddingRight: 40,
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////

// old code:

// =========================================================================================================

    //    const flatListData = [
    //         // data for header section
    //         {
    //             section: "header",
    //             data: { recipeOwner, nameOfDish, imageUrl, showToast, isFavorited, handleFavorited, heartAnimation, isInitiallyFavorited }
    //         },

    //         // data for ingredients section
    //         {
    //             section: "ingredients",
    //             data: { ingredients, subIngredients, sublists}
    //         },

    //         // data special equipment section
    //         {   
    //             section: 'equipment', 
    //             data: { specialEquipment } 
    //         },

    //         // data for instructions section
    //         { 
    //             section: 'instructions', 
    //             data: { cookingInstructions, subInstructions, sublists }
    //         },

    //         // data for review section
    //         { 
    //             section: 'reviews', 
    //             data: { averageRating, ratingCount, id, addReview, rating, setRating, comment, setComment,} 
    //         },
    //     ];

    //     // console.log(userReviews);
    //     // console.log(userReviews.length);

    //     const renderSection = ({item}: ListRenderItemInfo<any>) => {
    //         switch (item.section){
    //             case "header":
    //                 return (
    //                     <View style={styles.mainContentContainer}>
    //                         {/* ******      header section      ****** */}
    //                         {/* favorited icon / button */}
    //                         <View style={styles.favoritesContainer}>
    //                             <View style={{marginHorizontal: 5}}>
    //                                 <Text style={styles.favoriteText}>
    //                                     {
    //                                         item.data.isFavorited ? "Recipe favorited !" : "Add to favorites?"
    //                                     }
    //                                 </Text>
    //                             </View>
    //                             <View style={{marginHorizontal: 5}}>
    //                                 <Animated.View style={{transform: [{scale: item.data.heartAnimation}]}}>
    //                                     <MaterialIcons 
    //                                         name={item.data.isFavorited ? "favorite" : "favorite-outline"} 
    //                                         size={32} 
    //                                         color={item.data.isFavorited ? colors.secondaryAccent900 : colors.primaryAccent900  } 
    //                                         onPress={item.data.handleFavorited} 
    //                                     />
    //                                 </Animated.View>
    //                             </View>
    //                         </View>

    //                         {/* conditionally render the animated component */}
    //                         {
    //                             item.data.showToast && item.data.isFavorited ? (
    //                                 <Animated.View
    //                                     style={[styles.toast, {
    //                                         opacity: toastAnimation, 
    //                                         transform: [
    //                                         {translateY: toastAnimation.interpolate({
    //                                             inputRange: [0, 1],
    //                                             outputRange: [-10, 0]
    //                                         })}
    //                                     ]}]}
    //                                 >
    //                                     <Text style={styles.toastText}>Successfully added to favorites!</Text>
    //                                 </Animated.View>
    //                             ) : 

    //                             (
    //                                 <Animated.View
    //                                     style={[styles.toast, {
    //                                         opacity: toastAnimation, 
    //                                         transform: [
    //                                         {translateY: toastAnimation.interpolate({
    //                                             inputRange: [0, 1],
    //                                             outputRange: [-10, 0]
    //                                         })}
    //                                     ]}]}
    //                                 >
    //                                     <Text style={styles.toastText}>Successfully removed from favorites!</Text>
    //                                 </Animated.View>
    //                             )
    //                         }


    //                         {/* header */}
    //                         <View style={{alignItems: "center", justifyContent: "center", paddingHorizontal: 40,}}>
    //                             <Text style={styles.header}>{item.data.nameOfDish}</Text>
    //                             {
    //                                 item.data.recipeOwner && item.data.recipeOwner.length > 0 && (
    //                                     <Text style={styles.author}>Courtesy of {item.data.recipeOwner}</Text>
    //                                 )
    //                             }
    //                         </View>

    //                         {/* image container */}
    //                         <View style={styles.imageContainer}>
    //                             <Image src={item.data.imageUrl} style={styles.image} />
    //                         </View>
    //                     </View>
    //                 );

    //             case "ingredients":
    //                 return (
    //                     <View style={styles.mainContentContainer}>
    //                         <Text style={styles.subHeader}>Ingredients</Text>
    //                         {
    //                             item.data.ingredients.length > 0 ? (
    //                                 <View style={styles.ingredientsContainer}>
    //                                     {
    //                                         item.data.ingredients.map((ingredient: any) => {
    //                                             return (
    //                                                 <View key={ingredient.ingredient_id} style={styles.ingredientItem}>
    //                                                     <View style={{marginHorizontal: 5}}>
    //                                                         <AntDesign name="star" size={8} color={colors.secondaryAccent500} /> 
    //                                                     </View>
    //                                                     <View style={{marginHorizontal: 5}}>
    //                                                         <Text style={styles.text}>{ingredient.nameOfIngredient}</Text>
    //                                                     </View>
    //                                                 </View>
    //                                             )
    //                                         })
    //                                     }
    //                                 </View>
    //                             ) : (
    //                                 <View style={styles.ingredientsContainer}>
    //                                     {
    //                                         item.data.sublists.map((sublist: any) => {
    //                                             const filteredIngredients = item.data.subIngredients.filter((ingredient: any) => ingredient.sublistName === sublist.name);

    //                                             return (
    //                                                 <View key={sublist.id} style={{maxWidth: "70%", marginVertical: 10,}}>
    //                                                     <View style={{marginBottom: 10, alignItems: "center",}}>
    //                                                         <Text style={styles.sublistHeader}>{sublist.name}</Text>
    //                                                     </View>
    //                                                     <View>
    //                                                         {
    //                                                             filteredIngredients.length > 0 ? (
    //                                                                 filteredIngredients.map((ingredient: any) => {
    //                                                                     return (
    //                                                                         <View 
    //                                                                             key={ingredient.nameOfIngredient} 
    //                                                                             style={styles.ingredientItem}
    //                                                                         >
    //                                                                             <View style={{paddingHorizontal: 2}}> 
    //                                                                                 <AntDesign name="star" size={8} color={colors.secondaryAccent500} />
    //                                                                             </View>
    //                                                                             <View style={{paddingHorizontal: 2}}>
    //                                                                                 <Text style={styles.text}>{ingredient.nameOfIngredient}</Text>
    //                                                                             </View>
    //                                                                         </View>
    //                                                                     )
    //                                                                 })
    //                                                             ) : (
    //                                                                 <Text>No ingredients for this section</Text>
    //                                                             )
    //                                                         }
    //                                                     </View>
    //                                                 </View>
    //                                             )
    //                                         })
    //                                     }
    //                                 </View>
    //                             )    
    //                         }
    //                     </View>
    //                 );

    //             case 'equipment':
    //                 return (
    //                     <View style={styles.mainContentContainer}>
    //                         <View style={{alignItems: "center", marginVertical: 20,}}>
    //                             <View>
    //                                 <Text style={styles.subHeader}>Special Equipment</Text>
    //                             </View>
    //                             <View>
    //                                 {
    //                                     item.data.specialEquipment.length > 0 ? (
    //                                         <Text style={[styles.text, {marginVertical: 10}]}>{item.data.specialEquipment}</Text>
    //                                     ) : (
    //                                         <Text style={[styles.text, {marginVertical: 10}]}>None</Text>
    //                                     )
    //                                 }
    //                             </View>
    //                         </View>
    //                     </View>
    //                 );
    //             case 'instructions':
    //                 return (
    //                     <View style={styles.mainContentContainer}>
    //                         <View style={styles.instructionContainer}>
    //                             <View>
    //                                 <Text style={styles.subHeader}>Cooking Instructions</Text>
    //                             </View>
    //                             <View>
    //                                 {
    //                                     item.data.cookingInstructions.length > 0 ? (
    //                                         <View>
    //                                             {
    //                                                 item.data.cookingInstructions.map((instruction: any) => {
    //                                                     return (
    //                                                         <View key={instruction.instruction_id} style={styles.instructionItem}>
    //                                                             <View style={{marginHorizontal: 5}}>
    //                                                                 <AntDesign name="star" size={8} color={colors.secondaryAccent500} />
    //                                                             </View>
    //                                                             <View style={{marginHorizontal: 5}}>
    //                                                                 <Text style={styles.text}>{instruction.instruction}</Text>
    //                                                             </View>
    //                                                         </View>
    //                                                     )
    //                                                 })
    //                                             } 
    //                                         </View>
    //                                     ): (
    //                                         <View>
    //                                             {
    //                                                 item.data.sublists.map((sublist: any) => {
    //                                                     const filteredInstructions = item.data.subInstructions.filter((instruction: any) => instruction.sublistName === sublist.name);

    //                                                     return (
    //                                                         <View key={sublist.id} style={styles.sublistContainer}>
    //                                                             <View>
    //                                                                 <Text style={styles.sublistHeader}>{sublist.name}</Text>
    //                                                             </View>
    //                                                             <View>
    //                                                                 {filteredInstructions.map((instruction: any) => {
    //                                                                     return (
    //                                                                         <View key={instruction.instruction_id} style={styles.instructionItem}>
    //                                                                             <View style={{paddingHorizontal: 5}}>
    //                                                                                 <AntDesign name="star" size={8} color={colors.secondaryAccent500} />
    //                                                                             </View>
    //                                                                             <View style={{maxWidth: "95%", paddingHorizontal: 5}}>
    //                                                                                 <Text style={styles.text}>{instruction.instruction}</Text>
    //                                                                             </View>
    //                                                                         </View>
    //                                                                     )
    //                                                                 })}
    //                                                             </View>
    //                                                         </View>
    //                                                     )
    //                                                 })  
    //                                             }
    //                                         </View>
    //                                     )
    //                                 }
    //                             </View>
    //                         </View>
    //                     </View>
    //                 );
    //             case 'reviews':
    //                 return (
    //                     <View style={styles.mainContentContainer}>
    //                         {/* Ratings and reviews section */}
    //                         <View>
    //                             <View style={{alignItems: "center"}}>
    //                                 {/* empty view to display a border for cleaner separation to reviews section */}
    //                                 <View style={{borderWidth: 1, borderColor: colors.primaryAccent000, width: 100, marginVertical: 10}}>

    //                                 </View>
    //                                 <Text style={[styles.reviewHeaderText, {marginTop: 30}]}>Let us know what you think</Text>
    //                                 <Text style={[styles.reviewHeaderText, {alignItems: "center", justifyContent: "center", marginBottom: 30,}]}>about this recipe!</Text>
    //                                 <Text style={{fontSize: 18, color: colors.primaryAccent900}}>Leave a review</Text>

    //                                 <StarRating 
    //                                     rating={item.data.rating}
    //                                     onChange={(rating) => item.data.setRating(rating)}
    //                                     maxStars={5}
    //                                     step="full"
    //                                     style={{marginVertical: 25}}
    //                                 >
    //                                 </StarRating>

    //                                 <TextInput
    //                                     multiline={true}
    //                                     numberOfLines={4}
    //                                     placeholder="Write your review..."
    //                                     value={item.data.comment}
    //                                     onChangeText={(text) => item.data.setComment(text)}
    //                                     style={styles.commentBox}
    //                                     textAlignVertical="top"
    //                                 >
    //                                 </TextInput>
    //                             </View>
                                
    //                             <View style={styles.postButtonContainer}>
    //                                 <CustomButton
    //                                     value="Post"
    //                                     width={100}
    //                                     radius={10}
    //                                     color={colors.secondaryAccent700}
    //                                     onButtonPress={() => item.data.addReview.mutate()}
    //                                     mutationPending={item.data.addReview.isPending}
    //                                 >
    //                                 </CustomButton>
    //                             </View>
    //                         </View>

    //                         {/* Section to display all reviews for recipe */}
    //                         {
    //                             userReviews && userReviews.length > 0 ?
    //                             (
    //                                 <View style={{marginTop: 20, alignItems: "center", flex: 1}}>
    //                                     {/* empty view to display a border for cleaner separation to reviews section */}
    //                                     <View style={{ alignItems: "center", borderWidth: 1, borderColor: colors.primaryAccent000, width: 100, marginVertical: 10}}/>

    //                                     <View style={{alignItems: "center", justifyContent: "center", marginVertical: 20,}}>
    //                                         <Text style={styles.reviewHeaderText}>What others are saying</Text>
    //                                     </View>

    //                                     <View style={{
    //                                             flexDirection: "row", 
    //                                             alignItems: "center",
    //                                             justifyContent: "space-between", 
    //                                             marginBottom: 20,
    //                                         }}
    //                                     >
    //                                         <View>
    //                                             <Text style={{fontSize: 20}}>
    //                                                 {
    //                                                     item.data.ratingCount === 1 ? "1 Review" : `${item.data.ratingCount} Reviews`
    //                                                 }
    //                                             </Text>
    //                                         </View>

                                            
    //                                         <StarRating
    //                                             rating={item.data.averageRating}
    //                                             onChange={() => {}}
    //                                             maxStars={5}
    //                                             step="full"
    //                                             starSize={20}
    //                                             style={{marginHorizontal: 10}}
    //                                         >
    //                                         </StarRating>

    //                                         <Text>{`${item.data.averageRating}/5 stars`}</Text>
                                            
    //                                     </View>
                                        
    //                                     <FlatList
    //                                         data={userReviews}
    //                                         keyExtractor={(item) => item._id.toString()}
    //                                         renderItem={({item}) => 
    //                                             <UserReview 
    //                                                 item={item} 
    //                                                 setShowMenu={setShowEditMenu}
    //                                                 userReviewId={userReviewId} 
    //                                                 setId={setUserReviewId} 
    //                                                 isEditing={isEditing} 
    //                                                 setIsEditing={setIsEditing}
    //                                                 recipeId={id}
    //                                             />
    //                                         }
    //                                         horizontal={false}
    //                                         contentContainerStyle={{
    //                                             borderRadius: 4, 
    //                                             marginBottom: 10, 
    //                                             backgroundColor: colors.primaryAccent000,
    //                                             paddingBottom: 50,
    //                                         }}
    //                                         showsVerticalScrollIndicator={false}
    //                                         onEndReachedThreshold={0.1}
    //                                         onEndReached={handleEndReached}
    //                                         ListFooterComponent={recipeReviewsQuery.isFetchingNextPage ? (
    //                                             <ActivityIndicator size={24} color={colors.primaryAccent000}></ActivityIndicator>
    //                                         ) : null}
    //                                         refreshing={recipeReviewsQuery.isFetching}
    //                                         onRefresh={() => recipeReviewsQuery.refetch()}
    //                                         scrollEnabled={true}
    //                                         scrollEventThrottle={16}
    //                                         nestedScrollEnabled={true}
    //                                         // style={{height: 600}}
    //                                     />
    //                                 </View>
    //                             ) :
    //                             (
    //                                 <View style={{marginTop: 20,}}>
    //                                     <Text style={styles.reviewHeaderText}>No reviews yet. Be the first!</Text>
    //                                 </View>
    //                             )
    //                         }
    //                     </View>
    //                 );

    //             default:
    //                 return null;   
    //         }
    //     }