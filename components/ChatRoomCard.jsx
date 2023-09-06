import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
const ChatRoomCard = ({ room }) => {
    const navigation = useNavigation();
    const { width } = Dimensions.get("window");
    console.log(room);
    return (
        <TouchableOpacity
            style={tw`p-2 rounded-lg mb-4`}
            onPress={() =>
                navigation.navigate("Chat", {
                    room: room,
                })
            }
        >
            <View
                style={tw` bg-white flex-row items-center p-2 shadow-lg shadow-[#ACAEAF] rounded-xl`}
            >
                <Image
                    source={
                        room?.photoURL
                            ? { uri: room.photoURL }
                            : require("../assets/icon.png")
                    }
                    style={{
                        ...tw`rounded-full h-[20] mr-4`,
                        width: width / 5,
                    }}
                    resizeMode='contain'
                />
                <Text style={tw`text-4 text-xl`}>{room.ChatName}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ChatRoomCard;
