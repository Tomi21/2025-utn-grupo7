import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator, Alert } from "react-native";
import { getLocales } from "../../services/firebaseService"; // <-- IMPORTANTE
import { Local } from "../models"; // <-- IMPORTANTE
import { useIsFocused } from '@react-navigation/native'; // <-- IMPORTANTE

export default function ListaLocales() {
    const router = useRouter();
    const isFocused = useIsFocused(); // Hook para saber si la pantalla está visible
    const [locales, setLocales] = useState<Local[]>([]);
    const [loading, setLoading] = useState(true);

    const cargarLocales = async () => {
        setLoading(true);
        try {
            const data = await getLocales();
            setLocales(data);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudieron cargar los locales");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Carga los locales cuando la pantalla se enfoca
        // (esto hace que se actualice después de crear uno nuevo)
        if (isFocused) {
            cargarLocales();
        }
    }, [isFocused]);

    const renderItem = ({ item }: { item: Local }) => (
        // Al presionar, vamos a la pantalla de detalle del local
        <TouchableOpacity 
            style={styles.listItem}
            onPress={() => router.push(`/locales/${item.id}`)} // <-- ¡NUEVO!
        >
            <Text style={styles.listText}>📍 {item.name}</Text>
            <Text style={styles.listSubText}>{item.direccion}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Mis Locales", headerBackTitle: "Menu"  }} />

            {/* Botón para agregar (se mantiene igual) */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/locales/crear-local")}
            >
                <Text style={styles.buttonText}>➕ Agregar nuevo Local</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Lista de Locales</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <FlatList
                    data={locales}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id!}
                    ListEmptyComponent={<Text style={styles.emptyText}>No hay locales creados.</Text>}
                />
            )}
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
        marginTop: 20,
        color: "#333",
    },
    list: {
        marginBottom: 30,
    },
    listItem: {
        backgroundColor: "#fff",
        padding: 16, // Aumentado
        borderRadius: 10,
        marginBottom: 12, // Aumentado
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    listText: {
        fontSize: 18, // Aumentado
        fontWeight: '600',
        color: "#333",
    },
    listSubText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
        color: '#888'
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