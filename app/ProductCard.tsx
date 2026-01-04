import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Product {
  id: string;
  name: string;
  source: any;
  price: number;   // 👈 changed
  weight: string;
}


export default function ProductCard({ item, onAddToCart, onPress }: { item: Product, onAddToCart: () => void, onPress?: () => void }) {
    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={onPress} style={{alignItems: 'center', width: '100%'}}>
                 <Image source={item.source} style={styles.image} resizeMode="contain" />
                 <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                 <Text style={styles.weight}>{item.weight}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={onAddToCart}>
                <Text style={styles.buttonText}>ADD +</Text>
            </TouchableOpacity>
            
            {/* Price Tag positioned absolute */}
            <Text style={styles.price}>₹{item.price}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 12,
        margin: 8,
        width: 160,
        backgroundColor: "#fff",
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 0, // Removed border for cleaner look
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    name: {
        fontWeight: "700",
        fontSize: 15,
        color: "#2E3B2E",
        textAlign: "center",
        marginBottom: 4,
    },
    weight: {
        color: "#888",
        fontSize: 12,
        marginBottom: 8,
    },
    price: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: "#E8EFE6",
        color: "#416944",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        fontWeight: "700",
        fontSize: 12,
        overflow: 'hidden', // Ensures border radius works on text
    },
    button: {
        backgroundColor: "#416944",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 6,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 13,
    },
});
