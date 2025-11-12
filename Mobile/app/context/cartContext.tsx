import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Combo, Local } from '../models'; // Importa tus modelos de Firebase

// 1. Define qué guardaremos por cada item en el carrito
export interface CartItem {
  combo: Combo;
  local: Local; // Guardamos el local para mostrar su info (horario, etc.)
  quantity: number;
}

// 2. Define qué expondrá nuestro Context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (combo: Combo, local: Local) => void;
  updateQuantity: (comboId: string, quantity: number) => void;
  removeFromCart: (comboId: string) => void;
  clearCart: () => void;
  itemCount: number; // Conteo total de items (ej: 3 combos)
  subtotal: number;
  impuesto: number;
  total: number; // El total final que pediste
}

// 3. Crea el Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// 4. Hook para usar el context fácilmente (tu 'useCart' ya existe, pero este es actualizado)
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// 5. El Provider (el componente "mágico")
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  // El carrito empieza VACÍO, no pre-cargado
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Estados para los totales que pediste
  const [subtotal, setSubtotal] = useState(0);
  const [impuesto, setImpuesto] = useState(0);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  const IMPUESTO_TASA = 0.10; // 10%

  // 6. Recalcular totales CADA VEZ que el carrito cambie
  useEffect(() => {
    let newSubtotal = 0;
    let newItemCount = 0;

    // Suma el precio * cantidad por cada item
    cartItems.forEach(item => {
      newSubtotal += item.combo.price * item.quantity;
      newItemCount += item.quantity;
    });

    const newImpuesto = newSubtotal * IMPUESTO_TASA;
    const newTotal = newSubtotal + newImpuesto;

    // Actualiza los estados
    setSubtotal(newSubtotal);
    setImpuesto(newImpuesto);
    setTotal(newTotal);
    setItemCount(newItemCount);
  }, [cartItems]); // Se re-ejecuta si 'cartItems' cambia

  // 7. Lógica del Carrito
  
  /**
   * Añade un combo al carrito.
   * Si ya existe, aumenta la cantidad.
   * Si es de un local DIFERENTE, bloquea la acción.
   */
  const addToCart = (combo: Combo, local: Local) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.combo.id === combo.id);
      
      // REGLA DE NEGOCIO: Solo se pueden comprar combos del mismo local
      if (prevItems.length > 0 && prevItems[0].local.id !== local.id) {
          alert("Solo puedes comprar combos del mismo local en un solo pedido. Vacía el carrito si quieres cambiar de local.");
          return prevItems; // Devuelve el carrito sin cambios
      }
      
      if (existingItem) {
        // Si ya existe, solo aumenta la cantidad
        return prevItems.map(item =>
          item.combo.id === combo.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si es nuevo, lo añade con cantidad 1
        return [...prevItems, { combo, local, quantity: 1 }];
      }
    });
  };

  /**
   * Actualiza la cantidad de un item.
   * Si la cantidad llega a 0, lo elimina.
   */
  const updateQuantity = (comboId: string, quantity: number) => {
    if (quantity <= 0) {
      // Si la cantidad es 0 o menos, lo elimina
      removeFromCart(comboId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.combo.id === comboId ? { ...item, quantity } : item
        )
      );
    }
  };

  /**
   * Elimina un item del carrito, sin importar la cantidad.
   */
  const removeFromCart = (comboId: string) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.combo.id !== comboId)
    );
  };

  /**
   * Vacía el carrito completamente.
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // 8. Pasa todos los valores y funciones al Provider
  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount,
    subtotal,
    impuesto,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};