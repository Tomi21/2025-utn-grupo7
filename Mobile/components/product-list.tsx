import React from "react";
import { FlatList } from "react-native";
import Product from "./product";

interface Product {
    id: string;
    name: string;
    puntaje: number;
    pickupTime?: string;
    price: number;
    image: string | any;
}

interface Props {
    products: Product[];
}

export default function ProductList({ products }: Props) {
    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Product {...item} />}
        />
    );
}
