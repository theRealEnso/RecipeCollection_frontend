import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

// import components

// import colors
import colors from './constants/colors';

//import api function to register user
import { useMutation } from '@tanstack/react-query';
import { registerUser } from './api/userAuth';

//define form types 
type FormErrors = {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
};

export type UserData = FormErrors;

const RegisterScreen = () => {
    const [formInputs, setFormInputs] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        confirmPassword: null,
    });

    const {firstName, lastName, email, password, confirmPassword} = formInputs;

    const registerUserMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            console.log("User created:", data)
        },
        onError: (error) => {
            console.error("Error:", error)
        }
    })

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
            validationErrors.password = "Password must be between 8 and 32 characters long!";
        };

        if(password !== confirmPassword){
            validationErrors.password = "Passwords do not match!";
            validationErrors.confirmPassword = "Passwords do not match!";
        };

        setFormErrors(validationErrors);

        //check to see if there were any validation errors. If no errors, then try registering the user
        const hasErrors = Object.values(formErrors).some((value) => value !== null);

        if(!hasErrors){
            try {
                registerUserMutation.mutate({...formInputs});
            } catch(error){
                console.error(error);
            }
        };
    };

  return (
    <View style={styles.container}>
      <StatusBar style="dark"></StatusBar>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>CozyKitch</Text>
        <Text style={{color: colors.primaryAccent500}}>A place to store your favorite recipes!</Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image source={require("../assets/images/mariana-medvedeva-iNwCO9ycBlc-unsplash.jpg")} style={styles.image}></Image>
      </View>

      <View style={styles.loginContainer}>
        <TextInput 
            style={styles.text} 
            placeholder="First Name" 
            value={firstName} 
            onChangeText={(value) => handleInputChange("firstName", value)}
            keyboardType='default'
        />

        <TextInput 
            style={styles.text} 
            placeholder="Last Name" 
            value={lastName} 
            onChangeText={(value) => handleInputChange("lastName", value)}
            keyboardType="default"
        />
        <TextInput 
            style={styles.text} 
            placeholder="Email" 
            value={email} 
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="default"
        />
        <TextInput 
            style={styles.text} 
            placeholder="Password" 
            value={password} 
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry={true} // equivalent of type="password" for input elements in web dev
            keyboardType="default"
        />
        <TextInput 
            style={styles.text} 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChangeText={(value) => handleInputChange("confirmPassword", value)}
            secureTextEntry={true} // equivalent of type="password" for input elements in web dev
            keyboardType="default"
        />

        <View style={styles.buttonOuterContainer}>
            <Pressable 
                style={({pressed}) => pressed ? [styles.pressable, styles.pressed] : styles.pressable} 
                android_ripple={{color: colors.primaryAccent600}}
                onPress={handleFormSubmission}
            >
                <Text style={{color: "#fff"}}>Register</Text>
            </Pressable>
        </View>
      </View>

      <View style={styles.subTextContainer}>
        <Text>Already have an account?</Text>
        <Link href="/LoginScreen" style={styles.registerText}>Login!</Link>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebe4df',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 5,
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

  loginContainer: {
    maxWidth: "80%",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonOuterContainer: {
    overflow: "hidden",
    borderRadius: 12,
    marginTop: 5,
  },

  pressable: {
    backgroundColor: "#D6654F",
    borderColor: "#D6654F",
    borderWidth: 2,
    padding: 4,
    width: 250,
    alignItems: "center",
    justifyContent: "center",
    // borderRadius: 12,
  },

  pressed: {
    opacity: 0.75,
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
    marginVertical: 5,
    borderRadius: 8,
    borderColor: colors.textPrimary600,
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
  }
});
