import { useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";

//import context(s)
import { RecipeContext } from "@/context/RecipeContext";
import { UserContext } from "@/context/UserContext";

import { getGeneratedRecipeResult, getRecipeGenerationJobStatus, startRecipeGenerationJob } from "@/api/recipes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//import component(s)
import CustomButton from "./components/CustomButton";
import UploadSpinnerModal from "./components/modals/spinnerModal";

import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

// import icon(s)
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// import utility function(s)
import { getFileType } from "@/utils/getFileType";

const POLL_TIMEOUT = 60 * 1000 * 2; // 2 minutes

const RecipeFromImageScreen = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const[jobId, setJobId] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [navigationReady, setNavigationReady] = useState<boolean>(false);

    const pollStartedAtRef = useRef<number>(0); // use this ref to track global timer
    const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // timer for polling

    const { accessToken } = useContext(UserContext);
    
    const { 
        setBase64Url, 
        setSelectedImageUrl, 
        setSelectedImageName, 
        setSelectedImageType,
        setSelectedImageSize,
        selectedImageUrl, // use to display in Image tag to render image on device
        selectedImageSize,
        base64Url, // use to send to api endpoint that handles recipe generation
        setRecipe,
        resetRecipeState
    } = useContext(RecipeContext);

    // function that allows user to pick an image, then store base 64 url in state
    const pickImage = async () => {
        console.log("choose image button was pressed!");

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== "granted"){
            alert("Permission to access media library is required!");
            return;
        };

        const result = await ImagePicker.launchImageLibraryAsync({
            base64: false,
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        // console.log(result);

        if(!result.canceled){
            const asset = result.assets[0];
            // console.log(asset);
            const base64_url = asset.base64;
            const fileUri = asset.uri; // local uri link
            const imageName = asset.fileName || fileUri.split("/").pop();
            const originalFileType = getFileType(fileUri);

            //if sending base64 to cloudinary, then we need to add correct prefix to the base64 string so that it is in a format that cloudinary will accept
            const base64WithPrefix = `data:${originalFileType};base64,${base64_url}`;

            const imageContext = ImageManipulator.ImageManipulator.manipulate(fileUri);
            imageContext.resize({
                width: 1200,
            });

            const renderedImage = await imageContext.renderAsync();
            const finalImage = await renderedImage.saveAsync({
                compress: 0.7,
                format: ImageManipulator.SaveFormat.JPEG,
                base64: true,
            });

            const modifiedFileType = getFileType(finalImage.uri);
            const originalFileData = await FileSystem.getInfoAsync(fileUri);

            console.log(originalFileData);

            const originalFileSize = originalFileData.size;
            console.log(originalFileSize);

            // console.log("the original file uri is: ", fileUri);
            // console.log("the modified and compressed file uri is: ", finalImage);
    
            setBase64Url(finalImage.base64 as string);
            setSelectedImageUrl(finalImage.uri);
            setSelectedImageName(imageName as string);
            setSelectedImageType(modifiedFileType);
            setSelectedImageSize(originalFileSize);
        }
    };

    const recipeGenerationStatusQuery = useQuery({
        queryKey: ["jobStatus", jobId], // initially created with empty jobId
        queryFn: () => getRecipeGenerationJobStatus(accessToken, jobId),
        enabled: false, // tell react query to not automatically fetch, we will manually control
    });

    // define mutation to start the recipe generation job
    const startRecipeGenerationMutation = useMutation({
        mutationFn: () => startRecipeGenerationJob(accessToken, base64Url),
        onSuccess: (data) => {
            console.log(data)
            // setJobId(data.job_id);
            // need to write some code that starts polling the server continuously
            startPollingForUpdates(data.job_id);
        },
        onError: (error: any) => {
            setUploadProgress(null);
            console.log(error);
        }
    });

    // define helper polling function(s)

    const startPollingForUpdates = async (jobId: string) => {
        // needs to continuously poll the server
        //for sure needs to make get requests to the endpoint that provides the update(s)

        pollStartedAtRef.current = Date.now();

        const poll = async () => {
            // stop polling altogether if the recipe generation takes longer than 2 minutes
            if(Date.now() - pollStartedAtRef.current > POLL_TIMEOUT ) {
                stopPollingForUpdates();
                setUploadProgress(null);
                return;
            };

            console.log("starting poll with jobId of: ", jobId); // correctly logs the right job id...

            // const { data } = await recipeGenerationStatusQuery.refetch(); //issue(?) useQuery initializes with jobId from state, which starts off as an empty string (?) and makes request with empty string instead of the correct jobId (?);

            const statusUpdate = await queryClient.fetchQuery({
                queryKey: ["jobStatus", jobId],
                queryFn: () => getRecipeGenerationJobStatus(accessToken, jobId),
                staleTime: 0,
            });

            console.log(statusUpdate);

            const { phase, progress } = statusUpdate;

            console.log("current phase is: ", phase);
            console.log("current progress is: ", progress);

            setUploadProgress(progress);

            if(phase === "completed"){
                //stop polling
                stopPollingForUpdates();

                // get the recipe from our API endpoint, store the recipe in state
                const generatedRecipe = await getGeneratedRecipeResult(accessToken, jobId);
                // console.log(generatedRecipe);
                setIsLoading(false);
                setUploadProgress(100);
                setRecipe(generatedRecipe.recipe);
                setNavigationReady(true);
                return;
            };

            if(phase === "error"){
                // stop polling
                stopPollingForUpdates();
                setUploadProgress(null);
            };

            pollTimerRef.current = setTimeout(poll, 500);
        }

        poll();
    };

        const stopPollingForUpdates = () => {
        if(pollTimerRef.current){
            clearTimeout(pollTimerRef.current);
            pollTimerRef.current = null;
        };
    };

    // function to send base 64 image url to back end api endpoint
    const generateRecipe = async () => {
        try {
            setIsLoading(true);
            setUploadProgress(0);
            startRecipeGenerationMutation.mutate();

        } catch(error){
            console.error(error);
        }
    };

    useEffect(() => {
        if(navigationReady){
            setTimeout(() => {
                router.push("./RecipeGeneratedScreen");
                setNavigationReady(false);
                setUploadProgress(null);
            }, 2000)
        }
    }, [router, navigationReady]);

    //cleanup to stop polling when component unmounts
    useEffect(() => {
        return () => stopPollingForUpdates();
    }, []);

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

            {/* conditionally render progress bar modal */}
            {
                uploadProgress !== null && (
                    <View>
                        <UploadSpinnerModal 
                            percentCompleted={uploadProgress}
                            value="Generating a recipe..."
                            >

                        </UploadSpinnerModal>
                    </View>
                )
            }
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

///////////////////////////////////////////////////////////////////////////////////////////////////////

// const generateRecipeFromImageMutation = useMutation({
//         mutationFn: (
//             {
//                 accessToken,
//                 base64Url, 
//                 selectedImageSize,
//                 updateProgress, 
//             } : {
//                     accessToken: string,
//                     base64Url: string, 
//                     selectedImageSize: number, 
//                     updateProgress: (percent: number) => void,
//                 }
//             ) => generateRecipeFromImage(accessToken, base64Url, selectedImageSize, updateProgress),
//         onSuccess: (data) => {
//             // console.log(data);
//             setUploadProgress(null);
//             console.log(data.recipe);
//             setRecipe(data.recipe);
//             setIsLoading(false);
//             setNavigationReady(true);
//         },
//         onError: (error) => {
//             setIsLoading(false);
//             console.error(error)
//         }
//     });