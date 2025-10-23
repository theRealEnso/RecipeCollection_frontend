import { Redirect } from 'expo-router';
import { useContext } from 'react';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { UserContext } from '../context/UserContext';

// entry file acts as an authentication gate
// redirect user to LoginScreen if there's no signed in user
// redirect to HomeScreen otherwise
export default function Index() {
  const { currentUser, isHydrated } = useContext(UserContext);

  if (!isHydrated) {
    return null; // or show splash
  };

  if (!currentUser) {
    return <Redirect href="/LoginScreen" />;
  };

  // return <Redirect href="/HomeScreen" />;
  
  return <Redirect href="/(authenticated)/HomeScreen"></Redirect>

};
