import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Platform,
  // --- 1. 'TouchableWithoutFeedback' y 'Keyboard' ELIMINADOS ---
} from "react-native";
import { useState, useContext } from "react"; 
import RNPickerSelect from 'react-native-picker-select';
import { useCart } from './context/cartContext'; // (Ruta ya corregida)
import { AuthContext } from "./context/authContext"; // (Ruta ya corregida)

export default function CheckoutScreen() { 
  const router = useRouter();
  
  const { cartItems, subtotal, impuesto, total, clearCart } = useCart();
  const { user } = useContext(AuthContext); 

  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "tarjeta">("efectivo");
  const [cardInfo, setCardInfo] = useState({
  	name: "", number: "", expiry: "", cvv: "",
  });

  if (cartItems.length === 0) {
  	return (
  	  <View style={[styles.container, styles.centered]}>
  		  <Text style={{fontSize: 18, color: '#555'}}>Tu carrito está vacío.</Text>
        <TouchableOpacity onPress={() => router.push('/')} style={{marginTop: 20}}>
          <Text style={{color: 'green', fontSize: 16}}>Ir a la tienda</Text>
        </TouchableOpacity>
  	  </View>
  	);
  }
  
  const firstItem = cartItems[0];
  const local = firstItem.local;

  const handlePay = async () => {
    // ... (lógica de handlePay no cambia) ...
  	if (paymentMethod === "tarjeta") {
  	  if (!cardInfo.name || !cardInfo.number || !cardInfo.expiry || !cardInfo.cvv) {
  		  alert("Por favor completá todos los datos de la tarjeta.");
  		  return;
  	  }
  	}
  	clearCart();
  	router.push(`/confirmation-successful?total=${total}&localName=${local.name}&localDir=${local.direccion}&localPickup=${local.pickupTime}`);
  };

  return (
  	<>
  	  <Stack.Screen options={{ title: "Confirmación de compra", headerBackTitle: "Volver" }} />

      {/* --- 2. 'TouchableWithoutFeedback' ELIMINADO DE AQUÍ --- */}
  	  <View style={{flex: 1, backgroundColor: '#fff'}}> 
  	  
  		  <ScrollView 
            style={styles.container} 
            contentContainerStyle={{ paddingBottom: 100 }} 
            // --- 3. PROPIEDAD AÑADIDA PARA MANEJAR EL TECLADO ---
            keyboardShouldPersistTaps="handled" 
          >
      		  <Text style={styles.title}>Comprando en {local.name}</Text>

      		  <View style={styles.section}>
      		  	<Text style={styles.label}>Horario de retiro:</Text>
      		  	<Text style={styles.value}>{local.pickupTime ?? "No definido"}</Text>
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
      		  	  style={pickerStyles} 
      		  	  Icon={() => <Text style={{ fontSize: 16 }}>▼</Text>}
      		  	/>
      		  </View>

      		  {/* FORM TARJETA */}
      		  {paymentMethod === "tarjeta" && (
      		  	<View style={styles.cardForm}>
      		  	  <TextInput style={styles.input} placeholder="Nombre en la tarjeta" value={cardInfo.name} onChangeText={(text) => setCardInfo({ ...cardInfo, name: text })} />
      		  	  <TextInput style={styles.input} placeholder="Número de tarjeta" keyboardType="numeric" maxLength={19} value={cardInfo.number} onChangeText={(text) => setCardInfo({ ...cardInfo, number: text })} />
      		  	  <View style={styles.row}>
      		  		<TextInput style={[styles.input, styles.halfInput]} placeholder="MM/AA" value={cardInfo.expiry} maxLength={5} onChangeText={(text) => setCardInfo({ ...cardInfo, expiry: text })} />
      		  		<TextInput style={[styles.input, styles.halfInput]} placeholder="CVV" keyboardType="numeric" maxLength={4} secureTextEntry value={cardInfo.cvv} onChangeText={(text) => setCardInfo({ ...cardInfo, cvv: text })} />
      		  	  </View>
      		  	</View>
      		  )}

      		  <View style={styles.separator} />

      		  {/* ... (Secciones de Subtotal, Impuesto, y Total) ... */}
            <View style={styles.section}>
      		  	<Text style={styles.label}>Subtotal:</Text>
      		  	<Text style={styles.value}>${subtotal.toFixed(2)}</Text>
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
      	  </ScrollView>

      	  {/* Botón fijo abajo */}
      	  <TouchableOpacity
      		  style={styles.payButtonFixed} 
      		  onPress={handlePay}
      	  >
      		  <Text style={styles.payButtonText}>Pagar ${total.toFixed(2)}</Text>
      	  </TouchableOpacity>
      	  
      	</View> 
  	</>
  );
}

// --- (Estilos. Asegúrate de que 'row' esté arreglado) ---
const pickerStyles = { 
  inputIOS: {
    marginTop: 8, fontSize: 16, paddingVertical: 12, paddingHorizontal: 10,
    borderWidth: 1, borderColor: 'gray', borderRadius: 8,
    color: 'black', paddingRight: 30, 
  },
  inputAndroid: {
    fontSize: 16, paddingHorizontal: 10, paddingVertical: 8,
    borderWidth: 0.5, borderColor: 'purple', borderRadius: 8,
    color: 'black', paddingRight: 30,
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 20 : 20, right: 20,
},
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#fff",
    padding: 20,
  },
  centered: {
  	justifyContent: 'center',
  	alignItems: 'center',
  },
  title: {
  	fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center",
  },
  section: {
  	flexDirection: "row", justifyContent: "space-between", marginBottom: 12,
  },
  sectionColumn: { marginBottom: 16, },
  label: { fontSize: 16, color: "#444", },
  value: { fontSize: 16, fontWeight: "500", },
  cardForm: { marginTop: 8, marginBottom: 16, },
  input: {
  	borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10,
  	marginBottom: 10, fontSize: 16, color: "#000", 
  },
  row: { 
  	flexDirection: "row", 
  	justifyContent: "space-between", 
  }, // (¡Error de 's' arreglado aquí!)
  halfInput: { width: "48%", },
  separator: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 16, },
  totalLabel: { fontSize: 18, fontWeight: "bold", },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "green", },
  payButtonFixed: {
  	position: 'absolute', bottom: 30, left: 20, right: 20,
  	backgroundColor: '#4CAF50', paddingVertical: 14, borderRadius: 8,
  	alignItems: 'center',
  },
  payButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16, },
});