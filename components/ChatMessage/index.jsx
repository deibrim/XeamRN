import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import firebase from "../../firebase/firebase.utils";
import { useSelector } from "react-redux";
import moment from "moment";
import styles from "./styles";

const ChatMessage = (props) => {
  const { message } = props;
  const user = useSelector((state) => state.user.currentUser);
  useEffect(() => {
    updateRead();
  }, []);
  const isMyMessage = () => {
    return message.user.id === user.id;
  };
  const timeFromNow = (timestamp) => moment(timestamp).fromNow();
  const onReply = () => {};

  const updateRead = () => {
    // const ref = getMessagesRef();
    // props.messageRef;
    if (message.read !== undefined) {
      if (!message.read) {
        props
          .messageRef()
          .child(props.channelId)
          .child(message.key)
          .update({ read: true });
      }
    }
    // console.log("====================================");
    // console.log(props.messageRef().child(uid).update({read: true}));
    // console.log("====================================");
  };

  return (
    <>
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
        <View
          style={
            isMyMessage()
              ? { ...styles.buttonContainer, left: 30 }
              : { ...styles.buttonContainer }
          }
        >
          <TouchableOpacity
            onPress={() => {
              onReply();
            }}
          >
            <View style={styles.button}>
              <MaterialCommunityIcons
                name="reply-outline"
                size={18}
                color="white"
                style={isMyMessage() && { transform: [{ rotateY: "180deg" }] }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ChatMessage;
