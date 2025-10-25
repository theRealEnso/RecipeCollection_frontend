import { StyleSheet, Text, View } from "react-native";

const ProfilePage = () => {
    return (
        <View style={styles.outerContainer}>
            <Text>I AM THE PROFILE PAGE!</Text>
        </View>
    )
};

export default ProfilePage;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    }
});
