import { View, Text } from "react-native";
import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const userContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [userProfileURL, setUserProfileURL] = useState();
    const setCurrentUser = async (USER) => {
        try {
            await AsyncStorage.setItem("@userId", JSON.stringify(USER._id));
            console.log("USER\n", USER._id);
            setUser(USER);
        } catch (error) {
            console.log(error);
        }
    };
    const removeCurrentUser = async () => {
        await AsyncStorage.removeItem("@userId");
        console.log("removed");
    };
    return (
        <userContext.Provider
            value={{
                user,
                setUser,
                setCurrentUser,
                removeCurrentUser,
                userProfileURL,
                setUserProfileURL,
            }}
        >
            {children}
        </userContext.Provider>
    );
};

export default UserProvider;
