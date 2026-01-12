import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useTodoStore } from "../store/useTodoStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user, logout } = useContext(AuthContext);
    const { todos, loading, loadTodos, addTodo, toggleTodo, deleteTodo } = useTodoStore();

    const [modalVisible, setModalVisible] = useState(false);
    const [newTodo, setNewTodo] = useState("");

    useEffect(() => {
        if (user) {
            loadTodos(user.uid);
        }
    }, [user]);

    const handleAddTodo = async () => {
        if (!newTodo.trim()) return;

        await addTodo(user.uid, newTodo);
        setNewTodo("");
        setModalVisible(false);
    };

    const handleToggleTodo = async (todoId, completed) => {
        await toggleTodo(user.uid, todoId, completed);
    };

    const handleDeleteTodo = async (todoId) => {
        await deleteTodo(user.uid, todoId);
    };

    const completedCount = todos.filter(t => t.completed).length;
    const totalCount = todos.length;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: theme.text + "99" }]}>
                        Bonjour 👋
                    </Text>
                    <Text style={[styles.userName, { color: theme.text }]}>
                        {user?.email?.split("@")[0]}
                    </Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={toggleTheme}
                        style={[styles.iconButton, { backgroundColor: theme.card }]}
                    >
                        <Text style={styles.iconText}>
                            {theme.background === "#fff" ? "🌙" : "☀️"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={logout}
                        style={[styles.iconButton, { backgroundColor: theme.card }]}
                    >
                        <Text style={styles.iconText}>🚪</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stats Card */}
            <View style={[styles.statsCard, { backgroundColor: theme.primary }]}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{totalCount}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{completedCount}</Text>
                    <Text style={styles.statLabel}>Terminées</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{totalCount - completedCount}</Text>
                    <Text style={styles.statLabel}>En cours</Text>
                </View>
            </View>

            {/* Section Title */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Mes tâches
                </Text>
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: theme.primary }]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>+ Ajouter</Text>
                </TouchableOpacity>
            </View>

            {/* Todo List */}
            {loading ? (
                <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
            ) : todos.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📝</Text>
                    <Text style={[styles.emptyText, { color: theme.text + "99" }]}>
                        Aucune tâche pour le moment
                    </Text>
                    <Text style={[styles.emptySubtext, { color: theme.text + "66" }]}>
                        Appuyez sur "Ajouter" pour créer votre première tâche
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={todos}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <View style={[styles.todoCard, { backgroundColor: theme.card }]}>
                            <TouchableOpacity
                                style={styles.todoContent}
                                onPress={() => handleToggleTodo(item.id, item.completed)}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        {
                                            borderColor: theme.primary,
                                            backgroundColor: item.completed
                                                ? theme.primary
                                                : "transparent",
                                        },
                                    ]}
                                >
                                    {item.completed && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </View>
                                <Text
                                    style={[
                                        styles.todoTitle,
                                        { color: theme.text },
                                        item.completed && styles.todoCompleted,
                                    ]}
                                >
                                    {item.title}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDeleteTodo(item.id)}
                                style={styles.deleteButton}
                            >
                                <Text style={styles.deleteIcon}>🗑️</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            {/* Modal Form */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                            Nouvelle tâche
                        </Text>

                        <TextInput
                            placeholder="Titre de la tâche"
                            placeholderTextColor="#999"
                            value={newTodo}
                            onChangeText={setNewTodo}
                            style={[
                                styles.modalInput,
                                {
                                    color: theme.text,
                                    backgroundColor: theme.card,
                                    borderColor: theme.primary + "40",
                                },
                            ]}
                            autoFocus
                        />

                        <TouchableOpacity
                            onPress={handleAddTodo}
                            style={[styles.modalButton, { backgroundColor: theme.primary }]}
                        >
                            <Text style={styles.modalButtonText}>Ajouter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                setNewTodo("");
                            }}
                            style={styles.modalCancelButton}
                        >
                            <Text style={[styles.modalCancelText, { color: theme.text + "99" }]}>
                                Annuler
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    greeting: {
        fontSize: 14,
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
    },
    headerActions: {
        flexDirection: "row",
        gap: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    iconText: {
        fontSize: 20,
    },
    statsCard: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statNumber: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#fff",
        opacity: 0.9,
    },
    statDivider: {
        width: 1,
        backgroundColor: "#fff",
        opacity: 0.3,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    addButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    loader: {
        marginTop: 40,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
        textAlign: "center",
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: "center",
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    todoCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    todoContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    checkmark: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    todoTitle: {
        fontSize: 16,
        flex: 1,
    },
    todoCompleted: {
        textDecorationLine: "line-through",
        opacity: 0.5,
    },
    deleteButton: {
        padding: 8,
    },
    deleteIcon: {
        fontSize: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 20,
    },
    modalContent: {
        padding: 24,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalInput: {
        borderWidth: 1,
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    modalButton: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    modalButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalCancelButton: {
        padding: 12,
    },
    modalCancelText: {
        textAlign: "center",
        fontSize: 14,
    },
});
