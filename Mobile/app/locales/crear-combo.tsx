import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { createCombo } from '../../services/firebaseService';
import { Combo } from '../models';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';


export default function CrearComboScreen() {
  const router = useRouter();
  // Recibimos el localId de la pantalla anterior
  const { localId } = useLocalSearchParams<{ localId: string }>();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');

  const handleGuardar = async () => {
    if (!name || !price || !localId) {
      alert('Nombre, Precio y Local son obligatorios');
      return;
    }
    setLoading(true);
    try {
      const nuevoCombo: Omit<Combo, 'id'> = {
        name,
        price: parseFloat(price),
        description: description || undefined,
        weight: weight ? parseFloat(weight) : undefined,
        localId: localId, // ¡Asignamos el ID del local!
      };
      
      await createCombo(nuevoCombo);
      Alert.alert('Éxito', '¡Combo creado con éxito!');
      router.back(); // Volver a la pantalla de detalle del local
    } catch (error) {
      console.error(error);
      alert('Error al crear el combo');
    } finally {
        setLoading(false);
    }
  };

  if (!localId) {
    return <View><Text>Error: No se ha especificado un local.</Text></View>
  }

  return (
    <ScrollView style={styles.container}>
    <Stack.Screen options={{ title: "Nuevo Combo" }} />
      <Text style={styles.title}>Crear Nuevo Combo</Text>
      <Text style={styles.subtitle}>Perteneciente al local (ID: {localId})</Text>

      <Text style={styles.label}>Nombre del Combo</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ej: Combo Sorpresa Vegano" />

      <Text style={styles.label}>Precio</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="Ej: 500.50" />

      <Text style={styles.label}>Descripción (Opcional)</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline placeholder="Contiene..." />

      <Text style={styles.label}>Peso Aprox. (Opcional)</Text>
      <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="Ej: 750 (en gramos)" />

      <View style={styles.buttonContainer}>
        {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
        ) : (
            <Button title="Guardar Combo" onPress={handleGuardar} color="#007AFF" />
        )}
      </View>
    </ScrollView>
  );
}

// ... (copia los estilos de 'crear-local.tsx' o usa estos)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 25,
    marginBottom: 40,
  }
});