import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { products } from "../productsData";
import SearchBar from "../../components/ui/search-bar";
import ProductList from "../../components/product-list";

export default function Index() {
  const [filtered, setFiltered] = useState(products);

  const handleSearch = (query: string) => {
    const lower = query.toLowerCase();
    const result = products.filter((item) =>
      item.name.toLowerCase().includes(lower)
    );
    setFiltered(result);
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      <ProductList products={filtered} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
});
