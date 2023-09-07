import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Modal from "react-native-modal";
import tw from "twrnc";
import { doc, deleteDoc } from "firebase/firestore";
import { fireDb } from "../config/firebase.config";

const ChatRoomCard = ({ room, itsUsersAcc, setLoading }) => {
    const navigation = useNavigation();
    const { width } = Dimensions.get("window");
    const [isVisible, setIsVisible] = useState(false);
    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteDoc(doc(fireDb, "Chats", room._id));
            console.log("deleted");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <View>
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
                    <Text style={tw`text-4 text-xl w-50`} numberOfLines={1}>
                        {room.ChatName}
                    </Text>
                </View>
            </TouchableOpacity>
            {itsUsersAcc ? (
                <TouchableOpacity
                    style={tw`absolute right-6 top-12`}
                    onPress={() => setIsVisible(true)}
                >
                    <Feather name='x' size={28} color='red' />
                </TouchableOpacity>
            ) : null}
            <Modal
                isVisible={isVisible}
                style={tw`p-4 bg-white shadow-xl`}
                coverScreen={false}
                hasBackdrop={false}
                onBackdropPress={() => setIsVisible(false)}
            >
                <View style={tw``}>
                    <Text style={tw`text-xl`}>Are you sure ?</Text>
                    <View style={tw`flex-row justify-between mt-2`}>
                        <TouchableWithoutFeedback
                            onPress={() => setIsVisible(false)}
                        >
                            <Text style={tw`text-lg px-2 py-1 text-green-600 `}>
                                cancel
                            </Text>
                        </TouchableWithoutFeedback>
                        <TouchableOpacity onPress={handleDelete}>
                            <Text
                                style={tw`text-lg bg-red-600 px-2 py-1 text-white rounded-lg `}
                            >
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ChatRoomCard;
