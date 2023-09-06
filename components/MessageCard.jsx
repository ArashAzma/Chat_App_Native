import { View, Text, Image } from "react-native";
import React from "react";
import tw from "twrnc";
const MessageCard = ({ message, isUser }) => {
    const {
        message: text,
        user: { photoURL },
        timeStamp,
    } = message;
    const date = new Date(timeStamp?.toDate());

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return (
        <View style={tw`w-full ${isUser ? "items-end" : "items-start"} p-2 `}>
            <View style={tw`flex-row p-2`}>
                {!isUser && (
                    <Image
                        source={
                            photoURL
                                ? { uri: photoURL }
                                : require("../assets/icon.png")
                        }
                        style={{
                            ...tw`rounded-full w-13 h-[13] mr-1`,
                        }}
                        resizeMode='contain'
                    />
                )}
                <View
                    style={tw`${
                        isUser
                            ? "bg-blue-400 rounded-t-lg rounded-bl-lg"
                            : "bg-blue-600 rounded-t-lg rounded-br-lg"
                    } min-w-35% max-w-75% px-4 py-2 justify-center`}
                >
                    <Text style={tw`text-white text-4.5 `}>{text}</Text>
                </View>
            </View>
            <View
                style={tw`w-full ${
                    isUser ? "items-end" : "items-start"
                } opacity-60 px-3`}
            >
                <Text>{`${hours}:${minutes}`}</Text>
            </View>
        </View>
    );
};

export default MessageCard;
