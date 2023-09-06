import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    FlatList,
    ScrollView,
    TouchableWithoutFeedback,
} from "react-native";
import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { userContext } from "../context/UserProvider";
import { Feather } from "@expo/vector-icons";
import tw from "twrnc";
import InputText from "../components/InputText";
import { fireAuth, fireDb } from "../config/firebase.config";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import Loading from "./../components/Loading";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatRoomCard from "../components/ChatRoomCard";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const AccountScreen = () => {
    const { user, setUser, removeCurrentUser } = useContext(userContext);
    const [change, setChange] = useState("");
    const [error, setError] = useState("");
    const [chatRooms, setChatRooms] = useState();
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();
    const navigation = useNavigation();
    const handleImageEdit = async () => {
        try {
            setLoading(true);
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.jpeg,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.25,
            });

            console.log(result);

            if (!result.canceled) {
                const image = result.assets[0].uri;
                const imageURL = await uploadImageToDB(image);
                console.log(imageURL);
                console.log("IMAGE uploaded");

                const userId = user?._id;
                const userRef = doc(fireDb, "users", userId);

                await updateDoc(userRef, {
                    photoURL: imageURL,
                });
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data();
                setUser(userData);
                console.log("Updated user data:", userData);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNameEdit = () => {
        inputRef.current.focus();
    };
    const handleSubmit = async () => {
        try {
            if (change.length < 3) {
                throw new Error("too short");
            } else if (change.length > 12) {
                throw new Error("too long");
            }
            setLoading(true);
            const userId = user?._id;
            const userRef = doc(fireDb, "users", userId);

            await updateDoc(userRef, {
                name: change,
            });
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();
            setUser(userData);
            setChange("");
            setError("");
            console.log("Updated user data:", userData);
        } catch (error) {
            setError(error.toString());
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useLayoutEffect(() => {
        try {
            console.log(user?._id);
            const chatQuery = query(
                collection(fireDb, "Chats"),
                where("user._id", "==", user._id),
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
    const handleLogout = async () => {
        try {
            await fireAuth.signOut();
            removeCurrentUser();
            navigation.navigate("Login");
            console.log("User signed out successfully!");
        } catch (error) {
            console.error("Error signing out user:", error);
        }
    };
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <View style={tw`flex-1 items-center bg-[#FDFEFE]`}>
                    <SafeAreaView
                        style={tw`flex-1 w-full mt-6 items-center bg-[#FDFEFE]`}
                    >
                        <TouchableOpacity
                            style={tw`bg-red-600 absolute right-5 top-6 w-15 h-10 items-center justify-center rounded-lg bg-opacity-95`}
                            onPress={handleLogout}
                        >
                            <Text style={tw`text-white`}>Logout</Text>
                        </TouchableOpacity>
                        <TouchableWithoutFeedback onPress={handleImageEdit}>
                            <View>
                                <Image
                                    source={
                                        user.photoURL
                                            ? { uri: user.photoURL }
                                            : require("../assets/icon.png")
                                    }
                                    style={tw`rounded-full h-[40] w-[40] mr-4 `}
                                    resizeMode='contain'
                                />
                                <Feather
                                    name='edit'
                                    size={28}
                                    color='blue'
                                    style={tw`absolute bottom-1 right-3`}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={tw`w-full items-center justify-center`}>
                            <Text style={tw`text-3xl font-semibold my-8`}>
                                {user.name}
                                <TouchableOpacity
                                    style={tw`absolute -right-3 `}
                                    onPress={handleNameEdit}
                                >
                                    <Feather
                                        name='edit'
                                        size={18}
                                        color='blue'
                                    />
                                </TouchableOpacity>
                            </Text>
                        </View>
                        <View style={tw`w-full`}>
                            <Text style={tw`text-xl px-6 font-semibold`}>
                                Enter your new Name :
                            </Text>
                            <InputText
                                refrence={inputRef}
                                value={change}
                                useState={setChange}
                                placeholder='Enter your new name'
                                handleSubmit={handleSubmit}
                            />
                            {error && (
                                <Text
                                    style={tw`text-red-700 font-semibold w-full px-6 text-4`}
                                    numberOfLines={2}
                                >
                                    {error}
                                </Text>
                            )}
                        </View>
                        <View style={tw`flex-1 w-full`}>
                            <Text style={tw`text-xl px-6 font-semibold`}>
                                Your chat rooms :
                            </Text>
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
                                        style={tw` w-full items-center justify-center `}
                                    >
                                        <Text style={tw`p-22 text-xl`}>
                                            You Currntly Don't have any chat
                                            rooms
                                        </Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    </SafeAreaView>
                </View>
            )}
        </>
    );
};

export default AccountScreen;
