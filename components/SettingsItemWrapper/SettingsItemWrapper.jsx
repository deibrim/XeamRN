import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
const SettingsItemWrapper = ({
  title,
  description,
  onPress,
  icon,
  backgroundColor,
}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onPress();
      }}
    >
      <View style={{ ...styles.wrapper }}>
        <View
          style={[
            {
              width: 40,
              height: 40,
              borderRadius: 5,
              backgroundColor: backgroundColor || "#006eff",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            },
          ]}
        >
          {icon}
        </View>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "gray" }}>
            {title}
          </Text>
          <Text style={{ fontSize: 13, fontWeight: "500", color: "#b3b4b6" }}>
            {description}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    marginVertical: 10,
  },
});
export default SettingsItemWrapper;
