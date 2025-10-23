import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useState } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// import context provider(s)
import { RecipeProvider } from '@/context/RecipeContext';
import { UserProvider } from '../context/UserContext';

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <RecipeProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </RecipeProvider>
          </UserProvider>
      </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
