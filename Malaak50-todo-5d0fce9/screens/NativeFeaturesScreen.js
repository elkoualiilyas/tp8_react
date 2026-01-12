import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import AppBar from "../components/AppBar";

export default function NativeFeaturesScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <AppBar title="Fonctionnalités natives" />

            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.card }]}
                    onPress={() => navigation.navigate("Caméra")}
                >
                    <Text style={[styles.buttonText, { color: theme.text }]}>
                        📷 Caméra
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.card }]}
                    onPress={() => navigation.navigate("Localisation")}
                >
                    <Text style={[styles.buttonText, { color: theme.text }]}>
                        📍 Géolocalisation
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.card }]}
                    onPress={() => navigation.navigate("Contacts")}
                >
                    <Text style={[styles.buttonText, { color: theme.text }]}>
                        👥 Contacts
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.card }]}
                    onPress={() => navigation.navigate("Notifications")}
                >
                    <Text style={[styles.buttonText, { color: theme.text }]}>
                        🔔 Notifications
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    button: {
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
    },
});
