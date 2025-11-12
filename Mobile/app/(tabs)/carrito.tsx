import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
// --- 1. IMPORTA 'CartItem' ADEMÁS DE 'useCart' ---
import { useCart, CartItem } from '../context/cartContext'; 
import { Ionicons } from '@expo/vector-icons'; 

export default function CartScreen() {
  const router = useRouter();
  
  const { 
    cartItems, 
    updateQuantity, 
    subtotal, 
    impuesto, 
    total, 
    itemCount 
  } = useCart();

  // --- 2. AÑADE EL TIPO A 'item' ---
  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      {/* Info del producto */}
      <View style={styles.itemInfo}>
        <Text style={styles.itemLocal}>{item.local.name}</Text>
        <Text style={styles.itemName}>{item.combo.name}</Text>
        <Text style={styles.itemPrice}>${item.combo.price.toFixed(2)}</Text>
      </View>
      
      {/* El ajustador de cantidad */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => updateQuantity(item.combo.id!, item.quantity - 1)}>
          <Ionicons name="remove-circle-outline" size={30} color="#FF6347" />
        </TouchableOpacity>
        
        <Text style={styles.itemQuantity}>{item.quantity}</Text>
        
        <TouchableOpacity onPress={() => updateQuantity(item.combo.id!, item.quantity + 1)}>
          <Ionicons name="add-circle-outline" size={30} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Mi Carrito' }} />
      <View style={styles.container}>
        
        {itemCount === 0 ? (
          // Vista si el carrito está vacío
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tu carrito está vacío.</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/')}>
              <Text style={styles.emptyButtonText}>Ver productos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Vista si el carrito tiene items
          <>
            <FlatList
              data={cartItems}
              renderItem={renderItem}
              // --- 3. AÑADE EL '!' PARA ARREGLAR EL ERROR DE KEY ---
              keyExtractor={(item) => item.combo.id!}
              contentContainerStyle={{ paddingBottom: 240,
                paddingTop: 38,
              }} 
            />
            
            {/* Resumen de Pago (fijo abajo) */}
            <View style={styles.summaryContainer}>
              {/* ... (Tu resumen de Subtotal, Impuesto, Total) ... */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Impuesto (10%)</Text>
                <Text style={styles.summaryValue}>${impuesto.toFixed(2)}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>${total.toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                style={styles.checkoutButton}
                // (El error 3 sigue aquí, ¡y está bien!)
                onPress={() => router.push('/checkout')} 
              >
                <Text style={styles.checkoutButtonText}>
                  Proceder al Pago ({itemCount} {itemCount > 1 ? 'items' : 'item'})
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </>
  );
}

// ... (Tus estilos completos no cambian)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  // --- Estilos Carrito Vacío ---
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // --- Estilos Item del Carrito ---
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemLocal: {
    fontSize: 14,
    color: '#777',
    fontWeight: '500',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: 'green',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  // --- Estilos Resumen de Pago ---
  summaryContainer: {
    position: 'absolute', // ¡Fijo abajo!
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 30, // Más padding abajo
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  summaryTotalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});