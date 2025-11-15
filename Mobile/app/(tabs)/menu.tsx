import { Stack, useRouter } from "expo-router";
import React, { useContext } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { AuthContext } from "../context/authContext"; 
export default function MenuScreen() {
  const router = useRouter();

  const { user, logout } = useContext(AuthContext);


  // const handleCuenta = () => {
  //   router.push("/cuenta");
  // };

  const handleLocales = () => {
    router.push("/locales");
  };


  const handleLogout = () => {
    // Añadimos una alerta para confirmar
    Alert.alert(
      "Cerrar Sesión", // Título
      "¿Estás seguro de que quieres cerrar sesión?", // Mensaje
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, cerrar sesión",
          style: "destructive",
          onPress: async () => {
            console.log("BOTÓN LOGOUT PRESIONADO");
            // Llama a la función 'logout' del contexto
            if (logout) {
              await logout();
            }
            // Redirige al usuario. 'replace' borra el historial de navegación.
            console.log("NAVEGANDO A /auth");
            router.replace("/auth");
          },
        },
      ]
    );
  };


if (!user) {
  router.replace("/auth");
  return null;
}

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Menú Principal" }} />

      <View style={styles.profile}>
        <Image
          source={{
            uri:
              "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {user.nombre} {user.apellido}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.role}>Rol: {user.role?.toUpperCase()}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.button} 
         onPress={handleLocales}
        >
          <Text style={styles.buttonText}>Administrar mi cuenta</Text>
        </TouchableOpacity>

        {user.role === "admin" && (
          <TouchableOpacity style={styles.button} onPress={handleLocales}>
            <Text style={styles.buttonText}>Administrar Locales</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}

           onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Cerrar sesión</Text>
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
  logoutButton: {
    backgroundColor: "#E53935",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
