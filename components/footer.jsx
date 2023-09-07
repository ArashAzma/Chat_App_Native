import { View, TouchableWithoutFeedback } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import tw from "twrnc";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";
import { userContext } from "../context/UserProvider";

const Footer = ({ nav }) => {
    const { user } = useContext(userContext);
    const [home, setHome] = useState(true);
    const [account, setAccount] = useState(false);
    const routeName = useNavigationState((state) => {
        const arr = state?.routes;
        return arr?.[arr?.length - 1]?.name;
    });
    useEffect(() => {
        console.log(routeName);
        setHome(routeName == "Home");
        setAccount(routeName == "Account");
    }, [routeName]);
    return (
        <View
            style={tw`h-20 w-full flex-row justify-evenly items-center bg-[#FDFEFE]`}
        >
            {/* home */}
            <TouchableWithoutFeedback
                onPress={() => {
                    nav.navigate("Home");
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
            {/* account */}
            <TouchableWithoutFeedback
                onPress={() => {
                    nav.push("Account", { accountUser: user });
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
