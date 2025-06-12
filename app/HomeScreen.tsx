import { StyleSheet, Text, View } from "react-native";

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text>I AM THE HOME SCREEN!</Text>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
    }
})