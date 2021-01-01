import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../redux/chat/actions";
import firebase from "../../firebase/firebase.utils";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

const ChatListItem = (props) => {
  const { user } = props;
  const [lastMessage, setLastMessage] = useState({});
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    getLastMessage();
    getUserPresence();
  }, []);

  async function getLastMessage() {
    const channelId = getChannelId(user.id);
    firebase
      .database()
      .ref(`/privateMessages/${channelId}`)
      .limitToLast(1)
      .on("child_added", (snapshot) => {
        const { id, content, read, timestamp, user } = snapshot.val();
        setLastMessage(snapshot.val());
      });
  }
  function getUserPresence() {
    firebase
      .database()
      .ref(`/presence/${user.id}`)
      .on("child_added", (snapshot) => {
        setIsOnline(snapshot.val());
      });
    setLoading(false);
  }
  const isMyMessage = () => {
    return lastMessage.user.id === currentUser.id;
  };

  function getChannelId(userId) {
    const currentUserId = currentUser.id;

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  }
  const changeChannel = () => {
    const channelId = getChannelId(user.id);
    const channelData = {
      id: channelId,
      name: user.name,
      username: user.username,
    };
    dispatch(setCurrentChannel(channelData));
    dispatch(setPrivateChannel(true));
    navigation.navigate("ChatRoom", user);
  };
  // const { content, timestamp } = lastMessage;
  const notRead = (
    <Text
      numberOfLines={1}
      ellipsizeMode={"tail"}
      style={{
        ...styles.lastMessage,
        fontWeight: "bold",
        color: "black",
      }}
    >
      {!loading && lastMessage.content}
    </Text>
  );
  const onRead = (
    <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.lastMessage}>
      {!loading && lastMessage.content}
    </Text>
  );
  const lastMessageComp = () => {
    if (!loading) {
      if (lastMessage.read === undefined) {
        return onRead;
      }
      // if (lastMessage.user.id === currentUser.id && !lastMessage.read) {
      //   return onRead;
      // }
      if (lastMessage.read) {
        return onRead;
      } else {
        return notRead;
      }
    }
  };
  return (
    !loading && (
      <>
        <TouchableWithoutFeedback
          style={{ position: "relative" }}
          onPress={changeChannel}
        >
          <View style={styles.container}>
            <View style={styles.lefContainer}>
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: user.profile_pic }}
                  style={styles.avatar}
                />
                <View style={isOnline ? { ...styles.isOnline } : null}></View>
              </View>

              <View style={styles.midContainer}>
                <Text style={styles.username}>{user.name}</Text>
                {lastMessageComp()}
                <Text
                  style={
                    // lastMessage.user.id === currentUser.id && !lastMessage.read
                    //   ? { ...styles.time }
                    //   :
                    lastMessage.read === undefined
                      ? { ...styles.time }
                      : lastMessage.read
                      ? { ...styles.time }
                      : { ...styles.time, fontWeight: "bold", color: "#000000" }
                  }
                >
                  {moment(lastMessage.timestamp).fromNow()}
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {
          //lastMessage.user.id === currentUser.id && !lastMessage.read ? null :
          lastMessage.read === undefined ? null : lastMessage.read ? null : (
            <View
              style={{
                position: "absolute",
                top: 22,
                right: 20,
                backgroundColor: "transparent",
              }}
            >
              <Text
                style={{
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  height: 10,
                  width: 10,
                  borderRadius: 10,
                  textAlign: "center",
                  paddingVertical: 2,
                  fontSize: 12,
                }}
              ></Text>
            </View>
          )
        }
      </>
    )
  );
};

export default ChatListItem;
