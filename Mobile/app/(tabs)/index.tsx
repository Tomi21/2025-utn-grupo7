// app/(tabs)/index.tsx
import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, Stack } from "expo-router";
import { products } from "../productsData"; 

export default function ProductList() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image
              source={typeof item.image === "string" ? { uri: item.image } : item.image}
              style={styles.image}
            />
             {/* Contenedor*/}
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.puntaje}>⭐ {item.puntaje}</Text>
            </View>
            <Text style={styles.pickupTime}>Horario de retiro: {item.pickupTime ?? "No definida"}</Text>

            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  
  nameRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 8,
  justifyContent: "space-between", 
  }, 

  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: "100%", height: 150, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 8 },
  puntaje: { fontSize: 16, fontWeight: "bold", marginTop: 8, color: "#edcc13e2" },
  pickupTime: { fontSize: 16, marginTop: 8, color: "#555" },
  price: { fontSize: 16, fontWeight: "bold", color: "green", marginTop: 8 },
});
