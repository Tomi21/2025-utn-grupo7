// app/(tabs)/auth.tsx
import React, { useState, useContext } from "react";
import { StyleSheet, TextInput, Button, Image, Dimensions } from "react-native";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { registerUser, loginUser } from "../../services/authService";
import { User } from "../models";
import { AuthContext } from "../context/authContext";
import { useRouter } from "expo-router"; //

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function AuthScreen() {
  const { setUser } = useContext(AuthContext);

  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      let user: User;
      if (isRegister) {
        user = await registerUser({ email, username, nombre, apellido }, password);
      } else {
        user = await loginUser(email, password);
      }
      setUser(user); // actualizamos el context → redirige a las tabs
      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          style={{ width: SCREEN_WIDTH, height: 250 }}
          source={require("@/assets/images/header-image.jpg")}
          resizeMode="cover"
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          {isRegister ? "Registro" : "Login"}
        </ThemedText>

        {isRegister && (
          <>
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
          </>
        )}

        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

        <Button title={loading ? "Cargando..." : isRegister ? "Registrarse" : "Login"} onPress={handleSubmit} disabled={loading} />

        <ThemedText style={styles.toggleText} onPress={() => setIsRegister(!isRegister)}>
          {isRegister ? "Ya tenés cuenta? Inicia sesión" : "No tenés cuenta? Regístrate"}
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontFamily: Fonts.rounded, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", color: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  errorText: { color: "red", marginBottom: 10, textAlign: "center" },
  toggleText: { textAlign: "center", marginTop: 20, color: "#007AFF" },
});
