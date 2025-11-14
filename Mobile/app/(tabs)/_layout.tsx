import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '../context/authContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth(); // <-- 2. CAMBIAMOS useContext(AuthContext) por useAuth()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          justifyContent: 'center', 
          alignItems: 'center',   
          flexDirection: 'row',  
        }
      }}
    >
        {/* --- 1. PANTALLA DE LOGIN (auth) --- */}
        <Tabs.Screen
          name="auth"
          options={{
            title: 'Login',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="log-in-outline" color={color} />,
            
            // --- LÓGICA ---
            // Si SÍ hay usuario, oculta esta pestaña.
            // Si NO hay usuario, se muéstra.
            href: user ? null : '/auth',
          }}
        />

        {/* --- 2. PANTALLA DE MENÚ (menu) --- */}
        <Tabs.Screen
          name="menu"
          options={{
            title: 'Menu',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="menu-outline" color={color} />,
            
            // --- LÓGICA ---
            // Si SÍ hay usuario, se muéstra.
            // Si NO hay usuario, oculta esta pestaña.
            href: user ? '/menu' : null,
          }}
        />

        {/* --- 3. PANTALLAS PÚBLICAS (Siempre visibles) --- */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            // (href no es necesario, siempre es visible)
          }}
        />
        <Tabs.Screen
          name="carrito"
          options={{
            title: 'Carrito',
            tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
            // (href no es necesario, siempre es visible)
          }}
        />
      </Tabs>
  );
}