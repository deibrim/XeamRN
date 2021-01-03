import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FlatList,
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import * as SQLite from "expo-sqlite";
import firebase from "../../firebase/firebase.utils";
import {
  createMessagesTable,
  dropMessagesTable,
  updateMessagesTable,
} from "../../sqlite/sqlite.functions";
// import { setUserPosts } from "../../redux/chat/actions";
import ChatMessage from "../../components/ChatMessage";
import InputBox from "../../components/InputBox";

import ChatRoomUtils from "../../components/ChatRoomUtils/ChatRoomUtils";
let flatListRef;
const ChatRoomScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.currentUser);
  const chatBackground = useSelector((state) => state.chat.chatBackground);
  const privateChannel = useSelector((state) => state.chat.isPrivateChannel);
  const channel = useSelector((state) => state.chat.currentChannel);
  const dispatch = useDispatch();
  const [privateMessagesRef] = useState(
    firebase.database().ref("privateMessages")
  );
  const [messagesRef] = useState(firebase.database().ref("messages"));
  const [usersRef] = useState(firebase.database().ref("users"));
  const [typingRef] = useState(firebase.database().ref("typing"));
  const [connectedRef] = useState(firebase.database().ref(".info/connected"));
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [isChannelStarred, setIsChannelStarred] = useState(false);
  const [numUniqueUsers, setNumUniqueUsers] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [typing, setTyping] = useState(false);
  const [listeners, setListeners] = useState([]);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [index, setIndex] = useState(messages.length);
  const [showMore, setShowMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [messageExists, setMessageExists] = useState(false);
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState({});

  const onClick = () => {
    navigation.goBack();
  };
  const db = SQLite.openDatabase("msgStore.db");

  const getMessagesFormLocalDB = (db, channel) => {
    const chatroomId = channel.split("/").join("");
    db.transaction((tx) => {
      tx.executeSql(`select * from ${chatroomId}`, [], (_, { rows }) => {
        if (rows.length !== 0) {
          console.log("====================================");
          console.log("COUNT", rows.length);
          console.log("====================================");
        }
      });
    });
  };
  useEffect(() => {
    // dropMessagesTable(db, channel.id);
    createMessagesTable(db, channel.id);
    db.transaction((tx) => {
      tx.executeSql(
        `select * from ${channel.id.split("/").join("")}`,
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            setMessageExists(true);
            console.log(rows);
            setMessages(rows._array);
          }
        }
      );
    });
    // getMessagesFormLocalDB(db, channel.id);
    if (channel && user) {
      addListeners(channel.id);
    }
  }, [channel]);

  function addTypingListeners(channelId) {
    let typingUsers = [];
    typingRef.child(channelId).on("child_added", (snap) => {
      if (snap.key !== user.id) {
        if (snap.val() === route.params.username && privateChannel) {
          setTyping(true);
          return;
        }
        typingUsers = typingUsers.concat({
          id: snap.key,
          name: snap.val(),
        });
        setTypingUsers(typingUsers);
      }
    });

    typingRef.child(channelId).on("child_removed", (snap) => {
      const index = typingUsers.findIndex((user) => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter((user) => user.id !== snap.key);
        setTypingUsers(typingUsers);
      }
    });

    connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        typingRef
          .child(channelId)
          .child(user.id)
          .onDisconnect()
          .remove((err) => {
            if (err !== null) {
              console.error(err);
            }
          });
      }
    });
  }
  function addListeners(channelId) {
    addMessageListener(channelId);
    addTypingListeners(channelId);
  }

  function addMessageListener(channelId) {
    const ref = getMessagesRef();
    console.log(messageExists);
    if (!messageExists) {
      let loadedMessages = [];
      ref.child(channelId).on("child_added", async (snap) => {
        const {
          id,
          content,
          read,
          timestamp,
          reply_msg,
          reply_uid,
          reply_username,
          uid,
          username,
        } = snap.val();
        const transformed = {
          ...snap.val(),
          key: snap.key,
        };
        console.log("rows.length == 0");
        // (id, content, key, read, reply_msg, reply_uid, reply_username, timestamp, uid, username)
        if (snap.val().reply_msg) {
          updateMessagesTable(
            db,
            [
              id,
              content,
              snap.key,
              read ? 1 : 0,
              reply_msg,
              reply_uid,
              reply_username,
              timestamp,
              uid,
              username,
            ],
            channelId
          );
        } else {
          updateMessagesTable(
            db,
            [
              id,
              content,
              snap.key,
              read ? 1 : 0,
              null,
              null,
              null,
              timestamp,
              uid,
              username,
            ],
            channelId
          );
        }
        loadedMessages.push(transformed);
        getMessagesFormLocalDB(db, channelId);
      });
      setMessagesLoading(false);
    } else {
      ref
        .child(channelId)
        .orderByChild("read")
        .equalTo(false)
        // .orderByChild(`uid`)
        // .equalTo(route.params.id)
        .on("child_added", (snap) => {
          if (snap.numChildren() !== 0) {
            if (user.id === snap.val().uid) {
              return;
            }
            // ref
            //   .child(channelId)
            //   .orderByChild(`read`)
            //   .equalTo(false)
            //   .on("child_added", (snap) => {
            const {
              id,
              content,
              read,
              reply_msg,
              reply_uid,
              reply_username,
              timestamp,
              uid,
              username,
            } = snap.val();
            console.log("snap.numChildren() !== 0");
            if (snap.val().reply_msg) {
              updateMessagesTable(
                db,
                [
                  id,
                  content,
                  snap.key,
                  read ? 1 : 0,
                  reply_msg,
                  reply_uid,
                  reply_username,
                  timestamp,
                  uid,
                  username,
                ],
                channelId
              );
            } else {
              console.log("BUG HERE");
              updateMessagesTable(
                db,
                [
                  id,
                  content,
                  snap.key,
                  read ? 1 : 0,
                  null,
                  null,
                  null,
                  timestamp,
                  uid,
                  username,
                ],
                channelId
              );
            }
            getMessagesFormLocalDB(db, channelId);
            setMessagesLoading(false);
            return;
            // });
          } else {
            getMessagesFormLocalDB(db, channelId);
            setMessagesLoading(false);
          }
        });
    }
  }

  function getMessagesRef() {
    return privateChannel ? privateMessagesRef : messagesRef;
  }

  function handleSearchMessages() {
    const channelMessages = [...messages];
    const regex = new RegExp(query, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResults(searchResults);
    setTimeout(() => setSearchLoading(false), 1000);
  }

  function displayChannelName(channel) {
    return channel
      ? `${privateChannel ? "" : ""}${channel.name.split(" ")[0]}`
      : "";
  }

  const displayTypingUsers = (users) =>
    users.length > 0 &&
    users.map((user) => (
      <View
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 0.2,
        }}
        key={user.id}
      >
        <Text style={{}}>{user.name} is typing...</Text>
      </View>
    ));
  const chatBGPicker = () => {
    switch (chatBackground) {
      case 1:
        return require(`../../assets/cwall/1.jpg`);
        break;
      case 2:
        return require(`../../assets/cwall/2.jpg`);
        break;
      case 3:
        return require(`../../assets/cwall/3.jpg`);
        break;
      case 4:
        return require(`../../assets/cwall/4.png`);
        break;
      case 5:
        return require(`../../assets/cwall/5.jpg`);
        break;
      case 6:
        return require(`../../assets/cwall/6.jpg`);
        break;
      case 7:
        return require(`../../assets/cwall/7.jpg`);
        break;
      case 8:
        return require(`../../assets/cwall/8.jpg`);
        break;
      case 9:
        return require(`../../assets/cwall/9.jpg`);
        break;
      default:
        return { uri: chatBackground };
        break;
    }
  };
  const onScrollToBottom = (index) => {
    // console.log("====================================");
    // console.log(flatListRef.getNativeScrollRef());
    // console.log("====================================");
  };
  const onScroll = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.y;
    // console.log("====================================");
    // console.log(scrollOffset);
    // console.log("====================================");
    // if (index === messages.length) {
    //   setScrollToBottom(false);
    // }
    // setScrollToBottom(true);
  };
  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={onClick}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="ios-arrow-back" size={24} color="black" />
            <View>
              <Text
                style={{
                  color: "#42414C",
                  fontSize: 16,
                  marginLeft: 10,
                  marginBottom: 1,
                }}
              >
                {displayChannelName(channel)}
              </Text>
              {typingUsers.length !== 0 && (
                <Text
                  style={{
                    color: "#42414C",
                    fontSize: 12,
                    marginLeft: 10,
                    marginBottom: 1,
                  }}
                >
                  {displayTypingUsers(typingUsers)}
                </Text>
              )}
              {typing ? (
                <Text style={{ marginLeft: 12, color: "gray" }}>typing...</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => setShowMore(!showMore)}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={22}
              color={"black"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ImageBackground style={{ flex: 1 }} source={chatBGPicker()}>
        <FlatList
          data={query ? searchResults : messages}
          ref={async (ref) => {
            flatListRef = ref;
          }}
          initialNumToRender={messages.length}
          onContentSizeChange={() => flatListRef.scrollToEnd()}
          renderItem={({ item, index }) => (
            <ChatMessage
              message={item}
              messageRef={getMessagesRef}
              channelId={channel.id}
              quantity={messages.length}
              index={index}
              setReply={setReply}
              endUser={route.params}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => {
            setScrollToBottom(false);
          }}
          onEndReachedThreshold={() => {
            setScrollToBottom(false);
          }}
          extraData={messages}
          onScroll={onScroll}
        />
      </ImageBackground>

      <InputBox
        bg={chatBGPicker()}
        messagesRef={messagesRef}
        currentChannel={channel}
        currentUser={user}
        isPrivateChannel={privateChannel}
        getMessagesRef={getMessagesRef}
        endUser={route.params}
        reply={reply}
        setReply={setReply}
        messages={messages}
        setMessages={setMessages}
      />
      <ChatRoomUtils
        helper={{
          scrollToBottom,
          showMore,
          searching,
          setShowMore,
          setSearching,
          searchLoading,
          query,
          setQuery,
          setSearchLoading,
          handleSearchMessages,
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 20,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 80,
    right: 15,
    // zIndex: 99,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#006eff",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    width: 35,
    borderRadius: 20,
  },
  moreModalContainer: {
    position: "absolute",
    zIndex: 5,
    top: 0,
    right: 0,
    left: 0,
    alignItems: "flex-end",
    backgroundColor: "transparent",
    paddingTop: 85,
  },
  modalContainer: {
    alignItems: "center",
    minHeight: 20,
    minWidth: 150,
    maxWidth: 150,
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  modalTextButton: {
    flexDirection: "row",
    marginVertical: 3,
    paddingVertical: 5,
    // borderBottomColor: "#999999",
    // borderBottomWidth: 0.5,
  },
  modalText: {
    color: "#111111",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ChatRoomScreen;
