import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../redux/chat/actions";
import firebase from "../../firebase/firebase.utils";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import styles from "./style";

const ChatListItem = (props) => {
  const { user } = props;
  const [lastMessage, setLastMessage] = useState({});
  const [isOnline, setIsOnline] = useState(false);
  const [timestapBold, setTimestapBold] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
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
        setLastMessage(snapshot.val());
      });
  }
  async function getUserPresence() {
    firebase
      .database()
      .ref(`/presence/${user.id}`)
      .on("child_added", (snapshot) => {
        setIsOnline(snapshot.val());
      });
  }

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
  const { content, timestamp } = lastMessage;
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
      {content}
    </Text>
  );
  const onRead = (
    <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.lastMessage}>
      {content}
    </Text>
  );
  const lastMessageComp = () => {
    if (lastMessage.read === undefined) {
      return onRead;
    }
    if (lastMessage.read) {
      return onRead;
    } else {
      // setTimestapBold(true);
      return notRead;
    }
  };
  return (
    <>
      <TouchableWithoutFeedback onPress={changeChannel}>
        <View style={styles.container}>
          <View style={styles.lefContainer}>
            <View style={{ position: "relative" }}>
              <Image source={{ uri: user.profile_pic }} style={styles.avatar} />
              <View
                style={
                  isOnline
                    ? { ...styles.isOnline }
                    : { ...styles.isOnline, ...styles.isOffline }
                }
              ></View>
            </View>

            <View style={styles.midContainer}>
              <Text style={styles.username}>{user.name}</Text>
              {lastMessageComp()}
              <Text
                style={
                  !lastMessage.read
                    ? { ...styles.time, fontWeight: "bold" }
                    : { ...styles.time }
                }
              >
                {moment(timestamp).fromNow()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default ChatListItem;
