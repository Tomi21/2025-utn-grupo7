import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react"; 
import ImageCarousel from "../../components/ui/image-carousel";
import { getComboById, getLocalById } from "../../services/firebaseService"; 
import { Combo, Local } from "../models"; 
import { useCart } from '../context/cartContext'; // <-- 1. IMPORTAR EL CONTEXT DEL CARRITO

export default function ProductDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); 
  const { addToCart } = useCart(); // <-- 2. OBTENER LA FUNCIÓN 'addToCart'

  const [combo, setCombo] = useState<Combo | null>(null);
  const [local, setLocal] = useState<Local | null>(null);
  const [loading, setLoading] = useState(true);

  // ... (Tu useEffect para cargar 'combo' y 'local' no cambia) ...
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const comboData = await getComboById(id);
        
        if (comboData) {
          setCombo(comboData);
          if (comboData.localId) {
            const localData = await getLocalById(comboData.localId);
            setLocal(localData);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos del producto: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); 

  // ... (Tus 'return' de loading y error no cambian) ...
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }
  if (!combo) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Producto no encontrado</Text>
      </View>
    );
  }
  
  // --- 3. NUEVA FUNCIÓN PARA EL BOTÓN ---
  const handleAddToCart = () => {
    // Solo funciona si 'combo' y 'local' se cargaron correctamente
    if (combo && local) {
      addToCart(combo, local); // ¡Añade al carrito!
      router.push('/(tabs)/carrito'); // Navega a la pantalla del carrito
    } else {
      alert("Error: No se pudo añadir el producto. Intenta de nuevo.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: combo.name, headerBackTitle: "Volver" }} />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          
          {/* ... (Todo tu JSX: Carousel, Nombre, Dirección, Peso, etc. no cambia) ... */}
          {local && local.images && local.images.length > 0 ? (
            <ImageCarousel images={local.images.filter(img => img)} />
          ) : (
            <View style={styles.noImage}><Text>Sin imágenes</Text></View>
          )}
          <View style={styles.nameRow}>
            <Text style={styles.name}>{combo.name}</Text>
          </View>
          <View style={styles.separator} />
          <Text style={styles.direccion}>{local?.direccion ?? "Dirección no disponible"}</Text>
          <Text style={styles.pickupTime}>
            Horario de retiro: {local?.pickupTime ?? "No definida"}
          </Text>
          <View style={styles.separator} />
          <Text style={styles.descriptionTitulo}>Acerca del contenido</Text>
          {combo.description ? (
            <Text style={styles.description}>{combo.description}</Text>
          ) : (
             <Text style={styles.description}>Sin descripción.</Text>
          )}
          {combo.weight && combo.weight > 0 && (
            <Text style={styles.weightText}>
              Peso aproximado: {combo.weight}g
            </Text>
          )}
          <View style={styles.separator} />
          <Text style={styles.price}>${combo.price.toFixed(2)}</Text>
        </ScrollView>

        {/* --- 4. BOTÓN ACTUALIZADO --- */}
        <TouchableOpacity
          style={styles.orderButton}
          onPress={handleAddToCart} // <-- Usamos la nueva función
        >
          {/* --- 5. TEXTO DEL BOTÓN ACTUALIZADO --- */}
          <Text style={styles.orderButtonText}>Añadir al carrito</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

// ... (Tus estilos no cambian) ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    padding: 16,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "space-between",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 4,
  },
  image: { width: "100%", height: 200, borderRadius: 8 },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 12, marginBottom: 8 },
  puntaje: { fontSize: 16, fontWeight: "bold", color: "#edcc13e2" },
  direccion: { fontSize: 16, marginTop: 4, color: "#555" },
  pickupTime: { fontSize: 16, marginTop: 2, color: "#555" },
  descriptionTitulo: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
  description: { fontSize: 16, marginTop: 4, marginBottom: 8 },
  weightText: {
    fontSize: 16,
    color: '#555', 
    fontStyle: 'italic', 
    marginTop: 8,
    marginBottom: 4,
  },
  price: { fontSize: 20, fontWeight: "bold", color: "green", marginTop: 12, textAlign: "center" },
  orderButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
  orderButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});