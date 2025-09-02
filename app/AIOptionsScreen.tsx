import { StyleSheet, View } from "react-native";

import { useRouter } from "expo-router";

// import component(s)
import CustomButton from "./components/CustomButton";

// import icon(s)
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const AIOptionsScreen = () => {
    const router = useRouter();

    const navigateToGenerateRecipeFromImage = () => {
        router.push("/RecipeFromImageScreen")
    };

    return (
        <View style={styles.outerContainer}>
            <View style={styles.selectablesContainer}>
                <View style={styles.selectable}>
                    <View style={{marginHorizontal: 5}}>
                        <FontAwesome5 name="hand-point-right" size={24} color="black" />
                    </View>
                    <View style={{marginHorizontal: 5}}>
                        <CustomButton
                            value="Recreate a recipe based on an image of a dish you select from your device"
                            width={300}
                            textSize={20}
                            onButtonPress={navigateToGenerateRecipeFromImage}
                        >
                        </CustomButton>
                    </View>
                </View>
                <View style={styles.selectable}>
                    <View style={{marginHorizontal: 5}}>
                        <FontAwesome5 name="hand-point-right" size={24} color="black" />
                    </View>
                    <View style={{marginHorizontal: 5}}>
                        <CustomButton
                            value="Try a creative recipe suggestion based off of ingredients you currently have in your fridge/pantry!"
                            width={300}
                            textSize={20}
                            textPadding={10}
                        >
                        </CustomButton>
                    </View>
                </View>
            </View>


            {/* navigation buttons */}
            <View style={styles.buttonsContainer}>
                <CustomButton
                    value="Return to Home"
                    width={120}
                    onButtonPress={() => router.back()}
                >
                </CustomButton>
            </View>
        </View>
    )
};

export default AIOptionsScreen;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    selectablesContainer: {
        marginVertical: 40,
        // paddingVertical: 80,
        alignItems: "center",
        justifyContent: "center",
        flex: 12,
        // borderColor: "red",
        // borderWidth: 2
    },
    

    selectable: {
        flexDirection: "row",
        marginVertical: 20,
    },

    text: {
        fontSize: 24,
    },

    buttonsContainer: {
        flex: 1,
    }
});