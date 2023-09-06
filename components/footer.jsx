import { View, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
const Footer = () => {
    const navigation = useNavigation();
    const routeName = useNavigationState((state) => {
        const arr = state?.routes;
        return arr?.[arr?.length - 1]?.name;
    });
    const [home, setHome] = useState(true);
    const [account, setAccount] = useState(false);
    const handleTab = (name) => {
        setHome(name == "home");
        setAccount(name == "account");
    };
    return (
        <View
            style={tw`${
                routeName == "Login" || routeName == "Signup"
                    ? "invisible "
                    : "visible "
            } h-20 w-full flex-row justify-evenly items-center`}
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    navigation.navigate("Home");
                    handleTab("home");
                }}
            >
                <View style={tw`flex items-center`}>
                    <Feather
                        name='message-square'
                        size={26}
                        color='black'
                        style={tw`${!home ? "opacity-40" : ""}`}
                    />
                    {home && (
                        <FontAwesome
                            name='circle'
                            size={10}
                            color='black'
                            style={tw`absolute -bottom-2 opacity-80`}
                        />
                    )}
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
                onPress={() => {
                    navigation.navigate("Account");
                    handleTab("account");
                }}
            >
                <View style={tw`flex items-center`}>
                    <MaterialIcons
                        name='person-outline'
                        size={32}
                        color='black'
                        style={tw`${!account ? "opacity-40" : ""}`}
                    />
                    {account && (
                        <FontAwesome
                            name='circle'
                            size={10}
                            color='black'
                            style={tw`absolute -bottom-2 opacity-80`}
                        />
                    )}
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default Footer;
