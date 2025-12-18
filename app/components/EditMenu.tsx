import { useContext, useState } from "react";

import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";

// import context(s)
import { UserContext } from "@/context/UserContext";

import Modal from "react-native-modal";

import colors from "../constants/colors";

// import icon(s)
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type EditMenuProps = {
    showEditMenu: boolean;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    userReviewId: string;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditMenu = ({showEditMenu, setShowMenu, userReviewId, setIsEditing, setShowDeleteModal}: EditMenuProps) => {
    const { currentUser } = useContext(UserContext);
    const {width: screenWidth} = useWindowDimensions();

    const [isEditPressed, setIsEditPressed] = useState<boolean>(false);
    const [isDeletePressed, setIsDeletePressed] = useState<boolean>(false);
    return (
        <View style={{flex: 1}}>
            <Modal
                isVisible={showEditMenu}
                style={{top: 350}}
            >
                <View style={[styles.menuContainer]}>
                    <View style={styles.optionsHeaderContainer}>
                        <Text style={styles.text}>Options</Text>

                        <Pressable onPress={() => setShowMenu(false)}>
                            <MaterialIcons name="cancel" size={30} color="white" />
                        </Pressable>
                    </View>

                    {
                        currentUser && currentUser.id === userReviewId ? (
                            <Pressable
                                onPressIn={() => setIsEditPressed(true)}
                                onPressOut={() => setIsEditPressed(false)}
                                onPress={() => {
                                    setShowMenu(false);
                                    setIsEditing(true);
                                }}
                                style={
                                    {
                                        height: 40, 
                                        marginVertical: 5, 
                                        backgroundColor: isEditPressed ? colors.textSecondary600 : colors.primaryAccent000,
                                        justifyContent: "center",
                                    }
                                }
                            >   
                                <View style={[styles.selectable,]}>
                                    <Entypo name="edit" size={18} color="white" style={{marginHorizontal: 5}} />
                                    <Text style={[styles.text, {marginHorizontal: 5}]}>Edit</Text>
                                </View>
                            </Pressable>
                        ) : null
                    }

                    {
                        currentUser && currentUser.id === userReviewId ? (
                            <Pressable
                                onPressIn={() => setIsDeletePressed(true)}
                                onPressOut={() => setIsDeletePressed(false)}
                                onPress={() => {
                                    setShowMenu(false);
                                    setShowDeleteModal(true);
                                }} 
                                style={
                                    {
                                        height: 40, 
                                        marginVertical: 5,
                                        backgroundColor: isDeletePressed ? colors.textSecondary600 : colors.primaryAccent000,
                                        justifyContent: "center",
                                    }
                                }
                            >
                                <View style={[styles.selectable,]}>
                                    <MaterialIcons name="delete" size={18} color="white" style={{marginHorizontal: 5}} />
                                    <Text style={[styles.text, {marginHorizontal: 5}]}>Delete</Text>
                                </View>
                            </Pressable>
                        ) : null 
                    }
                </View>
            </Modal>
        </View>
    );
};

export default EditMenu;

const styles = StyleSheet.create({
    menuContainer: {
        // flex: 1,
        borderRadius: 12,
        backgroundColor: colors.primaryAccent000,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },

    optionsHeaderContainer: {
        borderBottomWidth: 2, 
        borderBottomColor: "white", 
        padding: 10, 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: 10,
    },

    text: {
        color: "white",
        fontSize: 16,
    },

    selectable: {
        flexDirection: "row", 
        alignItems: "center",
    },
});