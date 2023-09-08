import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import Loading from "../components/Loading";
import * as ImagePicker from "expo-image-picker";
import UserInput from "../components/UserInput";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { fireAuth, fireDb, fireStorage } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteObject, ref } from "firebase/storage";
import uploadImageToDB from "./../utils/UploadFile";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";

const SignupScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [image, setImage] = useState(null);
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
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    const handleLogin = () => {
        navigation.navigate("Login");
    };
    const handleSignup = async () => {
        if (name.length < 3) {
            setError("Name is too short");
        } else if (name.length > 12) {
            setError("Name is too long");
        } else {
            if (email != "") {
                if (!validateEmail(email)) {
                    setError("Please provide a correct email");
                    return;
                }
                setLoading(true);
                try {
                    console.log("TRY");
                    const userCred = await createUserWithEmailAndPassword(
                        fireAuth,
                        email,
                        pass
                    );
                    let imageURL = "";
                    if (image && image?.length > 0) {
                        imageURL = await uploadImageToDB(image);
                        console.log(imageURL);
                        console.log("IMAGE uploaded");
                    }
                    const data = {
                        _id: userCred?.user.uid,
                        name: name,
                        email: email,
                        photoURL: imageURL,
                        providerData: userCred?.user.providerData[0],
                    };
                    setDoc(doc(fireDb, "users", userCred?.user.uid), data).then(
                        () => {
                            navigation.navigate("Login");
                        }
                    );
                } catch (error) {
                    const user = fireAuth.currentUser;
                    if (user) {
                        await deleteUser(user);
                        if (image && image.length > 0) {
                            const desertRef = ref(
                                fireStorage,
                                "images/" + image
                            );
                            // Delete the file
                            await deleteObject(desertRef);
                        }
                        console.log("DELETED");
                    }
                    setError(error.message);
                    console.log("ERROR", error);
                } finally {
                    setLoading(false);
                }
            }
        }
    };
    return (
        <View style={tw`flex-1 w-full bg-[#FDFEFE]`}>
            <SafeAreaView
                style={tw`flex-1 items-center w-full p-8 gap-4 mt-6 justify-center`}
            >
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <View
                            style={tw`flex-row w-full justify-evenly items-center `}
                        >
                            <Text style={tw`font-black text-4xl`}>Sign up</Text>

                            {image ? (
                                <TouchableWithoutFeedback onPress={pickImage}>
                                    <View>
                                        <Image
                                            source={{ uri: image }}
                                            style={tw`rounded-full h-[30] w-[30]`}
                                            resizeMode='contain'
                                        />
                                        <Feather
                                            name='edit'
                                            size={22}
                                            color='blue'
                                            style={tw`absolute bottom-2 -right-2`}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            ) : (
                                <TouchableWithoutFeedback onPress={pickImage}>
                                    <View>
                                        <Image
                                            source={require("../assets/icon.png")}
                                            style={tw`rounded-full h-[30] w-[30]`}
                                            resizeMode='contain'
                                        />
                                        <Feather
                                            name='edit'
                                            size={22}
                                            color='blue'
                                            style={tw`absolute bottom-2 -right-2`}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            )}
                        </View>
                        <KeyboardAvoidingView
                            style={tw` items-center w-full px-8 gap-2`}
                        >
                            <View style={tw` w-full gap-8 mt-4 items-center`}>
                                <UserInput
                                    value={name}
                                    setState={setName}
                                    placeholder='name'
                                />
                                <UserInput
                                    value={email}
                                    setState={setEmail}
                                    placeholder='email'
                                />
                                <View style={tw`w-full`}>
                                    <UserInput
                                        value={pass}
                                        setState={setPass}
                                        placeholder='password'
                                        isPass={!showPass}
                                    />
                                    {showPass ? (
                                        <TouchableWithoutFeedback
                                            onPress={() => setShowPass(false)}
                                        >
                                            <Ionicons
                                                name='ios-eye-outline'
                                                size={24}
                                                color='black'
                                                style={tw`absolute top-4 right-0`}
                                            />
                                        </TouchableWithoutFeedback>
                                    ) : (
                                        <TouchableWithoutFeedback
                                            onPress={() => setShowPass(true)}
                                        >
                                            <Ionicons
                                                name='ios-eye-off-outline'
                                                size={24}
                                                color='black'
                                                style={tw`absolute top-4 right-0`}
                                            />
                                        </TouchableWithoutFeedback>
                                    )}
                                </View>
                                {error && (
                                    <Text
                                        style={tw`text-red-700 font-semibold w-full`}
                                        numberOfLines={2}
                                    >
                                        {error}
                                    </Text>
                                )}
                                <TouchableOpacity
                                    onPress={handleSignup}
                                    style={tw`bg-blue-600 px-3 py-2 w-full items-center rounded-lg shadow-xl shadow-blue-900`}
                                >
                                    <Text style={tw`text-white text-lg`}>
                                        Signup
                                    </Text>
                                </TouchableOpacity>
                                <View style={tw`flex-row items-center`}>
                                    <Text>Already have an account? </Text>
                                    <TouchableOpacity
                                        onPress={handleLogin}
                                        style={tw`px-3 py-2`}
                                    >
                                        <Text
                                            style={tw`text-blue-800 font-bold`}
                                        >
                                            login
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </>
                )}
            </SafeAreaView>
        </View>
    );
};

export default SignupScreen;
