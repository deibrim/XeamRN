import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useForceUpdate, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as SQLite from "expo-sqlite";
import firebase from "../firebase/firebase.utils";
import {
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Text, View } from "../components/Themed";
import ChatListItem from "../components/ChatListItem";
import { setFriends } from "../redux/chat/actions";
import { styles } from "./styles";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
function ChatFriendListScreen({ setCurrentChannel, setPrivateChannel }) {
  const user = useSelector((state) => state.user.currentUser);
  const friends = useSelector((state) => state.chat.friends);
  // const [friends, setFriends] = useState([]);
  const [friendsRef] = useState(firebase.database().ref(`/friends/${user.id}`));
  const [localDbFriends, setLocalDbFriends] = useState({});
  const [activeChannel, setActiveChannel] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];
  }

  const dispatch = useDispatch();
  const db = SQLite.openDatabase("frndsStore.db");
  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `create table if not exists friends (id text, name text, profile_pic text, username text);`
      );
    });
  };
  const updateTable = (arrData) => {
    db.transaction((tx) => {
      tx.executeSql(
        `insert into friends (id, name, profile_pic, username) values (?, ?, ?, ?)`,
        [...arrData]
      );
    });
  };
  const getDataFromTable = () => {
    db.transaction((tx) => {
      tx.executeSql("select * from friends", [], (_, { rows }) => {
        setLocalDbFriends(rows);
        dispatch(setFriends(rows._array));
      });
    });
  };
  const dropTable = () => {
    db.transaction((tx) => {
      tx.executeSql(`drop table friends;`);
    });
  };
  useEffect(() => {
    // dropTable();
    // createTable();
    // getDataFromTable();
    if (user) {
      // addListeners(user.id);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  function addListeners(currentUserId) {
    db.transaction((tx) => {
      tx.executeSql("select * from friends", [], (_, { rows }) => {
        setLocalDbFriends(rows);
        if (rows.length == 0) {
          setLoading(true);
          const loadedUsers = [];
          friendsRef.on("child_added", (snap) => {
            if (currentUserId !== snap.key) {
              const user = snap.val();
              user["id"] = snap.key;
              user["status"] = "offline";
              loadedUsers.push(user);
              updateTable([
                user.id,
                user.name,
                user.profile_pic,
                user.username,
              ]);
            }
            dispatch(setFriends(loadedUsers));
            getDataFromTable();
            setLoading(false);
          });
        } else {
          tx.executeSql("select * from friends", [], (_, { rows }) => {
            setLocalDbFriends(rows);
            const loadedUsers = [];
            firebase
              .database()
              .ref(`/friends/${user.id}`)
              .on("child_added", (snap) => {
                if (rows.length === snap.numChildren() + 2) {
                  dispatch(setFriends(rows._array));
                } else {
                  if (currentUserId !== snap.key) {
                    dropTable();
                    createTable();
                    const user = snap.val();
                    user["id"] = snap.key;
                    user["status"] = "offline";
                    loadedUsers.push(user);
                    updateTable([
                      user.id,
                      user.name,
                      user.profile_pic,
                      user.username,
                    ]);
                  }
                  dispatch(setFriends(rows._array));
                }
              });
          });
        }
      });
    });
  }

  function getChannelId(userId) {
    const currentUserId = user.id;

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        {!loading && (
          <View style={styles.chatCountContainer}>
            <Text style={styles.chatCount}>{friends.length}</Text>
          </View>
        )}
      </View>
      <View
        style={{
          backgroundColor: "#ecf2fa",
          width: "100%",
          flex: 1,
          paddingTop: 10,
        }}
      >
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
            <Text style={styles.chatCount}>Under Construction</Text>
          </View>
        )}
        {/* <FlatList
          data={friends}
          renderItem={({ item }) => <ChatListItem user={item} />}
          keyExtractor={(item, index) => index.toString()}
          extraData={friends}
        /> */}
      </View>
    </>
  );
}

export default ChatFriendListScreen;
