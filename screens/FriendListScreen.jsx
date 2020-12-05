import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import firebase, { firestore } from "../firebase/firebase.utils";
import {
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Text, View } from "../components/Themed";
import ChatListItem from "../components/ChatListItem";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
function FriendListScreen({
  currentUser,
  setCurrentChannel,
  setPrivateChannel,
}) {
  const user = useSelector((state) => state.user.currentUser);
  const [users, setUsers] = useState([]);
  const [usersRef] = useState(firebase.database().ref("users"));
  const [connectedRef] = useState(firebase.database().ref(".info/connected"));
  const [presenceRef] = useState(firebase.database().ref("presence"));
  const [activeChannel, setActiveChannel] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      addListeners(user.id);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function addListeners(currentUserId) {
    setLoading(true);
    const loadedUsers = [];
    usersRef.on("child_added", (snap) => {
      if (currentUserId !== snap.key) {
        const user = snap.val();
        user["id"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
      }
      setUsers(loadedUsers);
      setLoading(false);
    });

    connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        const ref = presenceRef.child(currentUserId);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          if (err !== null) {
            console.log(err);
          }
        });
      }
    });
  }

  function isUserOnline(user) {
    return user.status === "online";
  }

  function getChannelId(userId) {
    const currentUserId = user.id;

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  }

  function changeChannel(user) {
    const channelId = getChannelId(user.id);
    const channelData = {
      id: channelId,
      name: user.name,
    };

    setCurrentChannel(channelData);
    setPrivateChannel(true);
    setActiveChannel(user.id);
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        {/* <View style={styles.chatCountContainer}>
          <Text style={styles.chatCount}>{users.length}</Text>
        </View> */}
      </View>
      <View style={{ backgroundColor: "#ecf2fa", width: "100%", flex: 1 }}>
        {loading && (
          <View
            style={{
              flex: 1,
              minHeight: 150,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <Image
              style={{ marginLeft: 5, width: 30, height: 30 }}
              source={require("../assets/loader.gif")}
            />
          </View>
        )}
        <FlatList
          data={users}
          renderItem={({ item }) => <ChatListItem user={item} />}
          keyExtractor={(item, index) => index.toString()}
          extraData={users}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ecf2fa",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingLeft: 20,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ecf2fa",
    justifyContent: "space-between",
    elevation: 4,
  },
  title: {
    fontSize: 20,
    // fontWeight: "bold",
  },
  chatCountContainer: {
    width: 60,
    backgroundColor: "#b3b4b6",
    padding: 5,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    flexDirection: "row",
    justifyContent: "center",
  },
  chatCount: {
    color: "#000000",
    fontSize: 18,
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default FriendListScreen;
