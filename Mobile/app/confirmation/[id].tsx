import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { useState } from "react";
import { products } from "../productsData";
import RNPickerSelect from 'react-native-picker-select';

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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>{product.name}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Horario de retiro:</Text>
          <Text style={styles.value}>{product.pickupTime ?? "No definido"}</Text>
        </View>

        {/* MÉTODO DE PAGO */}
        <View style={styles.sectionColumn}>
          <Text style={styles.label}>Método de pago:</Text>
          <RNPickerSelect
            onValueChange={(value) => setPaymentMethod(value)}
            items={[
              { label: 'Efectivo', value: 'efectivo' },
              { label: 'Tarjeta de crédito / débito', value: 'tarjeta' },
            ]}
            placeholder={{ label: 'Selecciona un método', value: null }}
            style={{
              inputIOS: {
                marginTop: 8,
                fontSize: 16,
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 8,
                color: 'black',
                paddingRight: 30, // espacio para el ícono de flecha
              },
              inputAndroid: {
                fontSize: 16,
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderWidth: 0.5,
                borderColor: 'purple',
                borderRadius: 8,
                color: 'black',
                paddingRight: 30,
              },
              iconContainer: {
                top: Platform.OS === 'ios' ? 20 : 20,
                right: 20,
              },
            }}
            Icon={() => {
              return <Text style={{ fontSize: 16 }}>▼</Text>;
            }}
          />
        </View>

        {/* FORM TARJETA */}
        {paymentMethod === "tarjeta" && (
          <View style={styles.cardForm}>
            <TextInput
              style={styles.input}
              placeholder="Nombre en la tarjeta"
              placeholderTextColor="#555" // color más oscuro que el gris predeterminado
              value={cardInfo.name}
              onChangeText={(text) => setCardInfo({ ...cardInfo, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Número de tarjeta"
              keyboardType="numeric"
              maxLength={19}
              placeholderTextColor="#555" 
              value={cardInfo.number}
              onChangeText={(text) => setCardInfo({ ...cardInfo, number: text })}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="MM/AA"
                placeholderTextColor="#555" 
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
                placeholderTextColor="#555" 
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

        {/* Botón fijo abajo */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 30,
            left: 20,
            right: 20,
            backgroundColor: '#4CAF50',
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={handlePay}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Pagar</Text>
        </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
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
    justifyContent: "flex-start",
    
  },
  picker: {
    width: "100%",
    height: Platform.OS === "ios" ? 90 : 48,
    color: "#000", // color del texto en iOS
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
    color: "#000", 
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
    marginTop: 8,
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
