# Guide de Configuration Firebase - TP 8 React Native

Ce document détaille toutes les étapes pour configurer Firebase pour votre application Todo.

## 📋 Étape 1 – Créer le projet Firebase

### 1.1 Accéder à Firebase Console
1. Ouvrir https://console.firebase.google.com
2. Cliquer sur **"Ajouter un projet"** ou **"Créer un projet"**

### 1.2 Configuration du projet
1. **Nom du projet** : Choisir un nom (ex: "todo-app-tp8")
2. **Google Analytics** : **DÉSACTIVER** (décocher l'option)
3. Cliquer sur **"Créer un projet"**
4. Attendre la création du projet (quelques secondes)
5. Cliquer sur **"Continuer"**

---

## 🔐 Étape 2 – Activer l'authentification

### 2.1 Accéder à Authentication
1. Dans le menu latéral, cliquer sur **"Authentication"**
2. Cliquer sur **"Get started"** (Commencer)

### 2.2 Activer Email/Mot de passe
1. Dans l'onglet **"Sign-in method"**
2. Cliquer sur **"Email/Password"**
3. Activer le premier bouton : **"Email/Password"** ✅
4. **NE PAS** activer "Email link (passwordless sign-in)"
5. Cliquer sur **"Enregistrer"**

### 2.3 Activer Google Sign-In
1. Toujours dans **"Sign-in method"**
2. Cliquer sur **"Google"**
3. Activer le bouton **"Activer"** ✅
4. **Email d'assistance du projet** : Entrer votre email
5. Cliquer sur **"Enregistrer"**

### 2.4 Récupérer le Google Web Client ID
1. Dans la configuration Google que vous venez d'activer
2. Développer la section **"Web SDK configuration"**
3. **Copier le "Web client ID"** (format: xxxxx.apps.googleusercontent.com)
4. Le sauvegarder pour plus tard (vous en aurez besoin dans le .env)

---

## 🗄️ Étape 3 – Configurer Firestore Database

### 3.1 Créer la base de données
1. Dans le menu latéral, cliquer sur **"Firestore Database"**
2. Cliquer sur **"Créer une base de données"**

### 3.2 Choisir le mode de sécurité
1. Sélectionner **"Démarrer en mode test"** ⚠️
2. Cliquer sur **"Suivant"**

**⚠️ IMPORTANT** : Le mode test permet à tout le monde de lire/écrire pendant 30 jours. C'est OK pour le développement, mais **À SÉCURISER EN PRODUCTION**.

### 3.3 Choisir l'emplacement
1. Sélectionner une région proche (ex: "europe-west1" pour l'Europe)
2. Cliquer sur **"Activer"**
3. Attendre la création de la base de données

### 3.4 Structure des données
La collection `todos` sera créée automatiquement lors de l'ajout de la première tâche.

Structure attendue :
```
todos/
  └── {todoId}/
      ├── title: string
      ├── userId: string
      └── createdAt: timestamp
```

Pour une structure par utilisateur (recommandé) :
```
users/
  └── {userId}/
      └── todos/
          └── {todoId}/
              ├── title: string
              ├── completed: boolean
              └── createdAt: number
```

---

## 🔑 Étape 4 – Récupérer les clés de configuration

### 4.1 Ajouter une application Web
1. Sur la page d'accueil du projet, cliquer sur l'icône **Web** `</>`
2. **Nom de l'application** : "Todo App" (ou autre)
3. **NE PAS** cocher "Firebase Hosting"
4. Cliquer sur **"Enregistrer l'application"**

### 4.2 Copier la configuration
Vous verrez un code similaire à :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  appId: "1:123456789:web:abcdef123456"
};
```

**Copier ces 4 valeurs** (vous en aurez besoin pour le .env)

### 4.3 Alternative : Récupérer depuis les paramètres
Si vous avez déjà créé l'app :
1. Cliquer sur l'icône **⚙️** (Paramètres) → **Paramètres du projet**
2. Descendre jusqu'à **"Vos applications"**
3. Sélectionner votre application Web
4. Copier les valeurs de `firebaseConfig`

---

## 📝 Étape 5 – Configurer le fichier .env

### 5.1 Créer le fichier .env
À la racine du projet `todo/`, créer un fichier nommé `.env`

### 5.2 Remplir les variables
Copier ce template et remplacer les valeurs :

```env
EXPO_PUBLIC_FIREBASE_API_KEY=votre_api_key_ici
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=votre-projet-id
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123456789-xxxxx.apps.googleusercontent.com
```

### 5.3 Correspondance des valeurs

| Variable .env | Valeur Firebase |
|---------------|-----------------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | `apiKey` |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | `appId` |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Web client ID (depuis Authentication → Google) |

### 5.4 Exemple complet
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBlTTDIybI9YqXxcrtyQfq5VCcRLPFoobk
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=todo-app-12345.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=todo-app-12345
EXPO_PUBLIC_FIREBASE_APP_ID=1:372697923404:web:62401b3a0b44c4c23ad9e9
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=372697923404-abc123def456.apps.googleusercontent.com
```

---

## ✅ Étape 6 – Vérifier la configuration

### 6.1 Checklist
- [ ] Projet Firebase créé
- [ ] Authentication activée (Email + Google)
- [ ] Firestore Database créée (mode test)
- [ ] Application Web ajoutée
- [ ] Fichier `.env` créé et rempli
- [ ] Les 5 variables d'environnement sont définies

### 6.2 Tester la configuration
1. Redémarrer le serveur Expo :
   ```bash
   npm start
   ```

2. Lancer en mode web (pour Google Sign-In) :
   ```bash
   npm run web
   ```

3. Tester :
   - Créer un compte avec email/mot de passe
   - Se connecter
   - Ajouter une tâche
   - Vérifier dans Firestore Console que la tâche apparaît

---

## 🔒 Étape 7 – Sécuriser Firestore (OPTIONNEL pour production)

### 7.1 Règles de sécurité recommandées
Dans Firestore Database → Règles, remplacer par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour la collection todos globale
    match /todos/{todoId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    // Règles pour les todos par utilisateur (structure recommandée)
    match /users/{userId}/todos/{todoId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 7.2 Explication
- `request.auth != null` : L'utilisateur doit être authentifié
- `request.auth.uid == userId` : L'utilisateur ne peut accéder qu'à ses propres données
- Ces règles remplacent le mode test et sécurisent vos données

---

## 🐛 Dépannage

### Erreur : "Invalid API Key"
- Vérifier que toutes les variables dans `.env` sont correctes
- Redémarrer le serveur Expo après modification du `.env`
- Vérifier qu'il n'y a pas d'espaces avant/après les valeurs

### Google Sign-In ne fonctionne pas
- S'assurer de lancer en mode **web** : `npm run web`
- Vérifier que `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` est le bon
- Pour Android/iOS, configuration supplémentaire nécessaire (SHA-1, etc.)

### Firestore : Permission denied
- Vérifier que vous êtes en mode test
- Vérifier que l'utilisateur est bien authentifié
- Si en production, vérifier les règles de sécurité

### Les données ne s'affichent pas
- Ouvrir Firestore Console
- Vérifier que la collection `todos` existe
- Vérifier la structure des documents
- Vérifier les logs de la console pour les erreurs

---

## 📚 Ressources

- [Documentation Firebase](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Expo Firebase](https://docs.expo.dev/guides/using-firebase/)

---

## ✨ Prochaines étapes

Une fois la configuration terminée :
1. Tester toutes les fonctionnalités d'authentification
2. Ajouter/supprimer des tâches
3. Tester les fonctionnalités natives (caméra, localisation, etc.)
4. Explorer le mode sombre/clair
5. Déployer en production (avec règles de sécurité)

Bon développement ! 🚀
