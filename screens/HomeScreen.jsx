import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import tw from "twrnc";
import { userContext } from "../context/UserProvider";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
} from "firebase/firestore";
import { fireDb } from "../config/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatRoomCard from "../components/ChatRoomCard";
import { Ionicons } from "@expo/vector-icons";
import InputText from "../components/InputText";
const HomeScreen = () => {
    const navigation = useNavigation();
    const [addChatName, setAddChatName] = useState("");
    const { user } = useContext(userContext);
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

    const handleAddChatPress = async () => {
        try {
            if (addChatName.length > 2) {
                console.log("START");
                const id = Date.now().toString();
                const data = {
                    _id: id,
                    user: user,
                    ChatName: addChatName,
                };
                await setDoc(doc(fireDb, "Chats", id), data);
                console.log("Created");
            } else {
                throw new error("Needs a longer name!");
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <View style={tw`flex-1 items-center bg-[#FDFEFE] p-3`}>
            <SafeAreaView style={tw`h-full w-full items-center `}>
                <View
                    style={tw`w-full flex-0.12 flex-row justify-between p-6 items-center`}
                >
                    <View>
                        <Text style={tw`font-bold text-4xl`}>Chat Rooms</Text>
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
                                    <ChatRoomCard room={room} key={room._id} />
                                ))}
                            </>
                        ) : (
                            <>
                                <Text>Empty</Text>
                            </>
                        )}
                    </ScrollView>
                </View>
                <View
                    style={tw`flex-row mt-4 gap-2 justify-end w-full px-6 items-center absolute bottom-0`}
                >
                    {/* <InputText
                        addStyle='absolute z-5 w-75'
                        value={addChatName}
                        useState={(text) => setAddChatName(text)}
                        placeholder='chat name'
                    /> */}

                    <TouchableOpacity
                        onPress={handleAddChatPress}
                        style={tw`bg-green-600 p-2 rounded-lg h-20 w-20 rounded-full items-center justify-center shadow-lg shadow-green-900 `}
                    >
                        <Text style={tw`text-white text-4xl`}>+</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default HomeScreen;