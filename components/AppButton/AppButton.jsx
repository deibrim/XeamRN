import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "./styles";
const AppButton = ({
  onPress,
  title,
  customStyle,
  icon,
  iconColor,
  textStyle,
  disabled,
  loading,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...styles.appButtonContainer, ...customStyle }}
    >
      {icon && (
        <MaterialIcons
          name={icon}
          size={24}
          color={iconColor}
          style={{ ...styles.appButtonIcon }}
        />
      )}
      <Text style={{ ...styles.appButtonText, ...textStyle }}>{title}</Text>
      {loading && (
        <Image
          style={{ marginTop: 2, marginLeft: 5, width: 18, height: 18 }}
          source={require("../../assets/loader.gif")}
        />
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
