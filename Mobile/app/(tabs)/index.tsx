import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import SearchBar from "../../components/ui/search-bar";
import ProductList from "../../components/product-list";
import { useIsFocused } from '@react-navigation/native'; // <-- Importamos useIsFocused
import { getLocales } from "../../services/firebaseService"; // <-- CAMBIADO a 'getLocales'
import { Local } from "../models"; // <-- CAMBIADO a 'Local'

export default function Index() {
  
  const isFocused = useIsFocused(); // <-- Usamos el hook

  // Los estados ahora son para 'Local'
  const [allLocales, setAllLocales] = useState<Local[]>([]); 
  const [filtered, setFiltered] = useState<Local[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modificamos el useEffect para que dependa de 'isFocused'
  useEffect(() => {
    
    // Movemos la función de carga aquí adentro
    const fetchLocales = async () => {
      try {
        setLoading(true);
        setError(null);
        const locales = await getLocales(); // <-- ¡AQUÍ ESTÁ LA MAGIA! Leemos los Locales
        
        // ¡Este es el filtro clave! Solo mostramos locales "listos"
        const localesListos = locales.filter(l => 
            l.featuredComboId && // Tiene combo destacado
            l.images && l.images.length > 0 && // Tiene imágenes
            l.puntaje != null && // Tiene puntaje (aunque sea 0)
            l.featuredComboPrice != null // Tiene el precio copiado
        );
        
        setAllLocales(localesListos);
        setFiltered(localesListos);
      } catch (e) {
        console.error("Error al cargar locales: ", e);
        setError("No se pudieron cargar los locales.");
      } finally {
        setLoading(false);
      }
    };
    
    // Solo llamamos a 'fetchLocales' si la pantalla está visible
    if (isFocused) {
        fetchLocales(); 
    }
    
  }, [isFocused]); // <-- 'isFocused' es la dependencia
  
  const handleSearch = (query: string) => {
    const lower = query.toLowerCase();
    // Filtramos sobre la lista de 'allLocales'
    const result = allLocales.filter((item) =>
      item.name.toLowerCase().includes(lower)
    );
    setFiltered(result);
  };

  // --- Manejo de UI de Carga y Error ---
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Cargando locales...</Text>
      </View>
    );
  }
  
  if (error) {
     return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // --- UI Principal (cuando ya cargó) ---
  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      
      {/* Ahora SÍ le estamos pasando la lista de 'Local[]' a 'ProductList'.
        'ProductList' y 'Product' (la tarjeta) ya están preparados 
        para recibir un Local y mostrar el carrusel, puntaje y precio.
      */}
      <ProductList products={filtered} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  // Añadimos estilos para los estados de carga y error
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: "#f9f9f9" 
  },
  errorText: { 
    fontSize: 16, 
    color: 'red',
    textAlign: 'center'
  }
});