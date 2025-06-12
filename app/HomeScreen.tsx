import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { UserContext } from "./context/UserContext";

const HomeScreen = () => {
    const router = useRouter();
    const {currentUser, setCurrentUser} = useContext(UserContext);

    const logOut = () => {
        setCurrentUser(null);
    };

    useEffect(() => {
        if(!currentUser || currentUser === null){
          router.replace("/LoginScreen");  
        }  
    }, [router, currentUser])

    return (
        <View style={styles.container}>
            <Text>I AM THE HOME SCREEN!</Text>
            <Button title="Sign out" onPress={logOut}></Button>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
    }
});