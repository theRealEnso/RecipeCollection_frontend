import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

//import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

// import component(s)
import CustomButton from "./components/CustomButton";
import FormInput from "./components/FormInput";

//import icon(s)
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import * as ImagePicker from "expo-image-picker";

// import utility function(s);
import { getFileType } from "@/utils/getFileType";

// import colors from "@/app/constants/colors";

//define types

type FormErrors = {
    dishName: string | null;
    level: string | null;
    cookingTime: string | null;
    servingSize: string | null;
}

const AddRecipeScreen = () => {
    const router = useRouter();
    
    const {
        recipeOwner,
        nameOfDish,
        difficultyLevel,
        timeToCook,
        numberOfServings,
        specialEquipment,
        setRecipeForm,
        selectedImageUrl,
        setBase64Url,
        setSelectedImageUrl,
        setSelectedImageName,
        setSelectedImageType,
        resetRecipeState
    } = useContext(RecipeContext);

    const [formErrors, setFormErrors] = useState<FormErrors>({
        dishName: null,
        level: null,
        cookingTime: null,
        servingSize: null,
    });

    const handleInputChange = (fieldName: string, value: string) => {
        setRecipeForm((previousState) => {
            return ({
                ...previousState,
                [fieldName]: value,
            });
        });
    };

    const pickImage = async () => {
        console.log("choose image button was pressed!");

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

    // console.log(selectedImageUrl);
    // console.log(selectedImageName);
    // console.log(selectedImageType);

    // function that validates required fields and then navigates to the next screen to continue adding the recipe ingredients
    const continueToAddIngredients = () => {
        const validationErrors: FormErrors = {
            dishName: null,
            level: null,
            cookingTime: null,
            servingSize: null,
        };

        if(!nameOfDish.trim()){
            validationErrors.dishName = "Missing required field!";
        };

        if(!difficultyLevel.trim()){
            validationErrors.level = "Missing required field!";
        };

        if(!timeToCook.trim()){
            validationErrors.cookingTime = "Missing required field!";
        };

        if(!numberOfServings.trim()){
            validationErrors.servingSize = "Missing required field!";
        };

        setFormErrors(validationErrors);

        const formHasErrors = Object.values(validationErrors).some(field => field !== null);

        if(!formHasErrors){
            router.push("/AddIngredientsScreen");
        };
    };

    // function that cancels recipe creation, resets recipe state, and navigates user back to Recipes Overview
    const cancelRecipeCreation = () => {
        router.replace("/RecipesOverviewScreen");
        resetRecipeState();
    };

    return (
        <ScrollView style={{flex: 1, position: "relative"}}>
            <View style={styles.container}>
                <View>
                    <View style={styles.inputContainer}>
                        <Text>Enter the name / title of your dish!</Text>
                        <FormInput 
                            placeholder="recipe title"  
                            value={nameOfDish} 
                            width={380}
                            onChangeText={(typedValue) => handleInputChange("nameOfDish", typedValue)} 
                        >
                        </FormInput>
                        {
                            formErrors.dishName && <Text style={styles.warning}>{formErrors.dishName}</Text>
                        }
                    </View>

                    <View style={styles.inputContainer}>
                        <Text>{`Enter name of recipe owner/creator (optional)`}</Text>
                        <FormInput 
                            placeholder="name of recipe owner (optional)"  
                            value={recipeOwner} 
                            width={380}
                            onChangeText={(typedValue) => handleInputChange("recipeOwner", typedValue)} 
                        >
                        </FormInput>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text>Enter the dish&apos;s difficulty level</Text>
                        <FormInput 
                            placeholder="e.g easy, intermediate, hard, etc"
                            value={difficultyLevel} 
                            width={380}
                            onChangeText={(typedValue) => handleInputChange("difficultyLevel", typedValue)} 
                        >
                        </FormInput>
                        {
                            formErrors.level && <Text style={styles.warning}>{formErrors.level}</Text>
                        }
                    </View>

                    <View style={styles.inputContainer}>
                        <Text>Enter estimated time to cook</Text>
                        <FormInput 
                            placeholder="e.g 1 hr 30 min"
                            value={timeToCook} 
                            width={380}
                            onChangeText={(typedValue) => handleInputChange("timeToCook", typedValue)}
                        >
                        </FormInput>

                        {
                            formErrors.cookingTime && <Text style={styles.warning}>{formErrors.cookingTime}</Text>
                        }
                    </View>

                    <View style={styles.inputContainer}>
                        <Text>{`(Optional) if any special equipment is required, then enter them separated by commas`}</Text>
                        <FormInput 
                            placeholder="e.g. pressure cooker, sous vide machine, pasta maker, etc  "
                            value={specialEquipment} 
                            width={380}
                            onChangeText={(typedValue) => handleInputChange("specialEquipment", typedValue)}
                        >
                        </FormInput>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text>Enter estimated amount of servings this recipe yields</Text>
                        <FormInput 
                            placeholder="e.g 3-4 servings"
                            value={numberOfServings} 
                            width={380}
                            onChangeText={(typedValue) => handleInputChange("numberOfServings", typedValue)} 
                        >
                        </FormInput>

                        {
                            formErrors.servingSize && <Text style={styles.warning}>{formErrors.servingSize}</Text>
                        }
                    </View>
                </View>
                
                {/* Button to select an image */}
                <View style={styles.selectImageContainer}>
                    <Text>Select a photo of your dish (optional)</Text>
                    <CustomButton 
                        value="Choose Image" 
                        width={150} 
                        radius={10} 
                        onButtonPress={pickImage}
                    >
                    </CustomButton>
                    {
                        selectedImageUrl && (
                            <View style={styles.imageContainer}>
                                <Pressable style={styles.iconContainer} onPress={() => setSelectedImageUrl("")}>
                                    <View>
                                        <MaterialIcons name="highlight-remove" size={32} color="black" />
                                    </View>
                                </Pressable>
                                <Image
                                    source={{ uri: selectedImageUrl }}
                                    style={{ width: 150, height: 150, marginTop: 20, borderRadius: 10 }}
                                />
                            </View>
                        )
                    }
                </View>
            </View>
            {/* button to go to next screen to continue the form */}
            <View style={styles.buttonsContainer}>
                <View style={styles.buttonContainer}>
                    <CustomButton value="Cancel" width={100} radius={20} onButtonPress={() => cancelRecipeCreation()}></CustomButton>
                </View>
                <View style={styles.buttonContainer}>
                    <CustomButton value="Next" width={100} radius={20} onButtonPress={continueToAddIngredients}></CustomButton>
                </View>
            </View>
        </ScrollView>
    );
};

export default AddRecipeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 3,
        paddingVertical: 60,
        paddingHorizontal: 20,
        marginTop: 40,
        // alignItems: "center",
        // justifyContent: "center",
    },

    inputContainer: {
        marginTop: 10,
        // height: 90,
    },

    buttonsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        // marginBottom: 20,
    },

    buttonContainer: {
        marginHorizontal: 5,
        marginVertical: 100,
        borderRadius: 20,
        width: 100,
    },

    warning: {
        color: "red",
    },

    selectImageContainer:{
        marginTop: 10,
        height: 100,
    },

    imageContainer: {
        position: "relative",
    },

    iconContainer: {
        position: "absolute",
        top: 20,
        left: 120,
        zIndex: 10,
        backgroundColor: "white",
        borderRadius: 20,
    }
});