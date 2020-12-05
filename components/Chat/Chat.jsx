import React from "react";
import moment from "moment";
import { StyleSheet, Text, Image, View } from "react-native";
const isOwnMessage = (message, user) => {
  return message.user.id === user.id
    ? styles.message__self
    : styles.message__other;
};

const timeFromNow = (timestamp) => moment(timestamp).fromNow();

const Chat = ({ message, user }) => {
  const { timestamp, content } = message;
  const { avatar, name } = message.user;
  return (
    <View
      style={
        message.user.id === user.id
          ? { ...styles.message_view, ...styles.message__self__view }
          : { ...styles.message_view, ...styles.message__other__view }
      }
    >
      <Image source={{ uri: `${avatar}` }} style={{ height: 50, width: 50 }} />
      <View
        style={
          message.user.id === user.id
            ? { ...styles.message__self }
            : { ...styles.message__other }
        }
      >
        <Text
          style={
            message.user.id === user.id
              ? { ...styles.sender__name }
              : { ...styles.other__sender__name }
          }
        >
          {message.user.id === user.id ? "You" : name}
        </Text>
        <Text
          style={
            message.user.id === user.id
              ? { ...styles.timestamp }
              : { ...styles.other__timestamp }
          }
        >
          {timeFromNow(timestamp)}
        </Text>
        <Text
          style={
            message.user.id === user.id
              ? { ...styles.message__content }
              : { ...styles.other__message__content }
          }
        >
          {content}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  message_view: {
    marginVertical: 30,
    position: "relative",
    width: "80%",
  },

  sender__name: {
    width: 85,
    textAlign: "right",
    marginRight: 10,
    fontSize: 13,
    fontWeight: "600",
    position: "absolute",
    top: -35,
    right: -60,
  },
  other__sender__name: {
    width: 85,
    marginRight: 10,
    fontSize: 13,
    fontWeight: "600",
    position: "absolute",
    top: -35,
    left: -50,
    textAlign: "left",
  },
  timestamp: {
    width: 85,
    fontSize: 10,
    fontWeight: "500",
    position: "absolute",
    top: -20,
    right: -82,
  },
  other__timestamp: {
    width: 85,
    fontSize: 10,
    fontWeight: "500",
    position: "absolute",
    textAlign: "left",
    top: -20,
    left: -50,
  },
  message__content: {
    minHeight: 50,
    paddingRight: 10,
    marginRight: 5,
    borderRightWidth: 2,
    borderRightColor: "gray",
    fontWeight: "bold",
  },
  message__other__view: {
    flexDirection: "row",
  },
  message__self__view: {
    flexDirection: "row-reverse",
    marginLeft: "auto",
  },
  other__message__content: {
    minHeight: 50,
    paddingLeft: 10,
    marginLeft: 5,
    borderLeftWidth: 2,
    borderLeftColor: "gray",
    fontWeight: "bold",
  },
});
export default Chat;
