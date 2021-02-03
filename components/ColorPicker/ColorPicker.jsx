import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

const ColorPicker = ({ colors, onPress, color, column }) => {
  return (
    <ScrollView
      keyboardShouldPersistTaps={"handled"}
      horizontal={column ? false : true}
      contentContainerStyle={
        column
          ? { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }
          : {}
      }
    >
      {colors.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => onPress(item)}>
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
