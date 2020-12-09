import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";

const CustomPopUp = ({
  message,
  onPresss,
  type,
  customStyles,
  customTextStyles,
}) => {
  return (
    <View
      style={
        type === "error"
          ? { ...styles.container, ...styles.containerErr, ...customStyles }
          : { ...styles.container, ...customStyles }
      }
    >
      <Text style={{ ...styles.text, ...customTextStyles }}>{message}</Text>
      {onPresss && (
        <TouchableOpacity onPress={onPresss}>
          <AntDesign name="close" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomPopUp;
