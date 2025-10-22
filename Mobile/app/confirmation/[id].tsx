import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { products } from "../productsData";

export default function ConfirmacionCompra() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const product = products.find((p) => p.id === id);

  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "tarjeta">("efectivo");
  const [cardInfo, setCardInfo] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Producto no encontrado</Text>
      </View>
    );
  }

  const impuesto = product.price * 0.1;
  const total = product.price + impuesto;

  const handlePay = () => {
    if (paymentMethod === "tarjeta") {
      if (!cardInfo.name || !cardInfo.number || !cardInfo.expiry || !cardInfo.cvv) {
        alert("Por favor completá todos los datos de la tarjeta.");
        return;
      }
    }
      if (!id) {
        alert("Error: ID del producto no encontrado");
        return;
      }
      
    router.push(`/confirmation-successful/${id}?total=${total}`);

  };

  return (
    <>
      <Stack.Screen options={{ title: "Confirmación de compra", headerBackTitle: "Volver" }} />

      <View style={styles.container}>
        <Text style={styles.title}>{product.name}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Horario de retiro:</Text>
          <Text style={styles.value}>{product.pickupTime ?? "No definido"}</Text>
        </View>

        {/* MÉTODO DE PAGO */}
        <View style={styles.sectionColumn}>
          <Text style={styles.label}>Método de pago:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value)}
              mode="dropdown"
              style={styles.picker}
            >
              <Picker.Item label="Efectivo" value="efectivo" />
              <Picker.Item label="Tarjeta de crédito / débito" value="tarjeta" />
            </Picker>
          </View>
        </View>

        {/* FORM TARJETA */}
        {paymentMethod === "tarjeta" && (
          <View style={styles.cardForm}>
            <TextInput
              style={styles.input}
              placeholder="Nombre en la tarjeta"
              value={cardInfo.name}
              onChangeText={(text) => setCardInfo({ ...cardInfo, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Número de tarjeta"
              keyboardType="numeric"
              maxLength={19}
              value={cardInfo.number}
              onChangeText={(text) => setCardInfo({ ...cardInfo, number: text })}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="MM/AA"
                value={cardInfo.expiry}
                maxLength={5}
                onChangeText={(text) => setCardInfo({ ...cardInfo, expiry: text })}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="CVV"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                value={cardInfo.cvv}
                onChangeText={(text) => setCardInfo({ ...cardInfo, cvv: text })}
              />
            </View>
          </View>
        )}

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>${product.price.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Impuesto (10%):</Text>
          <Text style={styles.value}>${impuesto.toFixed(2)}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Pagar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionColumn: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#444",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  picker: {
    width: "100%",
    height: Platform.OS === "ios" ? 180 : 48,
  },
  cardForm: {
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
  payButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 32,
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
