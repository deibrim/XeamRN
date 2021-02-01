import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../constants/Colors";
const ReplyStoryInput = ({ setShowReplyInput, setIsPause }) => {
  const [message, setMessage] = useState("");
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardShowing(true);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardShowing(false);
      setIsPause(false);
      setShowReplyInput(false);
    });
  }, [keyboardShowing]);
  const onSendPress = () => {};
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
    position: "absolute",
    bottom: "40%",
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
