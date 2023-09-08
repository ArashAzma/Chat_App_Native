import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import tw from "twrnc";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { fireDb } from "../config/firebase.config";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatRoomCard from "../components/ChatRoomCard";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../components/footer";
const HomeScreen = ({ navigation }) => {
    const [chatRooms, setChatRooms] = useState();
    useLayoutEffect(() => {
        try {
            const chatQuery = query(
                collection(fireDb, "Chats"),
                orderBy("_id", "desc")
            );
            const unsubscribe = onSnapshot(chatQuery, (queryShot) => {
                const rooms = queryShot.docs.map((doc) => doc.data());
                setChatRooms(rooms);
            });
        } catch (error) {
            console.log(error);
        }
    }, []);
    return (
        <>
            <View style={tw`flex-1 items-center bg-[#FDFEFE] p-3`}>
                <SafeAreaView style={tw`h-full w-full items-center`}>
                    <View
                        style={tw`w-full flex-0.12 flex-row justify-between p-6 items-center`}
                    >
                        <View>
                            <Text style={tw`font-bold text-4xl`}>
                                Chat Rooms
                            </Text>
                            <Ionicons
                                name='chatbubbles-outline'
                                size={32}
                                color='black'
                                style={tw`absolute -right-10 -top-2`}
                            />
                        </View>
                    </View>
                    <View style={tw`flex-1 w-full`}>
                        <ScrollView
                            contentContainerStyle={tw`p-4`}
                            showsVerticalScrollIndicator={false}
                        >
                            {chatRooms && chatRooms.length > 0 ? (
                                <>
                                    {chatRooms.map((room) => (
                                        <ChatRoomCard
                                            room={room}
                                            key={room._id}
                                        />
                                    ))}
                                </>
                            ) : (
                                <View
                                    style={tw`w-full h-full items-center justify-center`}
                                >
                                    <Text>Empty</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                    <View
                        style={tw`flex-row mt-4 gap-2 justify-end w-full px-6 items-center absolute bottom-0`}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.navigate("ChatCreation")}
                            style={tw`bg-green-600 p-2 rounded-lg h-20 w-20 rounded-full items-center justify-center shadow-lg shadow-green-900 `}
                        >
                            <Text style={tw`text-white text-4xl`}>+</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
            <Footer nav={navigation} />
        </>
    );
};

export default HomeScreen;
