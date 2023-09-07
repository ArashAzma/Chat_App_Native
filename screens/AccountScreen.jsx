import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
    RefreshControl,
} from "react-native";
import React, {
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { userContext } from "../context/UserProvider";
import { Feather, FontAwesome } from "@expo/vector-icons";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Footer from "../components/footer";

const AccountScreen = ({ navigation }) => {
    const route = useRoute();
    const { user, setUser, removeCurrentUser } = useContext(userContext);
    const { accountUser } = route?.params;
    const [change, setChange] = useState("");
    const [itsUsersAcc, setItsUsersAcc] = useState(false);
    const [error, setError] = useState("");
    const [chatRooms, setChatRooms] = useState(true);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const inputRef = useRef();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        console.log(itsUsersAcc);
        getData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);
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
    const getData = () => {
        setItsUsersAcc(accountUser._id == user._id);
        let unsubscribe;
        try {
            console.log("TRY");
            const chatQuery = query(
                collection(fireDb, "Chats"),
                where(
                    "user._id",
                    "==",
                    itsUsersAcc ? user._id : accountUser._id
                ),
                orderBy("_id", "desc")
            );
            unsubscribe = onSnapshot(chatQuery, (queryShot) => {
                const rooms = queryShot.docs.map((doc) => doc.data());
                setChatRooms(rooms);
            });
        } catch (error) {
            console.log(error);
        }
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    };

    useLayoutEffect(() => {
        console.log(user?.name);
        console.log(accountUser?.name);
        setItsUsersAcc(accountUser?._id == user?._id);
        const cleanup = getData();
        return () => {
            cleanup();
        };
    }, [itsUsersAcc, loading]);

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
                            onPress={() => navigation.goBack()}
                            style={tw`absolute top-8 left-8`}
                        >
                            <FontAwesome
                                name='arrow-left'
                                size={24}
                                color='black'
                            />
                        </TouchableOpacity>
                        {itsUsersAcc && (
                            <TouchableOpacity
                                style={tw`bg-red-600 absolute right-5 top-6 w-15 h-10 items-center justify-center rounded-lg bg-opacity-95`}
                                onPress={handleLogout}
                            >
                                <Text style={tw`text-white`}>Logout</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableWithoutFeedback
                            onPress={handleImageEdit}
                            disabled={!itsUsersAcc}
                        >
                            <View>
                                <Image
                                    source={
                                        (
                                            itsUsersAcc
                                                ? user?.photoURL.length > 0
                                                : accountUser?.photoURL.length >
                                                  0
                                        )
                                            ? {
                                                  uri: itsUsersAcc
                                                      ? user.photoURL
                                                      : accountUser.photoURL,
                                              }
                                            : require("../assets/icon.png")
                                    }
                                    style={tw`rounded-full h-[40] w-[40]  `}
                                    resizeMode='contain'
                                />
                                {itsUsersAcc && (
                                    <Feather
                                        name='edit'
                                        size={28}
                                        color='blue'
                                        style={tw`absolute bottom-1 -right-2`}
                                    />
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={tw`w-full items-center justify-center`}>
                            <Text
                                style={tw`text-3xl font-semibold my-8 `}
                                numberOfLines={1}
                            >
                                {itsUsersAcc ? user.name : accountUser.name}
                                <TouchableOpacity
                                    style={tw`absolute -right-3 `}
                                    onPress={handleNameEdit}
                                    disabled={!itsUsersAcc}
                                >
                                    {itsUsersAcc && (
                                        <Feather
                                            name='edit'
                                            size={18}
                                            color='blue'
                                        />
                                    )}
                                </TouchableOpacity>
                            </Text>
                        </View>
                        {itsUsersAcc && (
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
                        )}
                        <View style={tw`flex-1 w-full`}>
                            <Text style={tw`text-xl px-6 font-semibold`}>
                                {`${itsUsersAcc ? "Your" : accountUser.name}`}{" "}
                                chat rooms :
                            </Text>
                            <ScrollView
                                contentContainerStyle={tw`p-4`}
                                showsVerticalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }
                            >
                                {chatRooms && chatRooms.length > 0 ? (
                                    <>
                                        {chatRooms.map((room) => (
                                            <ChatRoomCard
                                                room={room}
                                                key={room._id}
                                                itsUsersAcc={itsUsersAcc}
                                                setLoading={setLoading}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <View
                                        style={tw`flex-row items-center w-full items-center  p-22`}
                                    >
                                        <Text style={tw`text-xl w-[75%]`}>
                                            {`${
                                                itsUsersAcc
                                                    ? "You "
                                                    : accountUser.name
                                            }`}
                                            currently don't have any chat rooms
                                        </Text>
                                        {itsUsersAcc && (
                                            <View style={tw`w-[25%]`}>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        navigation.navigate(
                                                            "ChatCreation"
                                                        )
                                                    }
                                                    style={tw`bg-green-600 p-2 rounded-lg h-20 w-20 rounded-full items-center justify-center shadow-lg shadow-green-900 `}
                                                >
                                                    <Text
                                                        style={tw`text-white text-4xl`}
                                                    >
                                                        +
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    </SafeAreaView>
                </View>
            )}
            <Footer nav={navigation} />
        </>
    );
};

export default AccountScreen;
