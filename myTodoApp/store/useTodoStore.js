import { create } from "zustand";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { db } from "../services/firebase";

export const useTodoStore = create((set, get) => ({
    todos: [],
    loading: false,

    loadTodos: async (uid) => {
        try {
            set({ loading: true });

            // Charger uniquement depuis Firestore (sans orderBy pour éviter l'index composite)
            const q = query(
                collection(db, "todos"),
                where("userId", "==", uid)
            );

            const snapshot = await getDocs(q);
            const todos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Trier côté client par date de création (du plus récent au plus ancien)
            todos.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                return dateB - dateA;
            });

            set({ todos, loading: false });
        } catch (error) {
            console.error("Error loading todos:", error);
            set({ loading: false });
        }
    },

    addTodo: async (uid, title) => {
        try {
            // Ajouter uniquement à Firestore
            await addDoc(collection(db, "todos"), {
                title,
                userId: uid,
                completed: false,
                createdAt: new Date(),
            });

            // Recharger les tâches
            get().loadTodos(uid);
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    },

    toggleTodo: async (uid, todoId, completed) => {
        try {
            await updateDoc(doc(db, "todos", todoId), {
                completed: !completed,
            });

            // Recharger les tâches
            get().loadTodos(uid);
        } catch (error) {
            console.error("Error toggling todo:", error);
        }
    },

    deleteTodo: async (uid, todoId) => {
        try {
            await deleteDoc(doc(db, "todos", todoId));

            // Recharger les tâches
            get().loadTodos(uid);
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    },
}));
