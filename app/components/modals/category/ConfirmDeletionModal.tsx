import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

import { deleteCuisineCategory } from "@/api/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// import component(s)
import CustomButton from "../../CustomButton";

import colors from "../../../constants/colors";

// import types

type DeletionModalProps = {
    categoryName?: string | null;
    setShowWarningModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedTileId: string | null;
};

const ConfirmDeletionModal = (
    {
        categoryName, 
        setShowWarningModal, 
        selectedTileId, 
    }: DeletionModalProps
) => {

    // console.log("Confirm deletion modal mounted!");

    const queryClient = useQueryClient();
    
    const { accessToken } = useContext(UserContext);

    const hideWarning = () => {
        setShowWarningModal(false);
    };

    const deleteCategoryMutation = useMutation({
        mutationFn: deleteCuisineCategory,
        onSuccess: async (data) => {
            // console.log(`Category successfully deleted: ${data}`);
            queryClient.invalidateQueries({queryKey: ["userCategories"]});
            setShowWarningModal(false);
        },
        onError: (error) => {
            console.error(`Error deleting category: ${error}`)
        },
    });

    const handleDeleteCategory = () => {
        if(!accessToken || ! selectedTileId) return;

        deleteCategoryMutation.mutate({
            accessToken,
            categoryId: selectedTileId,
        });
    };

    return (
        <Modal 
            animationType="fade"
            transparent={false}
            visible={true}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <View>
                        <Text style={styles.label}>Are you sure?</Text>
                        <Text style={styles.text}>You are about to delete your <Text style={styles.highlightText}>{categoryName}</Text> category and all of its associated recipes!</Text>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <View style={styles.buttonOuterContainer}>
                            <CustomButton width={100} value="Cancel" onButtonPress={hideWarning}></CustomButton>
                        </View>

                        <View style={styles.buttonOuterContainer}>
                            <CustomButton 
                                width={100} 
                                value="Confirm" 
                                onButtonPress={handleDeleteCategory}
                                mutationPending={deleteCategoryMutation.isPending}
                            />
                        </View>
                    </View>

                </View>
            </View>
        </Modal>

    );
};

export default ConfirmDeletionModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    content: {
        padding: 20,
    },

    label: {
        fontSize: 30,
        color: colors.primaryAccent500,
        fontWeight: "500",
        marginVertical: 20,
    },

    text: {
        fontSize: 20,
    },

    highlightText: {
        color: colors.primaryAccent900,
    },

    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginVertical: 20,
        paddingHorizontal: 30,
    },

    buttonOuterContainer: {
        marginHorizontal: 10, 
        overflow: "hidden",
        borderRadius: 12,
    }
});