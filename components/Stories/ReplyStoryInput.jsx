import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";
const ReplyStoryInput = () => {
  const onSendPress = () => {};
  const [message, setMessage] = useState("");
  return (
    <View style={styles.container}>
      <View
        style={
          !message
            ? styles.mainContainer
            : { ...styles.mainContainer, alignItems: "flex-end" }
        }
      >
        <TextInput
          placeholder={"Type a message"}
          style={styles.textInput}
          multiline
          autoFocus={true}
          onBlur={() => {}}
          onFocus={() => {}}
          value={message}
          onChangeText={setMessage}
        />
      </View>
      <TouchableOpacity onPress={onSendPress}>
        <View style={styles.buttonContainer}>
          <Ionicons name="ios-send" size={24} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    alignItems: "flex-end",
  },
  mainContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
    marginRight: 10,
    flex: 1,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    backgroundColor: Colors.light.tint,
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ReplyStoryInput;
