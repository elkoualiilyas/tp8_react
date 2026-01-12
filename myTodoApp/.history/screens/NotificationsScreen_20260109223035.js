import { View, Text, Button, StyleSheet } from "react-native"; 
import * as Notifications from "expo-notifications"; 
import AppBar from "../components/AppBar"; 
 
// Gestionnaire obligatoire (sinon Android n’affiche rien) 
Notifications.setNotificationHandler({ 
 handleNotification: async () => ({ 
   shouldShowAlert: true, 
   shouldPlaySound: true, 
   shouldSetBadge: false, 
 }), 
}); 
 
export default function NotificationsScreen() { 
 const requestPermission = async () => { 
   const { status } = await Notifications.requestPermissionsAsync(); 
   alert( 
     status === "granted" 
       ? "Permission accordée" 
       : "Permission refusée" 
   ); 
 }; 
 const sendTestNotification = async () => { 
   await Notifications.scheduleNotificationAsync({ 
     content: { 
       title: "
🔔
 Notification locale", 
       body: "Ceci est une notification locale de test", 
     }, 
     trigger: null, // immédiat 
   }); 
 }; 
 
 return ( 
   <View style={{ flex: 1 }}> 
     <AppBar title="Notifications" back /> 
 
     <View style={styles.container}> 
       <Text style={styles.title}>Gestion des notifications locales</Text> 
 
       <Button title="Demander permission" onPress={requestPermission} /> 
 
       <View style={styles.spacer} /> 
 
       <Button 
         title="Notification immédiate" 
         onPress={sendTestNotification} 
       /> 
 
       <View style={styles.spacer} /> 
     </View> 
   </View> 
 ); 
} 
 
const styles = StyleSheet.create({ 
 container: { 
padding: 20, 
}, 
title: { 
fontSize: 18, 
marginBottom: 20, 
fontWeight: "bold", 
textAlign: "center", 
}, 
spacer: { 
height: 15, 
}, 
});