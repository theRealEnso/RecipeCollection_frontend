import { useLocalSearchParams, useRouter } from "expo-router";

import { Button, StyleSheet, Text, View } from "react-native";

const RecipesOverview = () => {
    const { categoryId, categoryName } = useLocalSearchParams();

    const router = useRouter(); 

    const returnToHomeScreen = () => {
        router.replace("/HomeScreen")
    };

    return (
        <View style={styles.container}>
            <Text>All recipes inside of your <Text>{categoryName}</Text> collection</Text>
            <Button title="Go back" onPress={returnToHomeScreen}></Button>
        </View>
    )
};

export default RecipesOverview;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 50,
    }
})