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
import { useContext, useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithCredential,
} from "firebase/auth";

import { auth } from "../services/firebase";
import { ThemeContext } from "../context/ThemeContext";

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

export default function LoginScreen({ navigation }) {
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔐 Google Auth (WEB – Expo)
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: WEB_CLIENT_ID,
        responseType: "id_token",
        scopes: ["profile", "email"],
    });

    // 🔐 Handle Google response
    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;

            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential).catch(() =>
                setError("Erreur Google Sign-In")
            );
        }
    }, [response]);

    const login = async () => {
        setError("");

        // Validation des champs
        if (!email.trim() || !password.trim()) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        if (!email.includes("@")) {
            setError("Email invalide");
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
            console.error("Erreur de connexion:", e.code, e.message);
            if (e.code === "auth/user-not-found") {
                setError("Aucun compte trouvé avec cet email");
            } else if (e.code === "auth/wrong-password") {
                setError("Mot de passe incorrect");
            } else if (e.code === "auth/invalid-email") {
                setError("Email invalide");
            } else if (e.code === "auth/invalid-credential") {
                setError("Email ou mot de passe incorrect");
            } else {
                setError("Erreur de connexion. Veuillez réessayer.");
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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>
                        Bienvenue 👋
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.text + "99" }]}>
                        Connectez-vous pour continuer
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

                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            color={theme.primary}
                            style={styles.loader}
                        />
                    ) : (
                        <>
                            <TouchableOpacity
                                onPress={login}
                                style={[
                                    styles.loginButton,
                                    { backgroundColor: theme.primary },
                                ]}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.loginButtonText}>
                                    Se connecter
                                </Text>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.divider}>
                                <View
                                    style={[
                                        styles.dividerLine,
                                        { backgroundColor: theme.text + "30" },
                                    ]}
                                />
                                <Text
                                    style={[
                                        styles.dividerText,
                                        { color: theme.text + "99" },
                                    ]}
                                >
                                    OU
                                </Text>
                                <View
                                    style={[
                                        styles.dividerLine,
                                        { backgroundColor: theme.text + "30" },
                                    ]}
                                />
                            </View>

                            {/* Google Sign-In */}
                            <TouchableOpacity
                                disabled={!request}
                                onPress={() => promptAsync()}
                                style={styles.googleButton}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.googleButtonText}>
                                    🔐 Continuer avec Google
                                </Text>
                            </TouchableOpacity>

                            {/* Footer */}
                            <View style={styles.footer}>
                                <Text
                                    style={[
                                        styles.footerText,
                                        { color: theme.text + "99" },
                                    ]}
                                >
                                    Pas encore de compte ?{" "}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("Register")}
                                >
                                    <Text
                                        style={[
                                            styles.footerLink,
                                            { color: theme.primary },
                                        ]}
                                    >
                                        Créer un compte
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>

                {/* Theme Toggle */}
                <TouchableOpacity
                    onPress={toggleTheme}
                    style={styles.themeToggle}
                >
                    <Text style={[styles.themeToggleText, { color: theme.primary }]}>
                        {theme.background === "#fff" ? "🌙" : "☀️"} Changer le thème
                    </Text>
                </TouchableOpacity>
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
        fontSize: 36,
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
    loginButton: {
        padding: 18,
        borderRadius: 12,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 10,
        fontSize: 14,
    },
    googleButton: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    googleButtonText: {
        color: "#333",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
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
    themeToggle: {
        marginTop: 20,
        alignItems: "center",
    },
    themeToggleText: {
        fontSize: 14,
        fontWeight: "600",
    },
});
