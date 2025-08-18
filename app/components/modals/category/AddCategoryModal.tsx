import { UserContext } from "@/context/UserContext";
import { useContext, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, View } from "react-native";

import { useMutation, useQueryClient } from "@tanstack/react-query";

// import api function calls
import { addCuisineCategory } from "@/api/categories";

// import component(s)
import CustomButton from "../../CustomButton";

import colors from "../../../constants/colors";

// import utility function(s)
import { formatString } from "@/utils/formatString";

type AddModalProps = {
    setShowAddCategoryModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddCategoryModal = ({setShowAddCategoryModal}: AddModalProps) => {
    const queryClient = useQueryClient();
    const { accessToken } = useContext(UserContext);

    const [textInput, setTextInput] = useState<string>("");

    const addCategoryMutation = useMutation({
        mutationFn: addCuisineCategory,
        onSuccess: (data) => {
            if(data){
                // console.log("Successfully added a category:", data);
                queryClient.invalidateQueries({queryKey: ["userCategories"]}); // force refetch of categories after adding one
                setShowAddCategoryModal(false);
            }
        },
        onError: (error) => {
            console.error(`Error adding a category: ${error}`);
        },
    });

    const hideAddModal = () => {
        setShowAddCategoryModal(false);
    };

    const handleAddCategory = () => {
        if(!accessToken) return;

        addCategoryMutation.mutate({
            accessToken,
            categoryText: formatString(textInput),
        });
    };

    // console.log(textInput);

    return (
        <Modal 
            animationType="fade"
            transparent={false}
            visible={true}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <View>
                        <Text style={styles.label}>Add a cuisine category</Text>
                        <TextInput 
                            placeholder="e.g. Italian" 
                            style={styles.textInputStyles}
                            onChangeText={(value) => setTextInput(value)}
                        >
                        </TextInput>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <View style={styles.buttonOuterContainer}>
                            <CustomButton width={100} value="Cancel" onButtonPress={hideAddModal}></CustomButton>
                        </View>

                        <View style={styles.buttonOuterContainer}>
                            <CustomButton 
                                width={100} 
                                value="Confirm" 
                                onButtonPress={handleAddCategory}
                                // mutationPending={deleteCategoryMutation.isPending}
                            />
                        </View>
                    </View>
                </View>

                {
                    addCategoryMutation.isPending && <ActivityIndicator color={colors.primaryAccent500}></ActivityIndicator>
                }
            </View>
        </Modal>
    );
};

export default AddCategoryModal;

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