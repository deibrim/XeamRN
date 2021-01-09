import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, TextInput } from "react-native";
import { styles } from "./styles";

const CustomInput = ({
  icon,
  cStyle,
  iStyle,
  placeholder,
  value,
  onChange,
  otherIcon,
}) => {
  return (
    <View style={{ ...styles.inputGroup, ...cStyle }}>
      {icon}

      <TextInput
        style={{ ...styles.input, ...iStyle }}
        underlineColorAndroid="transparent"
        placeholder={placeholder}
        placeholderTextColor="#000000"
        autoCapitalize="none"
        onChangeText={onChange}
        value={value}
      />
      {otherIcon}
    </View>
  );
};

export default CustomInput;
