import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const PanelLinkItem = ({ onPress, title, icon, noBorder }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        {icon}
        <View
          style={{
            width: "100%",
            paddingBottom: 15,
            borderBottomWidth: noBorder ? 0 : 1,
            borderBottomColor: "#77777777",
            marginLeft: 15,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              letterSpacing: 1,
            }}
          >
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PanelLinkItem;
