import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../redux/chat/actions";
import styles from "./style";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const ChatListItem = (props) => {
  const { user } = props;
  const [lastMessage, setLastMessage] = useState({});
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {}, []);

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
    };
    dispatch(setCurrentChannel(channelData));
    dispatch(setPrivateChannel(true));
    navigation.navigate("ChatRoom", {
      name: user.name,
    });
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={changeChannel}>
        <View style={styles.container}>
          <View style={styles.lefContainer}>
            <View style={{ position: "relative" }}>
              <Image source={{ uri: user.profile_pic }} style={styles.avatar} />
              {/* <View
                style={
                  user.status === "online"
                    ? { ...styles.isOnline }
                    : { ...styles.isOnline, ...styles.isOffline }
                }
              ></View> */}
            </View>

            <View style={styles.midContainer}>
              <Text style={styles.username}>{user.name}</Text>
              {/* <Text numberOfLines={2} style={styles.lastMessage}>
                {chatRoom.lastMessage.content}
              </Text> */}
            </View>
          </View>

          {/* <Text style={styles.time}>
            {moment(chatRoom.lastMessage.createdAt).format("DD/MM/YYYY")}
          </Text> */}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default ChatListItem;
