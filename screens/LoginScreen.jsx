import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from "react-native";
import React, { useContext, useState } from "react";
import tw from "twrnc";
import Loading from "../components/Loading";
import UserInput from "../components/UserInput";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireAuth, fireDb } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { userContext } from "../context/UserProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
    const { setCurrentUser } = useContext(userContext);
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigation = useNavigation();
    const handleLogin = async () => {
        try {
            console.log("start");
            setLoading(true);
            if (email != "") {
                const userCred = await signInWithEmailAndPassword(
                    fireAuth,
                    email,
                    pass
                );
                if (userCred) {
                    console.log("userId\n", userCred?.user.uid);
                    const docSnap = await getDoc(
                        doc(fireDb, "users", userCred?.user.uid)
                    );
                    if (docSnap.exists()) {
                        setCurrentUser(docSnap.data());
                        console.log("DATA", docSnap.data());
                        setEmail("");
                        setPass("");
                        setError("");
                        navigation.navigate("Home");
                    }
                }
            }
        } catch (error) {
            setError(error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const handleSignup = () => {
        setEmail("");
        setPass("");
        setError("");
        navigation.navigate("Signup");
    };
    return (
        <>
            <View style={tw`flex-1 w-full bg-[#FDFEFE] `}>
                <SafeAreaView
                    style={tw`flex-1 items-center  w-full p-8 gap-4 mt-6`}
                >
                    {loading ? (
                        <Loading />
                    ) : (
                        <KeyboardAvoidingView
                            style={tw`flex-1 items-center  w-full p-8 gap-4 mt-6`}
                        >
                            <View
                                style={tw`h-[45%] w-full items-start justify-end`}
                            >
                                <Text style={tw`font-black text-4xl`}>
                                    Login
                                </Text>
                            </View>
                            <View
                                style={tw`flex-1 w-full gap-8 mt-4 items-center`}
                            >
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
                                    onPress={handleLogin}
                                    style={tw`bg-blue-600 px-3 py-2 w-full items-center rounded-lg shadow-xl shadow-blue-900`}
                                >
                                    <Text style={tw`text-white text-lg`}>
                                        Login
                                    </Text>
                                </TouchableOpacity>
                                <View style={tw`flex-row items-center`}>
                                    <Text>Don't have an account? </Text>
                                    <TouchableOpacity
                                        onPress={handleSignup}
                                        style={tw`px-3 py-2`}
                                    >
                                        <Text
                                            style={tw`text-blue-800 font-bold`}
                                        >
                                            signup
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    )}
                </SafeAreaView>
            </View>
        </>
    );
};

export default LoginScreen;
