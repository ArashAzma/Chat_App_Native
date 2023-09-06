import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import tw from "twrnc";
const Loading = () => {
    return (
        <View style={tw`flex-1 z-15 items-center justify-center bg-[#FDFEFE]`}>
            <ActivityIndicator size={42} />
        </View>
    );
};

export default Loading;
