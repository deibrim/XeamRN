import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FlatList,
  Text,
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import firebase, { firestore } from "../firebase/firebase.utils";
import { setUserPosts } from "../redux/chat/actions";
import ChatMessage from "../components/ChatMessage";
import InputBox from "../components/InputBox";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [listeners, setListeners] = useState([]);

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
      loadedMessages.push(snap.val());
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

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
    handleSearchMessages();
  }

  function handleSearchMessages() {
    const channelMessages = [...messages];
    const regex = new RegExp(searchTerm, "gi");
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
    return channel ? `${privateChannel ? "" : ""}${channel.name}` : "";
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
  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableWithoutFeedback onPress={onClick}>
            <Ionicons name="ios-arrow-back" size={24} color="black" />
          </TouchableWithoutFeedback>
          <View>
            <Text
              style={{
                color: "#42414C",
                fontSize: 20,
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
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={22}
            color={"black"}
          />
        </View>
      </View>
      <ImageBackground style={{ flex: 1 }} source={chatBGPicker()}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <ChatMessage message={item} />}
          keyExtractor={(item, index) => index.toString()}
          extraData={messages}
        />
      </ImageBackground>

      <InputBox
        bg={chatBGPicker()}
        messagesRef={messagesRef}
        currentChannel={channel}
        currentUser={user}
        isPrivateChannel={privateChannel}
        getMessagesRef={getMessagesRef}
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
});

export default ChatRoomScreen;
