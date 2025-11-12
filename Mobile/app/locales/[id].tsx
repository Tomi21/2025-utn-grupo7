import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Alert, FlatList } from "react-native";
// Importamos la NUEVA función 'updateLocal'
import { getLocalById, getCombosByLocalId, updateLocal } from "../../services/firebaseService";
import { Local, Combo } from "../models";
import { useIsFocused } from '@react-navigation/native';

export default function DetalleLocalAdmin() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const isFocused = useIsFocused();

    const [local, setLocal] = useState<Local | null>(null);
    const [combos, setCombos] = useState<Combo[]>([]);
    // Usamos 'loading' para ambas, cargar datos y 'destacar'
    const [loading, setLoading] = useState(true); 

    const cargarDatos = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const localData = await getLocalById(id);
            const combosData = await getCombosByLocalId(id);
            setLocal(localData);
            setCombos(combosData);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudieron cargar los datos del local");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused && id) {
            cargarDatos();
        }
    }, [id, isFocused]);

    // --- ¡NUEVA FUNCIÓN PARA "DESTACAR"! ---
    const handleSetFeatured = async (combo: Combo) => {
      // Validamos que tengamos el local y su id
      if (!local || !local.id) return;
      
      // Bloqueamos la UI
      setLoading(true); 
      try {
        // 1. Preparamos los datos a SOBRESCRIBIR
        const dataToUpdate: Partial<Local> = {
          featuredComboId: combo.id,
          featuredComboPrice: combo.price
        };
        
        // 2. Llamamos al servicio para actualizar Firebase
        await updateLocal(local.id, dataToUpdate);
        
        // 3. Actualizamos el estado local INMEDIATAMENTE
        //    (para que la UI reaccione sin recargar)
        setLocal(prevLocal => ({ 
          ...prevLocal!, 
          ...dataToUpdate 
        }));
        
        Alert.alert("Éxito", `"${combo.name}" ahora es el combo destacado.`);

      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudo destacar el combo.");
      } finally {
        // Desbloqueamos la UI
        setLoading(false);
      }
    };
    // --- FIN DE LA NUEVA FUNCIÓN ---

    if (loading && !local) { // Modificado para que el 'loading' no tape la pantalla
        return <ActivityIndicator size="large" style={styles.centered} />;
    }

    if (!local) {
        return (
            <View style={styles.centered}>
                <Text>Local no encontrado.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: local.name }} />
            
            {/* ... (Tu sección de Info del Local no cambia) ... */}
            <View style={styles.section}>
                <Text style={styles.title}>{local.name}</Text>
                <Text style={styles.info}>📍 {local.direccion}</Text>
                <Text style={styles.info}>🕒 {local.pickupTime}</Text>
                <Text style={styles.info}>📞 {local.phone}</Text>
                <Text style={styles.info}>✉️ {local.email}</Text>
            </View>

            {/* Sección de Combos (MODIFICADA) */}
            <View style={styles.section}>
                <Text style={styles.subtitle}>Combos de este Local</Text>
                
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push(`/locales/crear-combo?localId=${id}`)}
                >
                    <Text style={styles.buttonText}>➕ Añadir Combo</Text>
                </TouchableOpacity>

                {/* Si está cargando, mostramos un pequeño spinner aquí */}
                {loading && <ActivityIndicator style={{marginVertical: 10}} color="#007AFF" />}

                {combos.length === 0 ? (
                    <Text style={styles.emptyText}>Este local aún no tiene combos.</Text>
                ) : (
                    <FlatList
                        data={combos}
                        keyExtractor={(item) => item.id!}
                        scrollEnabled={false}
                        renderItem={({ item }) => {
                            // Comprobamos si este es el combo destacado
                            const isFeatured = local.featuredComboId === item.id;
                            
                            return (
                              // Aplicamos un estilo diferente si es destacado
                              <View style={isFeatured ? styles.comboItemFeatured : styles.comboItem}>
                                <View style={styles.comboInfo}>
                                  <Text style={styles.comboName}>{item.name}</Text>
                                  <Text style={styles.comboPrice}>${item.price.toFixed(2)}</Text>
                                </View>
                                <TouchableOpacity 
                                  // El botón se deshabilita si ya es el destacado O si está cargando
                                  disabled={isFeatured || loading}
                                  style={isFeatured ? styles.featureButtonDisabled : styles.featureButton}
                                  onPress={() => handleSetFeatured(item)}
                                >
                                  <Text style={styles.featureButtonText}>
                                    {isFeatured ? "Destacado" : "Destacar"}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            );
                        }}
                    />
                )}
            </View>
        </ScrollView>
    );
}

// --- AÑADE ESTOS NUEVOS ESTILOS AL StyleSheet ---
const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8' },
    container: { flex: 1, backgroundColor: '#f8f8f8', padding: 20 },
    section: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    subtitle: { fontSize: 20, fontWeight: '600', marginBottom: 15, color: '#333' },
    info: { fontSize: 16, color: '#444', marginBottom: 6 },
    button: {
        backgroundColor: "#4CAF50", // Color verde para "Añadir"
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    emptyText: { textAlign: 'center', marginVertical: 10, color: '#888', fontStyle: 'italic' },
    
    // --- ESTILOS NUEVOS PARA LA LISTA DE COMBOS ---
    comboItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    comboItemFeatured: { // Estilo para el combo destacado
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#4CAF50',
        backgroundColor: '#f0fff0',
        borderRadius: 8,
    },
    comboInfo: {
      flex: 1, // Ocupa el espacio disponible
    },
    comboName: { fontSize: 16, color: '#333', fontWeight: '500' },
    comboPrice: { fontSize: 16, fontWeight: '600', color: 'green' },
    featureButton: {
      backgroundColor: '#007AFF', // Azul (el que te gusta)
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      marginLeft: 10, // Espacio entre info y botón
    },
    featureButtonDisabled: {
      backgroundColor: '#aaa', // Gris cuando está deshabilitado
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      marginLeft: 10,
    },
    featureButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600'
    }
});