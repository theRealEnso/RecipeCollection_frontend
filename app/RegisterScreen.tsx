import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

//import user context
import { RecipeContext } from '@/context/RecipeContext';
import { UserContext } from '../context/UserContext';

import * as FileSystem from "expo-file-system";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";

// import colors
import colors from './constants/colors';

// import component(s)
import CustomButton from './components/CustomButton';

//import icon(s)
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

//import api function to register user
import { useMutation } from '@tanstack/react-query';
import { registerNewUser, } from '../api/userAuth';

// import utility function(s)
import { getFileType } from '@/utils/getFileType';

import { AUTH_ENDPOINT } from '../api/userAuth';

//define form types 
type FormErrors = {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    password?: string | null;
    confirmPassword?: string | null;
    profilePicture: string | null;
};

export type UserData = FormErrors;

const RegisterScreen = () => {

  const router = useRouter();
  const [navigationReady, setNavigationReady] = useState<boolean>(false);

  const {
    handleSetUser, 
    handleSetTokens, 
    setIsTokenVerified,
    currentUser,
    accessToken,
  } = useContext(UserContext);

  const { 
    setBase64Url, 
    setSelectedImageUrl, 
    setSelectedImageName, 
    setSelectedImageSize, 
    setSelectedImageType,
    selectedImageUrl,
    selectedImageSize,
    selectedImageName,
    selectedImageType,
    resetRecipeState 
  } = useContext(RecipeContext);

  const [formInputs, setFormInputs] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profilePicture: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      confirmPassword: null,
      profilePicture: null,
  });

  const {firstName, lastName, email, password, confirmPassword, profilePicture} = formInputs;

  useEffect(() => {
    if(navigationReady && accessToken && currentUser !== null ){
      router.replace("/(authenticated)/HomeScreen");
    }
  }, [navigationReady, router, accessToken, currentUser]);

  //helper function to upload image + sign preset to cloudinary, ultimately to get a secure_url
  const uploadToCloudinarySigned = async (
      selectedImageUrl: string,
      signature: string,
      timestamp: number,
      apikey: string,
      cloudname: string,
      uploadPreset: string,
      folder: string,
  ) => {
      try {
          const formData = new FormData();
          formData.append("file", {uri: selectedImageUrl, name: selectedImageName, type: selectedImageType} as any);
          formData.append("api_key", apikey);
          formData.append("timestamp", timestamp.toString());
          formData.append("upload_preset", uploadPreset);
          formData.append("signature", signature);
          formData.append("folder", folder)

          const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${cloudname}/image/upload`, formData, { 
              headers: { "Content-Type": "multipart/form-data" },
          });

          return data;
      } catch(error: any){
          if (axios.isAxiosError(error)) {
              console.error("Cloudinary error response:", error.response?.data); // actual message
              console.error("Cloudinary error status:", error.response?.status); // 400
          } else {
              console.error("Unexpected error:", error);
          }

          throw error; // rethrow so React Query / caller can still catch it
      }
  };

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
          base64: false,
      });

      const modifiedFileType = getFileType(finalImage.uri);
      const originalFileData = await FileSystem.getInfoAsync(fileUri);
      // console.log(originalFileData);
      const originalFileSize = originalFileData.size;
      // console.log(originalFileSize);
      // console.log(typeof(originalFileSize));

      // console.log("the original file uri is: ", fileUri);
      // console.log("the modified and compressed file uri is: ", finalImage);

      setBase64Url(base64WithPrefix);
      setSelectedImageUrl(finalImage.uri);
      setSelectedImageName(imageName as string);
      setSelectedImageType(modifiedFileType);
      setSelectedImageSize(originalFileSize);
    }
  };

  const registerUserWithCloudinaryUrl = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get(`${AUTH_ENDPOINT}/get-cloudinary-signature-profile-pic`);

      const {
        timestamp,
        signature,
        apikey,
        cloudname,
        uploadPreset,
        folder,
      } = data;

      return uploadToCloudinarySigned(selectedImageUrl, signature, timestamp, apikey, cloudname, uploadPreset, folder);
    },
    onSuccess: (data) => {
      if(data?.secure_url){
        registerUser.mutate({
          ...formInputs,
          profilePicture: data.secure_url,
        })
      }
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const registerUser = useMutation({
      mutationFn: registerNewUser,
      onSuccess: (data) => {
        if(data){
          // console.log("User created:", data);
          handleSetTokens(data.access_token, data.refresh_token);
          handleSetUser(data.user);
          setIsTokenVerified(true);
          setNavigationReady(true);
          resetRecipeState();
        };
      },
      onError: (error) => {
          console.error("Error:", error)
      }
  });

  // function to handle input changes on form
  const handleInputChange = (field: string, value: string): void => {
      setFormInputs((previousState) => ({
          ...previousState,
          [field]: value,
      }));
  };

  //function to handle form submission + perform validation
  const handleFormSubmission = () => {
      const validationErrors: FormErrors = {
          firstName: null,
          lastName: null,
          email: null,
          password: null,
          confirmPassword: null,
          profilePicture: null,
      };

      if(!firstName.trim()){
          validationErrors.firstName = "First name is required!";
      };

      if(firstName.length < 2 || firstName.length > 24){
          validationErrors.firstName = "First name must be between 2 and 24  characters!";
      }

      if(!lastName.trim()){
          validationErrors.lastName = "Last name is required!";
      };

      if(lastName.length < 2 || lastName.length > 24){
          validationErrors.lastName = "Last name must be between 2 and 24 characters!";
      };

      if(!email.trim()){
          validationErrors.email = "Email address is required!";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          validationErrors.email = "Invalid email address!";
      };

      if(password.length < 8 || password.length > 32){
          validationErrors.password = "Password must be between 8 and 32 characters long!";
      };

      if(confirmPassword.length < 8 || confirmPassword.length > 32){
          validationErrors.confirmPassword = "Password must be between 8 and 32 characters long!";
      };

      if(password !== confirmPassword){
          validationErrors.password = "Passwords do not match!";
          validationErrors.confirmPassword = "Passwords do not match!";
      };

      setFormErrors(validationErrors);

      //check to see if there were any validation errors. If no errors, then try registering the user
      const hasErrors = Object.values(formErrors).some((value) => value !== null);

      //register user if there are no errors
      if(!hasErrors){
        if(selectedImageUrl && selectedImageUrl.length){
          registerUserWithCloudinaryUrl.mutate()
        } else {
          registerUser.mutate({...formInputs, profilePicture: process.env.EXPO_PUBLIC_DEFAULT_PROFILE_PICTURE as string })
        }
      }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <StatusBar style="dark"></StatusBar>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>CozyKitch</Text>
          <Text style={{color: colors.primaryAccent500}}>A place to store your favorite recipes!</Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image source={require("../assets/images/mariana-medvedeva-iNwCO9ycBlc-unsplash.jpg")} style={styles.image}></Image>
        </View>

        <View style={styles.inputContainer}>
          {
            formErrors.firstName && <Text style={styles.errorText}>{formErrors.firstName}</Text>
          }
          <TextInput 
              style={styles.text} 
              placeholder="First Name" 
              value={firstName}
              onChangeText={(value) => handleInputChange("firstName", value)}
              keyboardType='default'
          />
        </View>

        <View style={styles.inputContainer}>
          {
            formErrors.lastName && <Text style={styles.errorText}>{formErrors.lastName}</Text>
          }
          <TextInput 
            style={styles.text} 
            placeholder="Last Name" 
            value={lastName} 
            onChangeText={(value) => handleInputChange("lastName", value)}
            keyboardType="default"
          />
        </View>

        <View style={styles.inputContainer}>
          {
            formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>
          }
          <TextInput 
            style={styles.text} 
            placeholder="Email" 
            value={email} 
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="default"
          />
        </View>

        <View style={styles.inputContainer}>
          {
            formErrors.password && <Text style={styles.errorText}>{formErrors.password}</Text>
          }
          <TextInput 
            style={styles.text} 
            placeholder="Password" 
            value={password} 
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry={true} // equivalent of type="password" for input elements in web dev
            keyboardType="default"
          />
        </View>

        <View>
          {
            formErrors.confirmPassword && <Text style={styles.errorText}>{formErrors.confirmPassword}</Text>
          }
          <TextInput 
            style={styles.text} 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChangeText={(value) => handleInputChange("confirmPassword", value)}
            secureTextEntry={true} // equivalent of type="password" for input elements in web dev
            keyboardType="default"
          />
        </View>

        {/* Button to select an image */}
        <View style={styles.selectImageContainer}>
            <Text>Select a profile picture (optional)</Text>
            <CustomButton 
                value="Choose Image" 
                width={120} 
                radius={10} 
                onButtonPress={pickImage}
            >
            </CustomButton>
            {
                selectedImageUrl && (
                    <View style={styles.profilePictureContainer}>
                        <Pressable style={styles.iconContainer} onPress={() => setSelectedImageUrl("")}>
                            <View>
                                <MaterialIcons name="highlight-remove" size={20} color="black" />
                            </View>
                        </Pressable>
                        <Image
                            source={{ uri: selectedImageUrl }}
                            style={{ width: 50, height: 50, marginTop: 20, borderRadius: 10 }}
                        />
                    </View>
                )
            }
        </View>

        <View style={styles.buttonOuterContainer}>
          <CustomButton 
            value="Register"
            width={250} 
            mutationPending={registerUser.isPending} 
            onButtonPress={handleFormSubmission}>
          </CustomButton>
        </View>
      

        <View style={styles.subTextContainer}>
          <Text>Already have an account?</Text>
          <Link href="./LoginScreen" style={styles.registerText}>Login!</Link>
        </View>
      </View>

    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 5,
  },

  innerContainer: {
    flex: 1,
    maxWidth: "80%",
    alignItems: "center",
    justifyContent: "center",
  },

  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },

  imageContainer: {
    height: 150,
    width: 150,
    borderWidth: 2,
    borderColor: colors.primaryAccent500,
    borderRadius: 75,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    objectFit: "cover",
  },

  image: {
    height: 150,
    width: 150,
  },

  inputContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },

  buttonOuterContainer: {
    overflow: "hidden",
    borderRadius: 12,
    marginTop: 5,
  },

  subTextContainer: {
    paddingVertical: 5,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: colors.primaryAccent500,
    fontSize: 24,
    marginBottom: 10,
  },

  text: {
    color: colors.textPrimary600,
    width: 250,
    borderWidth: 2,
    marginVertical: 3,
    borderRadius: 8,
    borderColor: colors.textPrimary600,
    height: 40,
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },

  registerText: {
    textDecorationLine: "underline",
    fontWeight: "bold",
    marginVertical: 5,
  },

  errorText: {
    color: "red",
  },

  selectImageContainer:{
    marginTop: 10,
    marginBottom: 25,
    height: 100,
    width: 250,
  },

  profilePictureContainer: {
    position: "relative",

  },

  iconContainer: {
    position: "absolute",
    top: 20,
    left: 30,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 20,
  },

});