import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import ImageCarousel from "./ui/image-carousel"; 
import { Local } from "../app/models"; 

interface Props {
  local: Local;
}

export default function Product({ local }: Props) { 
  
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${local.featuredComboId}`)}
            activeOpacity={0.8}
        >
            <ImageCarousel images={local.images?.filter(img => img) || []} />

            <View style={styles.content}>
                
                    <Text style={styles.name}>{local.name}</Text>
                    <Text style={styles.puntaje}>⭐ {local.puntaje?.toFixed(1) || '0.0'}</Text>
                    
               
                <View style={styles.separator} />
                {/* Agrupamos la info secundaria */}
                <View style={styles.infoGroup}>
        
                    {/* --- AQUÍ ESTÁ EL ARREGLO --- */}
                    {/* El texto "Retiro:" empieza en la misma línea que <Text> */}
                    <Text style={styles.infoText}>Retiro: {local.pickupTime ?? "No definido"}</Text>

                    {/* --- Y AQUÍ --- */}
                    {local.phone && (
                      <Text style={styles.infoText}>Tel: {local.phone}</Text>
                    )}
                </View>

                <Text style={styles.price}>
                    ${local.featuredComboPrice?.toFixed(2) || 'Error'}
                </Text>

            </View> 
        </TouchableOpacity>
    );
}

// Los estilos son los mismos que la última vez (¡estaban bien!)
const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden', 
    },
    content: { 
        paddingVertical: 12,
        paddingHorizontal: 16, 
    },
    nameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: '#333',
        flex: 1, 
        marginRight: 8,
    },
    puntaje: { 
        marginTop: 1,
        fontSize: 16, 
        fontWeight: "bold", 
        color: "#edcc13e2",
        textAlign: "right"
    },
    separator: {
    height: 1,
    backgroundColor: "#c5c5c5ff",
    marginVertical: 4,
    },
    infoGroup: { 
        marginTop: 1, 
    },
    infoText: { 
        fontSize: 16, 
        color: "#555",
        marginBottom: 4, 
    },
    price: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: "green", 
        marginTop: 8, 
    }, 
});