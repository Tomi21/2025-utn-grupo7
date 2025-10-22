import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { products } from "../productsData";
import ImageCarousel from "../../components/ui/image-carousel";

export default function ProductDetail() {
  const router = useRouter();
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
      <Stack.Screen options={{ title: product.name, headerBackTitle: "Volver" }} />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <ImageCarousel images={product.images} />

          <View style={styles.nameRow}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.puntaje}>⭐ {product.puntaje}</Text>
          </View>

          <View style={styles.separator} />

          <Text style={styles.direccion}>{product.direccion}</Text>
          <Text style={styles.pickupTime}>
            Horario de retiro: {product.pickupTime ?? "No definida"}
          </Text>

          <View style={styles.separator} />

          <Text style={styles.descriptionTitulo}>Acerca del contenido</Text>
          {product.description && <Text style={styles.description}>{product.description}</Text>}

          <View style={styles.separator} />

          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        </ScrollView>

        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => router.push(`/confirmation/${id}`)}
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
    backgroundColor: "#f9f9f9",
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
