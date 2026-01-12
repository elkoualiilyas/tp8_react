import * as Location from "expo-location";
import { View, Text, Button, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import AppBar from "../components/AppBar";

export default function LocationScreen() {
    const { theme } = useContext(ThemeContext);
    const [location, setLocation] = useState(null);

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <AppBar title="Localisation" back />
            <View style={styles.container}>
                <Button title="Obtenir position" onPress={getLocation} />
                {location && (
                    <Text style={{ color: theme.text, marginTop: 20 }}>
                        Lat: {location.latitude} | Lng: {location.longitude}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
});
