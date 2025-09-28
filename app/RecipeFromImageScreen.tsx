import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";

//import context(s)
import { RecipeContext } from "@/context/RecipeContext";
import { UserContext } from "@/context/UserContext";

import { generateRecipeFromImage } from "@/api/recipes";
import { useMutation } from "@tanstack/react-query";

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

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [navigationReady, setNavigationReady] = useState<boolean>(false);

    const { accessToken } = useContext(UserContext);
    
    const { 
        setBase64Url, 
        setSelectedImageUrl, 
        setSelectedImageName, 
        setSelectedImageType,
        selectedImageUrl, // use to display in Image tag to render image on device
        base64Url, // use to send to api endpoint that handles recipe generation
        setGeneratedRecipe,
        resetRecipeState
    } = useContext(RecipeContext);

    // function that allows user to pick an image, then store base 64 url in state
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

            // ** for cloudinary only **
            //need to add correct prefix in format that cloudinary will accept
            // const base64WithPrefix = `data:${fileType};base64,${base64_url}`;

            setBase64Url(base64_url as string);
            setSelectedImageUrl(uri);
            setSelectedImageName(imageName as string);
            setSelectedImageType(fileType);
        }
    };

    const generateRecipeFromImageMutation = useMutation({
        mutationFn: ({accessToken, base64Url} : {accessToken: string, base64Url: string}) => generateRecipeFromImage(accessToken, base64Url),
        onSuccess: (data) => {
            // console.log(data);
            console.log(data.recipe);
            setGeneratedRecipe(data.recipe);
            setIsLoading(false);
            setNavigationReady(true);
        },
        onError: (error) => {
            console.error(error)
        }
    });

    // function to send base 64 image url to back end api endpoint
    const generateRecipe = async () => {
        try {
            setIsLoading(true);
            generateRecipeFromImageMutation.mutate({accessToken, base64Url})
        } catch(error){
            console.error(error);
        }
    };

    useEffect(() => {
        if(navigationReady){
            router.push("/RecipeGeneratedScreen");
            setNavigationReady(false);
        }
    }, [router, navigationReady]);

    // console.log(base64Url);

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
                                    value={
                                        isLoading ? 
                                        <ActivityIndicator size="small" color="white"></ActivityIndicator>
                                        : "Generate Recipe!"
                                    }
                                    width={150}
                                    radius={5}
                                    onButtonPress={generateRecipe}
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
                    onButtonPress={() => {
                        resetRecipeState();
                        router.back()
                    }}
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