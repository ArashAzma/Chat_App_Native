import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppNavigation from "./screens/AppNavigation";
import UserProvider from "./context/UserProvider";

export default function App() {
    return (
        <>
            <StatusBar style='auto' />
            <UserProvider>
                <AppNavigation />
            </UserProvider>
        </>
    );
}
