import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// import { RECIPE_COLLECTION_ENDPOINT_3 } from "@env";

// console.log(RECIPE_COLLECTION_ENDPOINT_3);

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar style="light"></StatusBar>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/about" style={styles.button}>Go to About Screen</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
