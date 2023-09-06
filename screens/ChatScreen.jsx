import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
} from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

import MessageCard from "../components/MessageCard";
import { userContext } from "../context/UserProvider";
import { FontAwesome } from "@expo/vector-icons";
import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import { fireDb } from "../config/firebase.config";
import tw from "twrnc";

const ChatScreen = () => {
    const route = useRoute();
    const { room } = route.params;
    const { user } = useContext(userContext);
    const { width } = Dimensions.get("window");
    const navigation = useNavigation();
    const [messages, setMessages] = useState();
    const [msg, setMsg] = useState("");
    c;

    const sendMessage = async () => {
        const timeStamp = serverTimestamp();
        const id = `${Date.now()}`;
        const data = {
            _id: id,
            timeStamp: timeStamp,
            message: msg,
            user: user,
        };
        try {
            await addDoc(
                collection(doc(fireDb, "Chats", room._id), "messages"),
                data
            );
            console.log("ADDED");
            setMsg("");
        } catch (error) {
            console.log(error);
        }
    };
    useLayoutEffect(() => {
        const msgQuery = query(
            collection(fireDb, "Chats", room?._id, "messages"),
            orderBy("timeStamp", "asc")
        );
        const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
            const upMsg = querySnap.docs.map((doc) => doc.data());
            // console.log("upMsg");
            // console.log(upMsg);
            setMessages(upMsg);
        });
        return unsubscribe;
    }, []);
    return (
        <View
            style={{
                ...tw`h-full items-center `,
                width: width,
            }}
        >
            <SafeAreaView
                style={tw` w-full bg-[#DDE6ED] items-center bg-opacity-25`}
            >
                <KeyboardAvoidingView style={tw` w-full  items-center`}>
                    <View
                        style={tw`h-[15%] items-center justify-center w-full`}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={tw`absolute top-12 left-10`}
                        >
                            <FontAwesome
                                name='arrow-left'
                                size={24}
                                color='black'
                            />
                        </TouchableOpacity>
                        <Text style={tw` text-4xl`}>{room?.ChatName}</Text>
                    </View>
                    <View
                        style={tw`w-full h-[77%] py-12 bg-[#FDFEFE] px-3 rounded-t-15 justify-between`}
                    >
                        <FlatList
                            data={messages}
                            showsVerticalScrollIndicator={false}
                            ref={(ref) => (this.flatList = ref)}
                            onContentSizeChange={() =>
                                this.flatList.scrollToEnd({ animated: true })
                            }
                            onLayout={() =>
                                this.flatList.scrollToEnd({ animated: true })
                            }
                            renderItem={(item) => {
                                const msg = item.item;
                                return (
                                    <MessageCard
                                        message={msg}
                                        key={msg._id}
                                        isUser={msg.user.email == user.email}
                                    />
                                );
                            }}
                        />
                    </View>
                    <View
                        style={tw`flex-row w-full h-[8%] bg-[#FDFEFE] gap-x-4 px-3 items-center justify-center`}
                    >
                        <View
                            style={tw`flex-row justify-between bg-[#DDE6ED] rounded-full`}
                        >
                            <TextInput
                                style={tw`h-11 w-[85%] bg-[#DDE6ED] p-2 px-5  rounded-lg text-lg`}
                                value={msg}
                                onChangeText={(text) => setMsg(text)}
                                placeholder='say somthing...'
                                onSubmitEditing={() => {
                                    msg.length > 0 && sendMessage();
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    msg.length > 0 && sendMessage();
                                }}
                                style={tw`w-11 h-11 bg-green-600 rounded-lg items-center justify-center rounded-full `}
                            >
                                <FontAwesome
                                    name='send'
                                    size={14}
                                    color='white'
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

export default ChatScreen;
