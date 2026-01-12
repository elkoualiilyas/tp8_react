import { View, Text, FlatList, Button, TextInput, StyleSheet } from "react-native";
import { useEffect, useContext, useState } from "react";
import { useTodoStore } from "../store/useTodoStore";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import AppBar from "../components/AppBar";

export default function TodoListScreen() {
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const { todos, loadTodos, addTodo } = useTodoStore();

    const [title, setTitle] = useState("");

    useEffect(() => {
        if (user) {
            loadTodos(user.uid);
        }
    }, [user]);

    const handleAddTodo = () => {
        if (!title.trim()) return;

        addTodo(user.uid, title);
        setTitle("");
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <AppBar title="Mes tâches" />

            {/* Champ de saisie */}
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Nouvelle tâche..."
                    placeholderTextColor="#999"
                    value={title}
                    onChangeText={setTitle}
                    style={[styles.input, { color: theme.text, borderColor: theme.primary }]}
                />

                <Button title="Ajouter la tâche" onPress={handleAddTodo} color={theme.primary} />
            </View>

            {/* Liste */}
            <FlatList
                data={todos}
                keyExtractor={(i) => i.id.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.todoItem, { backgroundColor: theme.card }]}>
                        <Text style={[styles.todoText, { color: theme.text }]}>
                            • {item.title}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        padding: 15,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    todoItem: {
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 8,
    },
    todoText: {
        fontSize: 16,
    },
});
