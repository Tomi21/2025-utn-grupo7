import React from "react";
import { FlatList, Image, StyleSheet, View, Dimensions } from "react-native";

type ImageSource = string | number; // string = uri, number = require()

interface Props {
    images: ImageSource[];
}

const { width } = Dimensions.get("window");

export default function ImageCarousel({ images }: Props) {
    return (
        <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                    <Image
                        source={typeof item === "string" ? { uri: item } : item}
                        style={styles.image}
                    />
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        width: width - 32, // Ajusta al padding de la card
        height: 150,
        marginRight: 8,
        borderRadius: 8,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
});
