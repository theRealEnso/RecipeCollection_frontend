import { Redirect } from 'expo-router';
import { useContext } from 'react';
import 'react-native-get-random-values';
import { UserContext } from '../context/UserContext';

export default function Index() {
  const { currentUser, isHydrated } = useContext(UserContext);

  if (!isHydrated) {
    return null; // or show splash
  };

  if (!currentUser) {
    return <Redirect href="/LoginScreen" />;
  };

  return <Redirect href="/HomeScreen" />;
};
