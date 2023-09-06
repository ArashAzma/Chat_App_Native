import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";
import SplashScreen from "./SplashScreen";
import ChatScreen from "./ChatScreen";
import AccountScreen from "./AccountScreen";
import Footer from "../components/footer";
import ChatRoomCreation from "./ChatRoomCreation";
const Stack = createNativeStackNavigator();

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name='Splash' component={SplashScreen} />
                <Stack.Screen name='Login' component={LoginScreen} />
                <Stack.Screen name='Signup' component={SignupScreen} />
                <Stack.Screen name='Home' component={HomeScreen} />
                <Stack.Screen name='Chat' component={ChatScreen} />
                <Stack.Screen name='Account' component={AccountScreen} />
                <Stack.Screen
                    name='ChatCreation'
                    component={ChatRoomCreation}
                />
            </Stack.Navigator>
            <Footer />
        </NavigationContainer>
    );
};

export default AppNavigation;
