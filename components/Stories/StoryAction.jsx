import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const StoryAction = ({ type, text, onPress }) => {
  return (
    <View style={styles.storyActionWrapper}>
      <TouchableOpacity onPress={onPress} style={{ alignItems: "center" }}>
        <View style={styles.storyAction}>
          <Feather name="chevron-up" size={20} color="white" />
        </View>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  storyAction: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: "white",
    marginTop: 8,
    letterSpacing: 1,
  },
  storyActionWrapper: {
    position: "absolute",
    bottom: 25,
    width: "98%",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default StoryAction;
