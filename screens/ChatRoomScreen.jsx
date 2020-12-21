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
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import firebase from "../firebase/firebase.utils";
import { setUserPosts } from "../redux/chat/actions";
import ChatMessage from "../components/ChatMessage";
import InputBox from "../components/InputBox";
import CustomInput from "../components/CustomInput/CustomInput";
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
  const [query, setQuery] = useState("");

  const onClick = () => {
    navigation.goBack();
  };
  useEffect(() => {
    if (channel && user) {
      removeListeners(listeners);
      addListeners(channel.id);
      addUserStarsListener(channel.id, user.id);
    }
  }, []);

  // componentWillUnmount() {
  //   removeListeners(listeners);
  //   connectedRef.off();
  // }

  // componentWillUnmount() {
  //   removeListeners(listeners);
  //   connectedRef.off();
  // }

  function removeListeners(listeners) {
    listeners.forEach((listener) => {
      listener.ref.child(listener.id).off(listener.event);
    });
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.messagesEnd) {
  //     this.scrollToBottom();
  //   }
  // }

  function addToListeners(id, ref, event) {
    const index = listeners.findIndex((listener) => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      setListeners(listeners.concat(newListener));
    }
  }

  // scrollToBottom = () => {
  //   this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  // };

  function addListeners(channelId) {
    addMessageListener(channelId);
    addTypingListeners(channelId);
  }

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
    addToListeners(channelId, typingRef, "child_added");

    typingRef.child(channelId).on("child_removed", (snap) => {
      const index = typingUsers.findIndex((user) => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter((user) => user.id !== snap.key);
        setTypingUsers(typingUsers);
      }
    });
    addToListeners(channelId, typingRef, "child_removed");

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

  function addMessageListener(channelId) {
    let loadedMessages = [];
    const ref = getMessagesRef();
    ref.child(channelId).on("child_added", (snap) => {
      const transformed = {
        ...snap.val(),
        key: snap.key,
      };
      loadedMessages.push(transformed);
      setMessages(loadedMessages);
      setMessagesLoading(false);
      countUniqueUsers(loadedMessages);
      countUserPosts(loadedMessages);
    });
    addToListeners(channelId, ref, "child_added");
  }

  function addUserStarsListener(channelId, userId) {
    usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then((data) => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          setIsChannelStarred(prevStarred);
        }
      });
  }

  function getMessagesRef() {
    return privateChannel ? privateMessagesRef : messagesRef;
  }

  function handleStar() {
    setIsChannelStarred(!isChannelStarred);
    starChannel();
  }

  function starChannel() {
    if (isChannelStarred) {
      usersRef.child(`${user.id}/starred`).update({
        [channel.id]: {
          name: channel.name,
          details: channel.details,
          createdBy: {
            name: channel.createdBy.name,
            avatar: channel.createdBy.avatar,
          },
        },
      });
    } else {
      usersRef
        .child(`${user.id}/starred`)
        .child(channel.id)
        .remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
    }
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

  function countUniqueUsers(messages) {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const numUniqueUsers = uniqueUsers.length;
    setNumUniqueUsers(numUniqueUsers);
  }

  function countUserPosts(messages) {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1,
        };
      }
      return acc;
    }, {});
    dispatch(setUserPosts(userPosts));
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
        return require(`../assets/cwall/1.jpg`);
        break;
      case 2:
        return require(`../assets/cwall/2.jpg`);
        break;
      case 3:
        return require(`../assets/cwall/3.jpg`);
        break;
      case 4:
        return require(`../assets/cwall/4.png`);
        break;
      case 5:
        return require(`../assets/cwall/5.jpg`);
        break;
      case 6:
        return require(`../assets/cwall/6.jpg`);
        break;
      case 7:
        return require(`../assets/cwall/7.jpg`);
        break;
      case 8:
        return require(`../assets/cwall/8.jpg`);
        break;
      case 9:
        return require(`../assets/cwall/9.jpg`);
        break;
      default:
        break;
    }
  };
  const onScrollToBottom = (index) => {
    console.log("====================================");
    console.log(flatListRef.getNativeScrollRef());
    console.log("====================================");
  };
  const onScroll = () => {
    if (index === messages.length) {
      setScrollToBottom(false);
    }
    setScrollToBottom(true);
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
          renderItem={({ item }) => (
            <ChatMessage
              message={item}
              messageRef={getMessagesRef}
              channelId={channel.id}
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
      />
      {scrollToBottom ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              onScrollToBottom();
            }}
          >
            <View style={styles.button}>
              <Feather name="chevrons-down" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
      {showMore ? (
        <TouchableWithoutFeedback
          onPress={() => {
            setShowMore(false);
          }}
        >
          <View style={{ ...styles.moreModalContainer, bottom: 0 }}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.modalTextButton}
                onPress={() => {
                  setSearching(true);
                  setShowMore(false);
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Feather
                    name="search"
                    size={18}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.modalText}>Search</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      ) : null}
      {searching ? (
        <View
          style={{
            ...styles.moreModalContainer,
            alignItems: "flex-start",
            backgroundColor: "transparent",
            paddingTop: 35,
            flexDirection: "row",
            paddingRight: 20,
          }}
        >
          <CustomInput
            onChange={(e) => {
              setQuery(e);
              setSearchLoading(true);
              handleSearchMessages();
            }}
            value={query}
            placeholder={"Search message"}
            icon={
              searchLoading ? (
                <Image
                  style={{ marginLeft: 5, width: 18, height: 18 }}
                  source={require("../assets/loader.gif")}
                />
              ) : (
                <Feather name="search" size={18} color="black" />
              )
            }
            iStyle={{ padding: 0, height: 40, paddingLeft: 10 }}
            cStyle={{ paddingLeft: 10, height: 40, margin: 0, flex: 1 }}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 25,
                height: 25,
                borderRadius: 20,
                elevation: 2,
                marginTop: 10,
                backgroundColor: "#ff4747",
              }}
              onPress={() => {
                setSearching(false);
              }}
            >
              <AntDesign name="close" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </>
  );
};
// const scrollToEnd = (index) => {
//   console.log("====================================");
//   console.log(flatListRef);
//   console.log("====================================");
//   // flatListRef.scrollToEnd();
// };
// scrollToEnd();
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
