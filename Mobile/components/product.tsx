import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import ImageCarousel from "./ui/image-carousel";

type ImageSource = string | number;

interface ProductProps {
    id: string;
    name: string;
    puntaje: number;
    pickupTime?: string;
    price: number;
    images: ImageSource[];
}

export default function Product({ id, name, puntaje, pickupTime, price, images }: ProductProps) {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${id}`)}
            activeOpacity={0.8}
        >
            {/* Carrusel de imágenes */}
            <ImageCarousel images={images} />

            {/* Nombre y puntaje */}
            <View style={styles.nameRow}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.puntaje}>⭐ {puntaje}</Text>
            </View>

            {/* Horario de retiro */}
            <Text style={styles.pickupTime}>
                Horario de retiro: {pickupTime ?? "No definida"}
            </Text>

            {/* Precio */}
            <Text style={styles.price}>${price.toFixed(2)}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        justifyContent: "space-between",
    },
    name: { fontSize: 18, fontWeight: "bold", marginTop: 8 },
    puntaje: { fontSize: 16, fontWeight: "bold", marginTop: 8, color: "#edcc13e2" },
    pickupTime: { fontSize: 16, marginTop: 8, color: "#555" },
    price: { fontSize: 16, fontWeight: "bold", color: "green", marginTop: 8 },
});
