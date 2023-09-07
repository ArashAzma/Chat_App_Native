import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
const UserInput = ({ value, setState, placeholder, isPass }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <TextInput
            style={tw` border-b-2 w-full p-2 text-lg ${
                isFocused ? "border-blue-800" : "border-gray-300"
            }`}
            value={value}
            onChangeText={(text) => setState(text)}
            secureTextEntry={isPass}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        />
    );
};

export default UserInput;
