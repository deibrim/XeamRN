import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

const ColorPicker = ({ colors, onPress, color }) => {
  return (
    <ScrollView horizontal>
      {colors.map((item, index) => (
        <TouchableOpacity onPress={() => onPress(item)}>
          <View
            style={{
              height: 30,
              width: 30,
              margin: 3,
              borderRadius: 15,
              backgroundColor: item,
              borderWidth: 2,
              borderColor: color === item ? "#ffffff" : "transparent",
            }}
          ></View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default ColorPicker;
