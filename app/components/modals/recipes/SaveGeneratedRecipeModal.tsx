import { useContext, useState, } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, View } from "react-native";

// import context(s)
import { UserContext } from "@/context/UserContext";

import { getAllCategories } from "@/api/categories";
import { useQuery } from "@tanstack/react-query";

// import component(s)
import CustomButton from "../../CustomButton";

// import icon(s)
import Fontisto from '@expo/vector-icons/Fontisto';

type SetShowSaveModalProps = {
    setShowSaveModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const SaveGeneratedRecipeModal = ({setShowSaveModal}: SetShowSaveModalProps) => {
    const { accessToken } = useContext(UserContext);

    const [categoryId, setCategoryId] = useState<string>("");

    const { data } = useQuery({
        queryKey: ["userCategories"],
        queryFn: () => getAllCategories(accessToken),
    });

    return (
        <Modal
            animationType="fade"
            transparent={false}
            visible={true}
        >
            <View style={styles.outerContainer}>
                {
                    data && data.categories.length > 0 && (
                        <View style={styles.innerContainer}>
                            <Text>Select which category to save the recipe to</Text>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={data.categories}
                                keyExtractor={(item) => item._id}
                                renderItem={({item}) => {
                                return (
                                    <View style={styles.mainContent}>
                                        <View style={styles.item}>
                                            <View style={{marginHorizontal: 5}}>
                                                <Fontisto name="checkbox-passive" size={24} color="black" />
                                            </View>
                                            <View style={{marginHorizontal: 5}}>
                                                <Text>{item.cuisineName}</Text>
                                            </View>
                                            
                                        </View>
                                    </View>
                                )
                            }}
                            >
                            </FlatList>

                            <View style={styles.messageContainer}>
                                
                                <Text>{`Don't see one listed?`}</Text>
                                <Text>{`Type in a new category below and we'll create it it for you and save the recipe to that category`}</Text>
                                
                                <View style={{marginVertical: 20,}}>
                                    <TextInput style={{borderWidth: 2, width: 200, borderRadius: 10}}></TextInput>
                                </View>
                                    
                            </View>
                        </View>
                    )
                }
                {/* buttons */}
                <View style={styles.buttonsContainer}>
                    <View>
                        <CustomButton
                            value="Cancel"
                            width={100}
                            onButtonPress={() => setShowSaveModal(false)}
                        ></CustomButton>
                    </View>
                    <View>
                        <CustomButton
                            value="Confirm"
                            width={100}
                            onButtonPress={() => setShowSaveModal(false)}
                        ></CustomButton>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default SaveGeneratedRecipeModal;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },

    innerContainer: {
        alignItems: "center",
        justifyContent: "center",
    },

    mainContent: {
        alignItems: "center",
        justifyContent: "center",
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },

    messageContainer: {
        alignItems: "center",
        
    },

    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 30,
    }
});