import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native";

// import { useRouter } from "expo-router";

//import component(s)
import CategoryTile from "./CategoryTile";
import CustomButton from "./CustomButton";

//import Modal component(s)
import AddCategoryModal from "./modals/category/AddCategoryModal";
import ConfirmDeletionModal from "./modals/category/ConfirmDeletionModal";
import EditCategoryModal from "./modals/category/EditCategoryModal";

// import icons
import Entypo from '@expo/vector-icons/Entypo';

// import types
import { Cuisine } from "@/types/Category";

type CategoriesData = {
    categoriesData: Cuisine[];
};

const CuisineList = ({categoriesData}: CategoriesData) => {

    const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);

    const handleLongPress = (id: string, categoryName: string) => {
        setSelectedTileId((previous) => previous === id ? null : id);
        setCategoryName(categoryName);
    };

    const displayAddModal = () => setShowAddCategoryModal(true);

    // console.log(selectedTileId);

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.listContainer}
        >
            <Pressable 
                onPress={() => setSelectedTileId(null)} 
                style={styles.pressable}
            >
                <FlatList
                    data={categoriesData}
                    numColumns={2}
                    renderItem={({item}) => (
                        <View style={styles.grid}>
                            <CategoryTile 
                                cuisineData={item} 
                                onLongPress={handleLongPress}
                                isSelected={item._id === selectedTileId}
                                setShowWarningModal={setShowWarningModal}
                                setShowEditModal={setShowEditModal}
                            >
                            </CategoryTile>
                        </View>
                    )} //renderItem gets called for every array element, represented as an object containing metadata. The `item` property inside this object contains the actual data that we need, which is each element inside of our categories array
                    keyExtractor={(item) => {
                        return item._id;
                    }}
                >
                </FlatList>

                <View style={styles.addButtonContainer}>
                    <CustomButton 
                        width={40} 
                        value={<Entypo name="add-to-list" size={24} color="#fff"></Entypo>}
                        onButtonPress={displayAddModal}
                    >
                    </CustomButton>
                </View>
            </Pressable>

            {
                showEditModal && (
                    <EditCategoryModal
                        categoryName={categoryName}
                        selectedTileId={selectedTileId}
                        setShowEditModal={setShowEditModal}
                    >
                    </EditCategoryModal>
                )
            }
            
            {
                showWarningModal && (
                    <ConfirmDeletionModal 
                        categoryName={categoryName}
                        selectedTileId={selectedTileId}
                        setShowWarningModal={setShowWarningModal}
                    >
                    </ConfirmDeletionModal>
                )
            }

            {
                showAddCategoryModal && (
                    <AddCategoryModal
                        setShowAddCategoryModal={setShowAddCategoryModal}
                    >
                    </AddCategoryModal>
                )
            }
        </KeyboardAvoidingView>
    );
};

export default CuisineList;

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
    }, 

    pressable: {
        flex: 1,
        // marginVertical: 20,
        paddingVertical: 30,
    },

    grid: {
        padding: 10,
        justifyContent: "space-between",
    },

    buttonOuterContainer: {
        borderRadius: 12,
        overflow: "hidden",
    },
    
    addButtonContainer: {
        borderRadius: 12,
        overflow: "hidden",
        flexDirection: "row",
        justifyContent: "flex-end",
        marginHorizontal: 30
    },
});