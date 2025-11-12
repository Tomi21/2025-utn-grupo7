import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from './context/authContext'; // <-- 1. IMPORTAR AUTH
import { CartProvider } from './context/cartContext'; // <-- 2. IMPORTAR CARRITO

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // 3. ThemeProvider (el más externo, para los colores)
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* 4. AuthProvider (envuelve al carrito y las pantallas) */}
      <AuthProvider>
        {/* 5. CartProvider (envuelve a todas las pantallas) */}
        <CartProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            
            {/* Expo Router encontrará automáticamente tus otras pantallas 
              (como product/[id], checkout, etc.) 
              y ahora ¡TODAS estarán envueltas por los providers!
            */}
          </Stack>
          <StatusBar style="auto" />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}