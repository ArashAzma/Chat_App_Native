import { View, Text, TextInput } from "react-native";
import React from "react";
import tw from "twrnc";
const UserInput = ({ value, setState, placeholder, isPass }) => {
    return (
        <TextInput
            style={tw` border-b-2 border-gray-300 w-full p-2 text-lg`}
            value={value}
            onChangeText={(text) => setState(text)}
            secureTextEntry={isPass}
            placeholder={placeholder}
        />
    );
};

export default UserInput;
