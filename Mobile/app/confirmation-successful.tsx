// --- 1. AÑADIR 'ScrollView' A LA IMPORTACIÓN ---
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfirmacionExitosa() {
  const { 
    total, 
    localName, 
    localDir, 
    localPickup 
  } = useLocalSearchParams<{ 
    total: string; 
    localName: string;
    localDir: string;
    localPickup: string;
  }>();

  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Compra confirmada",
          headerBackVisible: false,
        }}
      />

      <SafeAreaView style={styles.container}>
        {/* Ahora 'ScrollView' está importado y no dará error */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.title}>¡Compra confirmada!</Text>
            <Text style={styles.message}>
              Tu pedido en <Text style={styles.boldText}>{localName || 'el local'}</Text> fue realizado con éxito.
            </Text>

            <View style={styles.infoBox}>
              
              <View style={styles.infoBlock}>
                <View style={styles.infoLabelContainer}>
                  <Text style={styles.infoIcon}>📍</Text>
                  <Text style={styles.infoLabel}>Dirección:</Text>
                </View>
                <Text style={styles.infoValue}>{localDir || 'No definida'}</Text>
              </View>

              <View style={styles.infoBlock}>
                <View style={styles.infoLabelContainer}>
                  <Text style={styles.infoIcon}>🕒</Text>
              	  <Text style={styles.infoLabel}>Horario de retiro:</Text>
                </View>
            	  <Text style={styles.infoValue}>{localPickup || "No definido"}</Text>
          	  </View>

          	  <View style={styles.infoBlock}>
                <View style={styles.infoLabelContainer}>
                  <Text style={styles.infoIcon}>💵</Text>
            	    <Text style={styles.infoLabel}>Total pagado:</Text>
                </View>
            	  <Text style={[styles.infoValue, { color: "green" }]}>
            		  ${Number(total).toFixed(2)}
            	  </Text>
          	  </View>
            </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.homeButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

// ... (Tus estilos no cambian)
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1, 
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
  boldText: {
  	fontWeight: "bold",
  },
  infoBox: {
  	backgroundColor: "#f9f9f9",
  	padding: 20, 
  	borderRadius: 12,
  	width: "100%",
  	marginBottom: 24,
  	shadowColor: "#000",
  	shadowOpacity: 0.05,
  	shadowOffset: { width: 0, height: 2 },
  	shadowRadius: 4,
  	elevation: 2,
  },
  infoBlock: {
    marginBottom: 16, 
  },
  infoLabelContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4, 
  },
  infoIcon: { 
    fontSize: 16,
    marginRight: 8, 
    color: '#555',
  },
  infoLabel: { 
    fontSize: 16,
    color: '#555', 
  },
  infoValue: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#333', 
    marginLeft: 24, 
  },
  homeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "90%", 
    marginHorizontal: 24, 
    marginBottom: 10, 
  },
  homeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});