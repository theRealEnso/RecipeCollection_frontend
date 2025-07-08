import { UserContext } from "@/context/UserContext";
import { useContext, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, View } from "react-native";

import { useMutation, useQueryClient } from "@tanstack/react-query";

//import api function calls
import { editCuisineCategory } from "@/api/categories";

// import component(s)
import CustomButton from "../../CustomButton";

import colors from "../../../constants/colors";

// import types

type EditModalProps = {
    categoryName: string | null;
    setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedTileId: string | null;
};

const EditCategoryModal = (
    {
        categoryName, 
        setShowEditModal, 
        selectedTileId, 
    }: EditModalProps
) => {

    const [textInput, setTextInput] = useState<string | undefined>(categoryName as string);

    const queryClient = useQueryClient();
    
    const { accessToken } = useContext(UserContext);

    const editCategoryMutation = useMutation({
        mutationFn: editCuisineCategory,
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries({queryKey: ["userCategories"]})
            setShowEditModal(false);
        },
        onError: (error) => {
            console.error("Error editing cusine category: ", error);
        },
    });

    const handleSaveEdit = async () => {
        editCategoryMutation.mutate({
            accessToken,
            categoryText: textInput,
            categoryId: selectedTileId,
        });
    };

    const hideEditModal = () => {
        setShowEditModal(false);
    }
    return (
         <Modal 
            animationType="fade"
            transparent={false}
            visible={true}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <View>
                        <Text style={styles.label}>Edit category name</Text>
                        <TextInput 
                            placeholder="enter updated name" 
                            style={styles.textInputStyles}
                            value={textInput}
                            onChangeText={(value) => setTextInput(value)}
                        >
                        </TextInput>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <View style={styles.buttonOuterContainer}>
                            <CustomButton width={100} value="Cancel" onButtonPress={hideEditModal}></CustomButton>
                        </View>

                        <View style={styles.buttonOuterContainer}>
                            <CustomButton 
                                width={100} 
                                value="Save" 
                                onButtonPress={handleSaveEdit}
                                // mutationPending={deleteCategoryMutation.isPending}
                            />
                        </View>
                    </View>
                </View>

                {
                    editCategoryMutation.isPending && <ActivityIndicator color={colors.primaryAccent500}></ActivityIndicator>
                }
            </View>
        </Modal>

    );
};

export default EditCategoryModal;

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

    textInputStyles: {
        borderWidth: 2,
        borderColor: colors.backgroundPrimary,
        borderRadius: 10,
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
    },
});