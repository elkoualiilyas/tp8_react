import * as Contacts from "expo-contacts";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import AppBar from "../components/AppBar";

export default function ContactsScreen() {
    const { theme } = useContext(ThemeContext);
    const [contacts, setContacts] = useState([]);

    const loadContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== "granted") return;

        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Name],
        });
        setContacts(data);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <AppBar title="Contacts" back />
            <View style={styles.container}>
                <Button title="Charger contacts" onPress={loadContacts} />
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Text style={{ color: theme.text, padding: 10 }}>{item.name}</Text>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
});
