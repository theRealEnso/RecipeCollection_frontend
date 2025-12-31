import React, { useContext, useState } from "react";

// import context(s)
import { UserContext } from "@/context/UserContext";

import { Image, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";

import { addRecipeReview } from "@/api/recipes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// import component(s)
import StarRating, { StarRatingDisplay } from "react-native-star-rating-widget";
import CustomButton from "./CustomButton";

// import icon(s)
import Entypo from '@expo/vector-icons/Entypo';

import { Review } from "../RecipeDetailsScreen";
import colors from "../constants/colors";
type ItemProps = {
    item: Review,
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
    userReviewId: string | null;
    setId: React.Dispatch<React.SetStateAction<string | null>>;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    recipeId: string;
};

const formatterUS = new Intl.DateTimeFormat("en-us", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h12"
});

const UserReview = ({item, setShowMenu, userReviewId, setId, isEditing, setIsEditing, recipeId}: ItemProps) => {
    const {width: screenWidth} = useWindowDimensions();

    const queryClient = useQueryClient();
    const [updatedComment, setUpdatedComment] = useState<string>(item.comment);
    const [pressed, setPressed] = useState<boolean>(false);
    const [starRating, setStarRating] = useState<number>(item.rating)

    const { currentUser, accessToken, } = useContext(UserContext);
    const userId = currentUser ? currentUser.id : null;

    const formattedDate = new Date(item.updatedAt);

    const updateReview = useMutation({
        mutationFn: () => addRecipeReview(accessToken, starRating, updatedComment, recipeId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["recipeReviews", recipeId]});
            setIsEditing(false);
        },
        onError: (error) => {
            console.error(error);
        }
    });

    // console.log(item.user);
    // console.log(item.user._id);
    // console.log(typeof item.user._id);
    
    // console.log(userReviewId);
    
    // console.log(recipeId);
    return (
        <View style={[styles.reviewContainer, {width: screenWidth * .90}]}>
            <View style={{padding: 10,}}>
                <View style={{flexDirection: "row",}}>
                    <Image 
                        src={item.user.image} 
                        style={
                            {
                                marginHorizontal: 5, 
                                height: 40, 
                                width: 40,
                                borderRadius: 20,
                            }
                        }
                        >  
                    </Image>

                    <View style={{marginHorizontal: 5,}}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <View>
                                <View>
                                    <Text style={{marginHorizontal: 10, color:"white", fontWeight: "bold", fontSize: 16}}>{`${item.user.firstName}`}</Text>
                                </View>
                                <View style={{marginVertical: 10,}}>
                                    {
                                        isEditing ? (
                                            <StarRating
                                                rating={starRating}
                                                onChange={(rating: number) => setStarRating(rating)}
                                                starSize={14}
                                                color={colors.secondaryAccent900}
                                                style={{marginHorizontal: 10}}
                                                maxStars={5}
                                                step="full"
                                                >

                                            </StarRating>
                                        ) : (
                                            <StarRatingDisplay 
                                                rating={item.rating} 
                                                starSize={14} 
                                                color={colors.secondaryAccent900} 
                                                style={{marginHorizontal: 10}}>
                                            </StarRatingDisplay>
                                        )
                                    }

                                </View>

                                <Text style={{marginHorizontal: 10, color:"white", fontSize: 12, marginVertical: 5,}}>{`${formatterUS.format(formattedDate)}`}</Text>
                            </View>
                        </View>


                        {
                            isEditing && userId === item.user._id ? (
                                <View>
                                    <TextInput 
                                        value={updatedComment} 
                                        onChangeText={(text) => setUpdatedComment(text)}
                                        multiline={true}
                                        numberOfLines={4}
                                        style={styles.textInputStyles}
                                    ></TextInput>

                                    <View style={{flexDirection: "row", justifyContent: "flex-end", padding: 20}}>
                                        <View style={{marginHorizontal: 5}}>
                                            <CustomButton 
                                                value="Cancel" 
                                                width={75} 
                                                height={30} 
                                                radius={32.5} 
                                                color={colors.textSecondary500}
                                                textSize={12}
                                                onButtonPress={() => setIsEditing(false)}
                                            >
                                            </CustomButton>
                                        </View>
                                        <View style={{marginHorizontal: 5}}>
                                            <CustomButton 
                                                value="Save" 
                                                width={75} 
                                                height={30} 
                                                radius={50} 
                                                color={colors.primaryAccent600} 
                                                textSize={12}
                                                onButtonPress={() => updateReview.mutate()}
                                                mutationPending={updateReview.isPending}
                                                >

                                            </CustomButton>
                                        </View>
                                    </View>
                                </View>

                            ) : (
                                <Text style={{color: "white", marginTop: 10, marginLeft: 10, width: 300, maxWidth: "90%"}}>{`${item.comment}`}</Text>
                            )
                        }
                    </View>
                </View>
            </View>

            {/* 3 vertical dots icon */}
            <View style={[
                styles.verticalDots, 
                {
                    backgroundColor: pressed ? colors.textSecondary500 : colors.primaryAccent000
                    
                },
            ]}>
                    <Pressable
                        onPress={() => {
                            setShowMenu(true);
                            setId(item.user._id);
                        }}
                        onPressIn={() => setPressed(true)}
                        onPressOut={() => setPressed(false)}
                    >
                        <Entypo name="dots-three-vertical" size={16} color="white"></Entypo>
                    </Pressable>
            </View>
        </View>
    );
};

export default UserReview;

const styles = StyleSheet.create({
    reviewContainer: {
        backgroundColor: colors.primaryAccent000,
        borderRadius: 6,
        borderBottomWidth: 1,
        borderColor: "white"
    },

    textInputStyles: {
        borderColor: "white",
        borderWidth: 2,
        maxWidth: "90%",
        color: "white",
    },

    verticalDots: {
        height: 30, 
        width: 30, 
        borderRadius: 15, 
        marginHorizontal: 20, 
        alignItems: "center",  
        justifyContent: "center", 
        position: "absolute",
        right: -10,
        top: 10,
    }
})