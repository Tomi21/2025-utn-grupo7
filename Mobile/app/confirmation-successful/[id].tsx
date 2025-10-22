import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { products } from "../productsData";

export default function ConfirmacionExitosa() {
  const { id, total } = useLocalSearchParams<{ id: string, total }>();
  const router = useRouter();
  const product = products.find((p) => p.id === id);


  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Producto no encontrado</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Compra confirmada",
          headerBackVisible: false,
        }}
      />

      <View style={styles.container}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>¡Compra confirmada!</Text>
        <Text style={styles.message}>
          Tu pedido en <Text style={styles.bold}>{product.name}</Text> fue realizado con éxito.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📍 Dirección: <Text style={styles.bold}>{product.direccion}</Text>
          </Text>
          <Text style={styles.infoText}>
            🕒 Horario de retiro:{" "}
            <Text style={styles.bold}>{product.pickupTime ?? "No definido"}</Text>
          </Text>
          <Text style={styles.infoText}>
            💵 Total pagado:{" "}
            <Text style={[styles.bold, { color: "green" }]}>
              ${total}
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.homeButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#444",
  },
  bold: {
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  homeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  homeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
