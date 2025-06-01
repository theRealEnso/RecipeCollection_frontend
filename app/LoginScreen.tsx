import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

// import components

// import colors
import colors from './constants/colors';

export default function LoginScreen() {
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

  return (
    <View style={styles.container}>
      <StatusBar style="light"></StatusBar>
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
            placeholder="Email" 
            value={email} 
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType='default'
        />

        <TextInput 
            style={styles.text} 
            placeholder="Password" 
            value={password} 
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry={true} // equivalent of type="password" for input elements in web dev
            keyboardType="default"
        />

        <View style={styles.buttonOuterContainer}>
            <Pressable 
                style={({pressed}) => pressed ? [styles.pressable, styles.pressed] : styles.pressable} 
                android_ripple={{color: colors.primaryAccent600}}
            >
                <Text style={{color: "#fff"}}>Login</Text>
            </Pressable>
        </View>
      </View>

      <View style={styles.subTextContainer}>
        <Text>Don&apos;t have an account?</Text>
        <Link href="/RegisterScreen" style={styles.registerText}>Register!</Link>
      </View>
    </View>
  );
}

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
    color: '#fff',
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
