import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

// import component(s)
import React from "react";
import Modal from 'react-native-modal';
import CustomButton from "./CustomButton";

import { deleteRecipeReview } from "@/api/recipes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// import colors
import colors from "../constants/colors";

type ConfirmReviewDeletionProps = {
    showDeleteModal: boolean;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    recipeId: string;
};

const ConfirmReviewDeletion = ({showDeleteModal, setShowDeleteModal, recipeId}: ConfirmReviewDeletionProps) => {
    const { accessToken } = useContext(UserContext);
    const queryClient = useQueryClient();

    const deleteReview = useMutation({
        mutationFn: () => deleteRecipeReview(accessToken, recipeId),
        onSuccess: () => {
            setShowDeleteModal(false);
            queryClient.invalidateQueries({queryKey: ["recipeData", recipeId]});
        },
        onError: (error) => {
            console.error(error);
            setShowDeleteModal(false);
        }
    });

    return (
        <View style={styles.container}>
            <Modal
                isVisible={showDeleteModal}
                animationIn="zoomIn"
                animationOut="zoomOut" 
            >
                <View style={styles.innerContent}>
                    <Text style={styles.warningText}>Are you sure you want to delete your review?</Text>

                    {/* buttons container */}
                    <View style={styles.buttonsContainer}>
                        <View style={{marginHorizontal: 10}}>
                            <CustomButton
                                value="Cancel"
                                width={100}
                                radius={50}
                                onButtonPress={() => setShowDeleteModal(false)}
                            >
                            </CustomButton>
                        </View>
                        <View style={{marginHorizontal: 10}}>
                            <CustomButton
                                value="Delete"
                                width={100}
                                radius={50}
                                color={colors.secondaryAccent900}
                                onButtonPress={() => deleteReview.mutate()}
                                mutationPending={deleteReview.isPending}
                            >
                            </CustomButton>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default ConfirmReviewDeletion;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)"
    },

    innerContent: {
        // flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.9)",
        height: 200,
        borderRadius: 10,
    },

    warningText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        padding: 20,
    },

    buttonsContainer: {
        flexDirection: "row",
    },
})