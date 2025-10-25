import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ListaLocales() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Mis Locales" }} />

            <Text style={styles.title}>Lista de Locales</Text>

            {/* Lista de locales */}
            <View style={styles.list}>
                <View style={styles.listItem}>
                    <Text style={styles.listText}>📍 Local 1 - Calle Falsa 123</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.listText}>📍 Local 2 - Avenida Siempreviva 742</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.listText}>📍 Local 3 - Calle Elm 456</Text>
                </View>
            </View>

            {/* Botón para agregar nuevo local */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/locales/crear-local")}
            >
                <Text style={styles.buttonText}>➕ Agregar nuevo Local</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    list: {
        marginBottom: 30,
    },
    listItem: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    listText: {
        fontSize: 16,
        color: "#333",
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
