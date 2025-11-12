import React from "react";
import { FlatList } from "react-native";
import Product from "./product"; // Este es tu componente 'product.tsx'
import { Local } from "../app/models"; // <-- 1. CAMBIAMOS a 'Local'

// 2. ELIMINA la 'interface Product' local (si la tenías)

interface Props {
    products: Local[]; // <-- 3. CAMBIAMOS a 'Local[]'
}

export default function ProductList({ products }: Props) {
    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id!} 
            // 4. CAMBIAMOS el prop a 'local'
            renderItem={({ item }) => <Product local={item} />} 
        />
    );
}