// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CartProvider } from '../context/cartContext';
import { AuthContext } from '../context/authContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext);

  return (
    <CartProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        {!user && (
          <Tabs.Screen
            name="auth"
            options={{ title: 'Login', tabBarButton: () => null }}
          />
        )}

        <Tabs.Screen
          name="menu"
          options={{
            title: 'Menu',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="menu-outline" color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="carrito"
          options={{
            title: 'Carrito',
            tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
          }}
        />
      </Tabs>
    </CartProvider>
  );
}
