import { Stack, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface User {
  id?: string;
  username: string;
  nombre?: string;
  apellido?: string;
  email: string;
  role?: "admin" | "user";
}

export default function MenuScreen() {
  const router = useRouter(); // 👈 navegación con expo-router

  const currentUser: User = {
    id: "1",
    username: "ibifano",
    nombre: "Ian",
    apellido: "Bifano",
    email: "bifano@realsoftware.com.ar",
    role: "admin",
  };

  const handleCuenta = () => {
    router.push("/cuenta"); // 👈 más adelante podés crear esta pantalla
  };

  const handleLocales = () => {
    router.push("/locales"); // 👈 va al listado de locales
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Menú Principal" }} />

      <View style={styles.profile}>
        <Image
          source={{ uri: "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {currentUser.nombre} {currentUser.apellido}
        </Text>
        <Text style={styles.email}>{currentUser.email}</Text>
        <Text style={styles.role}>Rol: {currentUser.role?.toUpperCase()}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.button} onPress={handleCuenta}>
          <Text style={styles.buttonText}>Administrar mi cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLocales}>
          <Text style={styles.buttonText}>Administrar Locales</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  profile: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  role: {
    marginTop: 4,
    color: "#888",
    fontSize: 14,
  },
  menu: {
    alignItems: "center",
    gap: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
