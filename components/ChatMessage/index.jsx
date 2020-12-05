import React from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import moment from "moment";
import styles from "./styles";

const ChatMessage = (props) => {
  const { message } = props;
  const user = useSelector((state) => state.user.currentUser);

  const isMyMessage = () => {
    return message.user.id === user.id;
  };
  const timeFromNow = (timestamp) => moment(timestamp).fromNow();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.messageBox,
          {
            backgroundColor: isMyMessage() ? "#c5ddff" : "white",
            marginLeft: isMyMessage() ? 50 : 0,
            marginRight: isMyMessage() ? 0 : 50,
          },
        ]}
      >
        <Text style={styles.message}>{message.content}</Text>
        <Text style={styles.time}>{timeFromNow(message.timestamp)}</Text>
      </View>
    </View>
  );
};

export default ChatMessage;
