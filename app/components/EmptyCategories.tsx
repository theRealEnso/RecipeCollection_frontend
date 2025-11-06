import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

// import component(s)
import React from "react";
import CustomButton from "./CustomButton";

// import context(s)
import { RecipeContext } from "@/context/RecipeContext";
import { UserContext } from "@/context/UserContext";

// import icon(s)
import Entypo from '@expo/vector-icons/Entypo';

// import colors
import colors from "../constants/colors";

type ShowAddCategoryModal = {
    setShowAddCategoryModal: React.Dispatch<React.SetStateAction<boolean>>
};

const EmptyCategories = ({setShowAddCategoryModal}: ShowAddCategoryModal) => {
    const { handleSetUser, handleSetTokens } = useContext(UserContext);
    const { resetRecipeState } = useContext(RecipeContext);

    const displayAddModal = () => setShowAddCategoryModal(true);

    const logOut = () => {
        handleSetUser(null);
        handleSetTokens("", "");
        resetRecipeState();
    };
    
    return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <View style={styles.contentContainer}>

                {/* empty message container */}
                <View style={styles.messageContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>You currently do not have any cuisine categories added.</Text>
                    </View>

                    <View style={{marginVertical: 20,}}>
                        <Entypo name="emoji-sad" size={100} color={colors.secondaryAccent500} />
                    </View>

                    <View style={styles.textContainer}>
                         <Text style={styles.text}>Press the button below to start adding categories!</Text>
                    </View>
                </View>



                {/* buttons container */}
                <View style={styles.buttonsContainer}>
                    <View style={{marginVertical: 10, marginHorizontal: 30}}>
                        <CustomButton 
                            width={150} 
                            value="Add Category"
                            onButtonPress={displayAddModal}
                            radius={75}
                        >
                        </CustomButton>
                    </View>
                    <View style={{marginVertical: 10, marginHorizontal: 30}}>
                        <CustomButton 
                            width={100} 
                            value="Sign out"
                            onButtonPress={logOut}
                            radius={50}
                            color={colors.secondaryAccent500}
                        >
                        </CustomButton>
                    </View>
                </View>
            </View>
        </View> 
    );
};

export default EmptyCategories;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    contentContainer: {
        alignItems: "center",
        justifyContent: "center",
    },

    messageContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20, 
        marginVertical: 10, 
        flex: 9,
    },

    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
    },

    textContainer: {
        marginVertical: 20,
        padding: 10,
    },

    text: {
        color: colors.primaryAccent900,
        fontWeight: "bold",
        fontSize: 24,
    }
})