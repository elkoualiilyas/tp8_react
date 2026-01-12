import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { useContext, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { ThemeContext } from "../context/ThemeContext";


export default function RegisterScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const register = async () => {
        setError("");

        // Validation des champs
        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        if (!email.includes("@")) {
            setError("Email invalide");
            return;
        }

        if (password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (e) {
            console.error("Erreur d'inscription:", e.code, e.message);
            if (e.code === "auth/email-already-in-use") {
                setError("Un compte existe déjà avec cet email");
            } else if (e.code === "auth/weak-password") {
                setError("Le mot de passe est trop faible");
            } else if (e.code === "auth/invalid-email") {
                setError("Email invalide");
            } else {
                setError("Erreur lors de la création du compte");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header avec gradient */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>
                        Créer un compte
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.text + "99" }]}>
                        Rejoignez-nous pour gérer vos tâches
                    </Text>
                </View>

                {/* Formulaire */}
                <View style={styles.formContainer}>
                    {error !== "" && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>⚠️ {error}</Text>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>
                            Email
                        </Text>
                        <TextInput
                            placeholder="votre@email.com"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={[
                                styles.input,
                                {
                                    color: theme.text,
                                    backgroundColor: theme.card,
                                    borderColor: theme.primary + "40",
                                },
                            ]}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>
                            Mot de passe
                        </Text>
                        <TextInput
                            placeholder="••••••••"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={[
                                styles.input,
                                {
                                    color: theme.text,
                                    backgroundColor: theme.card,
                                    borderColor: theme.primary + "40",
                                },
                            ]}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>
                            Confirmer le mot de passe
                        </Text>
                        <TextInput
                            placeholder="••••••••"
                            placeholderTextColor="#999"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            style={[
                                styles.input,
                                {
                                    color: theme.text,
                                    backgroundColor: theme.card,
                                    borderColor: theme.primary + "40",
                                },
                            ]}
                        />
                    </View>

                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            color={theme.primary}
                            style={styles.loader}
                        />
                    ) : (
                        <TouchableOpacity
                            onPress={register}
                            style={[
                                styles.registerButton,
                                { backgroundColor: theme.primary },
                            ]}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.registerButtonText}>
                                Créer mon compte
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: theme.text + "99" }]}>
                            Vous avez déjà un compte ?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text
                                style={[
                                    styles.footerLink,
                                    { color: theme.primary },
                                ]}
                            >
                                Se connecter
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
    },
    header: {
        marginBottom: 40,
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
    },
    formContainer: {
        width: "100%",
    },
    errorContainer: {
        backgroundColor: "#FFE5E5",
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: "#FF4444",
    },
    errorText: {
        color: "#CC0000",
        fontSize: 14,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
    },
    loader: {
        marginVertical: 20,
    },
    registerButton: {
        padding: 18,
        borderRadius: 12,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    registerButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
        alignItems: "center",
    },
    footerText: {
        fontSize: 14,
    },
    footerLink: {
        fontSize: 14,
        fontWeight: "bold",
    },
});
