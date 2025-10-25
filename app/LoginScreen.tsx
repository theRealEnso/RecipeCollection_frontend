import { UserContext } from '@/context/UserContext';
import { useCallback, useContext, useEffect, useState } from 'react';

import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

// import api function to login user
import { loginUser } from '@/api/userAuth';
import { useMutation } from '@tanstack/react-query';

// import component(s)
import CustomButton from './components/CustomButton';

// import colors
import colors from './constants/colors';

// define types
type FormErrors = {
  email: string | null;
  password: string | null
};

export default function LoginScreen() {
  const {handleSetUser, handleSetTokens, accessToken,} = useContext(UserContext);
  const [navigationReady, setNavigationReady] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if(navigationReady && accessToken){
      // console.log(accessToken);
      router.replace("./HomeScreen");
    }
  }, [router, navigationReady, accessToken,]);

  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: null,
    password: null,
  });

  const [formInputs, setFormInputs] = useState({
      email: "",
      password: "",
  });

  const {email, password} = formInputs;

  const handleInputChange = (field: string, value: string): void => {
      setFormInputs((previousState) => ({
          ...previousState,
          [field]: value,
      }));
  };

  //to fix stale closure issue where react query was referencing a function that no longer exists
  const handleError = useCallback((error: any) => {
    setErrorMessage(error.message);

  }, []);

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if(data){
        handleSetUser(data.user);
        handleSetTokens(data.access_token, data.refresh_token);
        setNavigationReady(true);
      }
    },

    onError: handleError,
  });

  const handleLoginSubmit = async () => {
    const validationErrors: FormErrors = {
      email: null,
      password: null,
    };

    if(!email.trim()){
      validationErrors.email = "Email address is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      validationErrors.email = "Invalid email address!";
    };

    if(!password.trim()){
      validationErrors.password = "Password is required!"
    };

    setFormErrors(validationErrors);

    // if any of the properties inside of formErrors has a value other than null, then the form has an error somewhere
    let hasErrors = Object.values(formErrors).some((value) => value !== null);
    if(!hasErrors){
      try {
        loginUserMutation.mutate({...formInputs});
      } catch(error){
        console.error(`Error: ${error}`);
      }
    }
  };

  // console.log(errorMessage);

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
        <View style={styles.inputContainer}>
          {
            formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>
          }
          <TextInput 
            style={styles.text} 
            placeholder="Email" 
            value={email} 
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType='default'
          />
        </View>

        <View style={styles.inputContainer}>
          {
            formErrors.password && <Text style={styles.errorText}></Text>
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

        <View style={styles.buttonOuterContainer}>
          <CustomButton 
            value="Login"
            width={250} 
            mutationPending={loginUserMutation.isPending} 
            onButtonPress={handleLoginSubmit}>
          </CustomButton>
        </View>
      </View>

      <View style={styles.subTextContainer}>
        <Text>Don&apos;t have an account?</Text>
        <Link href="./RegisterScreen" style={styles.registerText}>Register!</Link>
      </View>

      {
        errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FC',
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
  },

  errorText: {
    color: "red",
  }
});
