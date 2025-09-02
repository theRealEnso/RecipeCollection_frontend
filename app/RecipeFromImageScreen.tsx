import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

//import context(s)
import { RecipeContext } from "@/context/RecipeContext";

//import component(s)
import CustomButton from "./components/CustomButton";

import * as ImagePicker from "expo-image-picker";

// import icon(s)
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// import utility function(s)
import { getFileType } from "@/utils/getFileType";

const RecipeFromImageScreen = () => {
    const router = useRouter();
    
    const { 
        setBase64Url, 
        setSelectedImageUrl, 
        setSelectedImageName, 
        setSelectedImageType,
        selectedImageUrl,
    } = useContext(RecipeContext);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== "granted"){
            alert("Permission to access media library is required!");
            return;
        };

        const result = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        if(!result.canceled){
            const asset = result.assets[0];
            // console.log(asset);
            const base64_url = asset.base64;
            const uri = asset.uri; // local uri link
            const imageName = asset.fileName || uri.split("/").pop();
            const fileType = getFileType(uri);

            //need to add correct prefix in format that cloudinary will accept
            const base64WithPrefix = `data:${fileType};base64,${base64_url}`;

            setBase64Url(base64WithPrefix);
            setSelectedImageUrl(uri);
            setSelectedImageName(imageName as string);
            setSelectedImageType(fileType);
        }
    };

    // function to send base 64 image url to back end api endpoint
    return (
        <View style={styles.container}>
            <View style={styles.mainContent}>
                <View>
                    <View style={styles.iconContainer}>
                        <FontAwesome5 name="hand-point-down" size={24} color="black" />
                        <FontAwesome5 name="hand-point-down" size={24} color="black" />
                        <FontAwesome5 name="hand-point-down" size={24} color="black" />
                        <FontAwesome5 name="hand-point-down" size={24} color="black" />
                        <FontAwesome5 name="hand-point-down" size={24} color="black" />
                        <FontAwesome5 name="hand-point-down" size={24} color="black" />
                    </View>
                    <CustomButton
                        value="Select an image from your device"
                        width={250}
                        radius={125}
                        onButtonPress={pickImage}
                    >
                    </CustomButton>
                </View>
                
                {/* display sekected image */}
                {
                    selectedImageUrl && (
                        <View style={styles.imageContainer}>
                            <Pressable style={styles.removeIconContainer} onPress={() => setSelectedImageUrl("")}>
                                <View>
                                    <MaterialIcons name="highlight-remove" size={32} color="black" />
                                </View>
                            </Pressable>
                            <Image
                                source={{ uri: selectedImageUrl }}
                                style={{ width: 150, height: 150, marginTop: 20, borderRadius: 10 }}
                            />

                            <View style={{marginVertical: 20}}>
                                <CustomButton
                                    value="Generate Recipe!"
                                    width={150}
                                    radius={5}
                                >
                                </CustomButton>
                            </View>
                        </View>
                    )
                }


            </View>

            <View style={styles.buttonContainer}>
                <CustomButton
                    value="Go back"
                    width={100}
                    radius={50}
                    onButtonPress={() => router.back()}
                >

                </CustomButton>
            </View>
        </View>
    );
};

export default RecipeFromImageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    mainContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginVertical: 15,
    },

    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },

    imageContainer: {
        position: "relative",
    },

    removeIconContainer: {
        position: "absolute",
        top: 20,
        left: 120,
        zIndex: 10,
        backgroundColor: "white",
        borderRadius: 20,
    }
});