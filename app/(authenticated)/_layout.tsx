import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { useContext, useEffect, useState } from "react";

import { useRouter } from "expo-router";

import { Image, StyleSheet, Text, View } from "react-native";

// import context(s);
import { UserContext } from "@/context/UserContext";

// import component(s)
import AppBar from "../components/AppBar";
import AddCategoryModal from "../components/modals/category/AddCategoryModal";

// import icon(s)
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// import colors
import colors from "../constants/colors";

const CustomDrawerContent = (props: any) => {
    const router = useRouter();
    const navigation = props.navigation;

    const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
    const [activeItem, setActiveItem] = useState<string | null>("Home");

    const {
        handleSetUser, 
        handleSetTokens, 
        currentUser, 
        accessToken
    } = useContext(UserContext);

    const logOut = () => {
        handleSetUser(null);
        handleSetTokens("", "");
    };

    useEffect(() => {
        if(!currentUser || !accessToken){
            router.replace("/LoginScreen")
        }
    }, [currentUser, accessToken]);

    // console.log(currentUser);

    return (
        <DrawerContentScrollView {...props} style={styles.drawerContent}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Kitchenary</Text>
            </View>

            <View style={{marginVertical: 20,}}>
                <Text style={styles.textSecondary}>{currentUser && `Welcome back, ${currentUser.firstName}! 👋`}</Text>
            </View>

            <DrawerItem
                label="Home"
                labelStyle={
                    activeItem === "Home"
                    ? {color: "white", paddingLeft: 8} 
                    : {color: "black", paddingLeft: 8}
                }
                onPress={() => {
                    setActiveItem("Home");
                    navigation.navigate("HomeScreen")
                }}
                icon={({focused}) => <Feather name="home" size={24} color={focused ? colors.primaryAccent500 : "black"} />}
                style={
                    activeItem === "Home" 
                    ? {backgroundColor: colors.primaryAccent700} 
                    : {backgroundColor: colors.backgroundPrimary}
                }
            />

            <DrawerItem
                label="Profile"
                labelStyle={
                    activeItem === "Profile"
                    ? {color: "white",} 
                    : {color: "black",}
                }
                onPress={() => {
                    setActiveItem("Profile");
                    navigation.navigate("ProfilePage");
                }}
                icon={({focused}) => (
                    <View>
                        {
                            currentUser && currentUser.picture && (
                                <Image
                                    source={{uri: currentUser.picture}}
                                    style={{
                                        width: 32, 
                                        height: 32, 
                                        borderRadius: 16,
                                        backgroundColor: focused ? colors.primaryAccent900 : ""
                                    }}
                                    resizeMode="cover"
                                >
                                </Image>
                            )
                        }
                    </View>
                )}
                style={
                    activeItem === "Profile" 
                    ? {backgroundColor: colors.primaryAccent700} 
                    : {backgroundColor: colors.backgroundPrimary}
                }
            />

            <DrawerItem 
                label="Add a cuisine category"
                labelStyle={
                    activeItem === "Add a cuisine category"
                    ? {color: "white", paddingLeft: 8} 
                    : {color: "black", paddingLeft: 8}
                }
                onPress={() => {
                    setActiveItem("Add a cuisine category");
                    setShowAddCategoryModal(true)
                }}
                icon={({focused}) => <MaterialCommunityIcons name="silverware-fork-knife" size={24} color={focused ? colors.primaryAccent500 : "black"} />}
                // activeBackgroundColor={colors.primaryAccent900}
                // activeTintColor={colors.primaryAccent900}
                // inactiveBackgroundColor="white"
                style={
                    activeItem === "Add a cuisine category" 
                    ? {backgroundColor: colors.primaryAccent700} 
                    : {backgroundColor: colors.backgroundPrimary}
                }
            />

            
            <View style={styles.borderLine}></View>

            <DrawerItem
                label="Sign Out"
                onPress={logOut}
                icon={({focused}) => <Feather name="log-out" size={24} color={focused ? colors.primaryAccent500 : "black"} />}
            />
            
            {
                showAddCategoryModal && (
                    <AddCategoryModal setShowAddCategoryModal={setShowAddCategoryModal}></AddCategoryModal>
                )
            }
        </DrawerContentScrollView>
    )
};

const AuthenticatedLayout = () => {
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props}></CustomDrawerContent>}
            screenOptions={{
                // drawerActiveTintColor: colors.primaryAccent900,
                // drawerActiveBackgroundColor: colors.primaryAccent900,
                drawerStyle: {
                    width: 350,
                },
                header: ({navigation}) => <AppBar navigation={navigation}></AppBar>
            }}
        >

            <Drawer.Screen
                name="ProfilePage"
                options={{
                    title: "Profile Page",
                    drawerLabel: "Profile Page",
                }} 
            />

            <Drawer.Screen
                name="HomeScreen"
                options={{
                    title: "Home",
                    drawerLabel: "Home",
                    
                }} 
            />
        </Drawer>
    );
};

export default AuthenticatedLayout;

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        backgroundColor: colors.backgroundPrimary,
    },

    titleContainer: {
        marginVertical: 20,
    },

    titleText: {
        color: colors.primaryAccent900,
        fontWeight: "600",
        fontSize: 20,
    },

    textSecondary: {
        color: colors.primaryAccent800,
        fontWeight: "500"
    },

    borderLine: {
        borderWidth: 1,
        borderColor: colors.primaryAccent800,
        marginVertical: 20,
    },
});
