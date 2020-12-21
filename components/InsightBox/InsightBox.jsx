import React from "react";
import { Dimensions, Text, View } from "react-native";
const InsightBox = ({ icon, title, value, width }) => {
  return (
    <View
      style={{
        width,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        minHeight: 150,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 4,
      }}
    >
      {icon && icon}
      <Text
        style={{
          textAlign: "center",
          marginTop: 5,
          fontSize: 16,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginTop: 10,
          fontSize: 16,
        }}
      >
        {value}
      </Text>
    </View>
  );
};

export default InsightBox;
