import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function AppBar({ title, back }) {
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);

    return (
        <View style={[styles.container, { backgroundColor: theme.primary }]}>
            {back && (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Retour</Text>
                </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 40,
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        marginRight: 10,
    },
    backText: {
        color: "#fff",
        fontSize: 16,
    },
    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
});
