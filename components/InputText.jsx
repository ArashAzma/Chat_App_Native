import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
const InputText = ({
    value,
    useState: useChange,
    placeholder,
    handleSubmit,
    refrence,
    addStyle,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };
    return (
        <View style={tw` w-full px-6 py-3 mt-4 ${addStyle}`}>
            <TextInput
                ref={refrence}
                value={value}
                onChangeText={(text) => useChange(text)}
                placeholder={placeholder}
                style={tw`bg-[#D7DDDE] w-full px-4 py-2 rounded-xl text-lg  bg-opacity-35${
                    isFocused ? "border-2 border-green-600" : ""
                }`}
                onSubmitEditing={handleSubmit}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </View>
    );
};

export default InputText;
