import {
    View,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    Image,
    TouchableOpacity,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import InputText from "../components/InputText";
import Loading from "../components/Loading";
import { userContext } from "../context/UserProvider";
import { deleteObject, ref } from "firebase/storage";
import uploadImageToDB from "./../utils/UploadFile";
import { doc, setDoc } from "firebase/firestore";
import { fireDb, fireStorage } from "../config/firebase.config";
import { FontAwesome } from "@expo/vector-icons";

const ChatRoomCreation = () => {
    const [image, setImage] = useState(null);
    const { user } = useContext(userContext);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const inputRef = useRef();
    const navigation = useNavigation();
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.jpeg,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.25,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    const handleAddChatPress = async () => {
        if (name.length < 3) {
            setError("Name is too short");
        } else {
            setLoading(true);
            try {
                console.log("TRY");
                let imageURL = "";
                console.log("image");
                console.log(image);
                if (image && image.length > 0) {
                    imageURL = await uploadImageToDB(image);
                    console.log(imageURL);
                }
                console.log("IMAGE uploaded");
                const id = Date.now().toString();
                const data = {
                    _id: id,
                    user: user,
                    ChatName: name,
                    photoURL: imageURL,
                };
                await setDoc(doc(fireDb, "Chats", id), data);
                console.log("Created");
                navigation.replace("Home");
            } catch (error) {
                if (image && image?.length > 0) {
                    const desertRef = ref(fireStorage, "images/" + image);
                    // Delete the file
                    await deleteObject(desertRef);
                    console.log("DELETED");
                }
                setError(error.message);
                console.log("ERROR", error);
            } finally {
                setLoading(false);
            }
        }
    };
    return (
        <View style={tw`flex-1 items-center bg-[#FDFEFE] p-3`}>
            <SafeAreaView style={tw`h-full w-full items-center justify-center`}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={tw`absolute top-12 left-5`}
                >
                    <FontAwesome name='arrow-left' size={24} color='black' />
                </TouchableOpacity>
                {loading ? (
                    <Loading />
                ) : (
                    <View
                        style={tw`bg-[#FDFEFE] shadow-lg w-full items-center justify-center h-[50%] gap-y-8`}
                    >
                        <View style={tw`flex-row items-center justify-center `}>
                            <Text style={tw`w-35 text-xl font-semibold`}>
                                Please select an image for the Room
                            </Text>
                            {image ? (
                                <TouchableWithoutFeedback onPress={pickImage}>
                                    <Image
                                        source={{ uri: image }}
                                        style={tw`rounded-full h-[45] w-[45] mr-4`}
                                        resizeMode='contain'
                                    />
                                </TouchableWithoutFeedback>
                            ) : (
                                <TouchableWithoutFeedback onPress={pickImage}>
                                    <Image
                                        source={require("../assets/icon.png")}
                                        style={tw`rounded-full h-[45] w-[45] mr-4`}
                                        resizeMode='contain'
                                    />
                                </TouchableWithoutFeedback>
                            )}
                        </View>
                        <View
                            style={tw`flex-row items-center justify-center w-80 `}
                        >
                            <Text style={tw`w-25 text-xl font-semibold`}>
                                Choose a name
                            </Text>
                            <InputText
                                value={name}
                                useState={setName}
                                placeholder='room name ...'
                                addStyle='w-60 m-0 '
                                refrence={inputRef}
                            />
                        </View>
                        <View
                            style={tw`flex-row w-full justify-between items-center px-12`}
                        >
                            <Text style={tw`w-38 text-lg text-red-600`}>
                                {error}
                            </Text>
                            <View style={tw`shadow-2xl rounded-lg`}>
                                <TouchableWithoutFeedback
                                    onPress={handleAddChatPress}
                                >
                                    <Text
                                        style={tw`font-semibold text-white text-2xl px-8 py-2 bg-green-500 rounded-xl`}
                                    >
                                        Submit
                                    </Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
};

export default ChatRoomCreation;
