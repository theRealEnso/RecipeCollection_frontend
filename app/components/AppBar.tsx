import { useRouter } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import icon(s)
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

//import colors
import colors from "../constants/colors";


const AppBar = ({navigation}) => {
    const router = useRouter();

    const navigateToAIOptionsScreen = () => {
        router.push("./AIOptionsScreen")
    };

    return (
        <SafeAreaView style={{backgroundColor: colors.backgroundPrimary}}>
            <View style={styles.bar}>
                {/* menu / hamburger icon */}
                <Pressable
                    onPress={() => navigation.toggleDrawer()}
                    >
                    <Feather name="menu" size={24} color={colors.secondaryAccent500} />
                </Pressable>

                <Text style={styles.title}>Kitchenary</Text>

                {/* robot icon */}
                <Pressable
                    onPress={navigateToAIOptionsScreen}
                >
                    <MaterialCommunityIcons name="robot-excited" size={24} color={colors.primaryAccent500} />
                </Pressable>
            </View>


        </SafeAreaView>
    );
};

export default AppBar;

const styles = StyleSheet.create({
    bar: {
        backgroundColor: colors.backgroundPrimary,
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        // shadow effects
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 8,
                shadowOffset: {width: 0, height: 4},
            },
            android: {
                elevation: 6,
            }
        })
    },

    title: {
        color: colors.textPrimary500,
    }
});