import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";

interface Local {
    id?: string;
    name: string;
    pickupTime?: string;
    direccion?: string;
    phone?: string;
    email?: string;
    images?: string[]; // 0..3
    categoryIds?: string[]; // many-to-many
}

// Mock de categorías
const categorias = [
    { id: "1", name: "Restaurante" },
    { id: "2", name: "Supermercado" },
    { id: "3", name: "Cafetería" },
];

export default function FormularioLocal() {
    const router = useRouter();

    const [local, setLocal] = useState<Local>({
        name: "",
        pickupTime: "",
        direccion: "",
        phone: "",
        email: "",
        images: [],
        categoryIds: [],
    });

    // Función para cambiar campos de texto
    const handleChange = (field: keyof Local, value: string) => {
        setLocal({ ...local, [field]: value });
    };

    // Toggle de categorías
    const toggleCategory = (id: string) => {
        const selected = local.categoryIds || [];
        if (selected.includes(id)) {
            setLocal({ ...local, categoryIds: selected.filter((c) => c !== id) });
        } else {
            setLocal({ ...local, categoryIds: [...selected, id] });
        }
    };

    const handleGuardar = () => {
        if (!local.name) {
            Alert.alert("Error", "El nombre es obligatorio");
            return;
        }
        console.log("Local guardado:", local);
        router.back(); // vuelve a lista de locales
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
            <Stack.Screen options={{ title: "Nuevo Local" }} />

            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre del local"
                value={local.name}
                onChangeText={(v) => handleChange("name", v)}
            />

            <Text style={styles.label}>Horario de Retiro</Text>
            <TextInput
                style={styles.input}
                placeholder="Ej: 10:00 - 20:00"
                value={local.pickupTime}
                onChangeText={(v) => handleChange("pickupTime", v)}
            />

            <Text style={styles.label}>Dirección</Text>
            <TextInput
                style={styles.input}
                placeholder="Calle y número"
                value={local.direccion}
                onChangeText={(v) => handleChange("direccion", v)}
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
                style={styles.input}
                placeholder="Teléfono de contacto"
                keyboardType="phone-pad"
                value={local.phone}
                onChangeText={(v) => handleChange("phone", v)}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={local.email}
                onChangeText={(v) => handleChange("email", v)}
            />

            <Text style={styles.label}>URLs de imágenes (0..3)</Text>
            {[0, 1, 2].map((i) => (
                <TextInput
                    key={i}
                    style={styles.input}
                    placeholder={`URL de imagen ${i + 1}`}
                    value={local.images?.[i] || ""}
                    onChangeText={(v) => {
                        const imgs = local.images ? [...local.images] : [];
                        imgs[i] = v;
                        setLocal({ ...local, images: imgs });
                    }}
                />
            ))}

            <Text style={styles.label}>Categorías</Text>
            {categorias.map((cat) => (
                <TouchableOpacity
                    key={cat.id}
                    style={[
                        styles.checkbox,
                        local.categoryIds?.includes(cat.id) && styles.checkboxSelected,
                    ]}
                    onPress={() => toggleCategory(cat.id)}
                >
                    <Text
                        style={{
                            color: local.categoryIds?.includes(cat.id) ? "#fff" : "#333",
                        }}
                    >
                        {cat.name}
                    </Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleGuardar}>
                <Text style={styles.buttonText}>Guardar Local</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8f8", padding: 20 },
    label: { fontSize: 16, fontWeight: "500", marginBottom: 6, marginTop: 12 },
    input: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
    },
    checkbox: {
        padding: 12,
        marginVertical: 4,
        borderRadius: 8,
        backgroundColor: "#e0e0e0",
    },
    checkboxSelected: {
        backgroundColor: "#007AFF",
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
