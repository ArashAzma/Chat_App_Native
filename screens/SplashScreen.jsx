import { ActivityIndicator } from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { fireDb } from "../config/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { userContext } from "../context/UserProvider";
import Loading from "../components/Loading";

const SplashScreen = () => {
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(userContext);
    const navigation = useNavigation();

    useLayoutEffect(() => {
        checkUser();
    }, []);
    const checkUser = async () => {
        try {
            setLoading(true);
            const value = await AsyncStorage.getItem("@userId");
            if (value) {
                const uid = JSON.parse(value);
                const docSnap = await getDoc(doc(fireDb, "users", uid));
                if (docSnap.exists()) {
                    setUser(docSnap.data());
                    console.log("DATA", docSnap.data());
                    navigation.replace("Home");
                }
            } else {
                navigation.replace("Login");
            }
        } catch (error) {
            navigation.replace("Login");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return <>{loading && <Loading />}</>;
};

export default SplashScreen;
