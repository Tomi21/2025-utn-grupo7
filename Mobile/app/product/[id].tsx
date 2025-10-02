// app/product/[id].tsx
import { useLocalSearchParams, Stack  } from "expo-router";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { products } from "../productsData";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Producto no encontrado</Text>
      </View>
    );
  }

  return (
    <>
    {/* 🔹 Configuración del header */}
    <Stack.Screen options={{ title: product.name, headerBackTitle: "Volver" }} />
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={typeof product.image === "string" ? { uri: product.image } : product.image}
          style={styles.image}
        />
        <View style={styles.nameRow}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.puntaje}>⭐ {product.puntaje}</Text>
        </View>
        <View style={styles.separator} />
          <Text style={styles.direccion}>{product.direccion}</Text>
          <Text style={styles.pickupTime}>Horario de retiro: {product.pickupTime ?? "No definida"}</Text>
        <View style={styles.separator} />
          <Text style={styles.descriptionTitulo}>Acerca del contenido</Text>
          {product.description && <Text style={styles.description}>{product.description}</Text>}
        <View style={styles.separator} />  
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={styles.orderButton}
        onPress={() => alert("Pedido realizado")}
      >
        <Text style={styles.orderButtonText}>Realizar pedido</Text>
      </TouchableOpacity>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
    justifyContent: "space-between",
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

  content: {
    flex: 1,
  },
  image: { width: "100%", height: 200, borderRadius: 8 },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 12 ,marginBottom: 8, },
  puntaje: { fontSize: 16, fontWeight: "bold", marginTop: 16,marginBottom: 8,  color: "#edcc13e2" },
  direccion: { fontSize: 16, marginTop: 8, color: "#555" },
  pickupTime: { fontSize: 16, marginTop: 8, marginBottom: 8, color: "#555" },
  descriptionTitulo: { fontSize: 16,fontWeight: "bold", marginTop: 8 },
  description: { fontSize: 16, marginTop: 8, marginBottom: 8, },
   price: { fontSize: 20, fontWeight: "bold", color: "green", marginTop: 16, textAlign: "center", },
  orderButton: {
    backgroundColor: "#4CAF50", 
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16, 
  },
  orderButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
