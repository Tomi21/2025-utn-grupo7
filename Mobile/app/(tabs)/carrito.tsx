import { Stack } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/cartContext";

export default function CartScreen() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Carrito" }} />

      {cart.length === 0 ? (
        <Text style={styles.empty}>Tu carrito está vacío</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.name}>
                  {item.name} x{item.quantity}
                </Text>
                <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.remove}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

          <TouchableOpacity style={styles.checkout} onPress={() => alert("Compra realizada!")}>
            <Text style={styles.checkoutText}>Finalizar compra</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clear} onPress={clearCart}>
            <Text style={styles.clearText}>Vaciar carrito</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  empty: { textAlign: "center", marginTop: 20, fontSize: 18 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
  },
  name: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 16, color: "green" },
  remove: { color: "red", marginLeft: 10 },
  total: { fontSize: 18, fontWeight: "bold", marginTop: 20, textAlign: "center" },
  checkout: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  clear: { marginTop: 10, alignItems: "center" },
  clearText: { color: "red", fontWeight: "bold" },
});
