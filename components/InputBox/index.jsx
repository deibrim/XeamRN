import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
  Ionicons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import EmojiBoard from "react-native-emoji-board";
import firebase, { firestore } from "../../firebase/firebase.utils";
import * as SQLite from "expo-sqlite";
import { updateMessagesTable } from "../../sqlite/sqlite.functions";
import styles from "./styles";

const InputBox = (props) => {
  const {
    messagesRef,
    currentChannel,
    currentUser,
    isPrivateChannel,
    getMessagesRef,
    endUser,
    reply,
    setReply,
  } = props;
  const [message, setMessage] = useState("");
  const [storageRef, setStorageRef] = useState(firebase.storage().ref());
  const [typingRef, setTypingRef] = useState(firebase.database().ref("typing"));
  const [uploadTask, setUploadTask] = useState(null);
  const [uploadState, setUploadState] = useState("");
  const [percentUploaded, setPercentUploaded] = useState(0);
  const [channel, setChannel] = useState(currentChannel);
  const [user, setUser] = useState(currentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [modal, setModal] = useState(false);
  const [isFriends, setIsFriends] = useState(false);
  const [replyingMessage, setReplyingMessage] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);

  const db = SQLite.openDatabase("msgStore.db");
  const mid = uuidv4().split("-").join("");
  useEffect(() => {
    if (message) {
      typingRef.child(channel.id).child(user.id).set(`${currentUser.username}`);
    } else {
      typingRef.child(channel.id).child(user.id).remove();
    }
  }, [message]);
  function createMessage(fileUrl = null, audio = null, video = null) {
    const messageData = {
      id: mid,
      timestamp: Date.now(),
      uid: user.id,
      username: user.name,
      read: false,
    };
    if (reply.reply_msg) {
      messageData["reply_msg"] = reply.reply_msg;
      messageData["reply_uid"] = reply.reply_uid;
      messageData["reply_username"] = reply.reply_username;
    }
    if (fileUrl && fileUrl !== null) {
      messageData["image"] = fileUrl;
    } else if (audio && audio !== null) {
      messageData["audio"] = audio;
    } else {
      messageData["content"] = message;
    }
    setMessage("");
    return messageData;
  }

  const handleTogglePicker = () => {
    setEmojiPicker(!emojiPicker);
  };

  function handleAddEmoji(emoji) {
    const oldMessage = message;
    setMessage(`${oldMessage} ${emoji.code}`);
  }

  async function sendMessage() {
    const createMes = createMessage();
    const { getMessagesRef, messages, setMessages } = props;
    setMessages([...messages, createMes]);
    await firebase
      .database()
      .ref("privateMessages")
      .child(channel.id)
      .once("value", (snapshot) => {
        if (!snapshot.exists()) {
          firebase
            .database()
            .ref(`/friends/${currentUser.id}`)
            .child(endUser.id)
            .set(endUser);
          firebase
            .database()
            .ref(`/friends/${endUser.id}`)
            .child(currentUser.id)
            .set({
              name: currentUser.name,
              id: currentUser.id,
              username: currentUser.username,
              profile_pic: currentUser.profile_pic,
            });
          send();
          return;
        }
        send();
      });
    // function updateLocalDb(msg) {
    //   const {
    //     id,
    //     content,
    //     read,
    //     timestamp,
    //     reply_msg,
    //     reply_uid,
    //     reply_username,
    //     uid,
    //     username,
    //   } = msg;
    //   // console.log("====================================");
    //   // console.log(msg);
    //   // console.log(msg.reply_msg);
    //   if (msg.reply_msg) {
    //     // console.log("True ====================================");
    //     updateMessagesTable(
    //       db,
    //       [
    //         id,
    //         content,
    //         mid,
    //         read ? 1 : 0,
    //         reply_msg,
    //         reply_uid,
    //         reply_username,
    //         timestamp,
    //         uid,
    //         username,
    //       ],
    //       channel.id
    //     );
    //   } else {
    //     // console.log("False ====================================");
    //     updateMessagesTable(
    //       db,
    //       [
    //         id,
    //         content,
    //         mid,
    //         read ? 1 : 0,
    //         null,
    //         null,
    //         null,
    //         timestamp,
    //         uid,
    //         username,
    //       ],
    //       channel.id
    //     );
    //   }
    //   const chatroomId = channel.id.split("/").join("");
    //   db.transaction((tx) => {
    //     tx.executeSql(`select * from ${chatroomId}`, [], (_, { rows }) => {
    //       if (rows.length !== 0) {
    //         console.log("====================================");
    //         console.log("COUNT", rows);
    //         console.log("====================================");
    //       }
    //     });
    //   });
    // }
    async function send() {
      // updateLocalDb(createMes);
      if (message.trim() !== "") {
        setLoading(true);
        await getMessagesRef()
          .child(channel.id)
          .child(mid)
          .set(createMes)
          .then(async () => {
            setLoading(true);
            setMessage("");
            setReply({});
            setReplyingMessage(false);
            setError([]);
            typingRef.child(channel.id).child(user.id).remove();
            const ownerRef = firestore.collection("users").doc(endUser.id);
            const ownerSnapShot = await ownerRef.get();
            fetch("https://exp.host/--/api/v2/push/send", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                channelId: "ChatRoom",
                to: ownerSnapShot.data().push_token.data,
                sound: "default",
                title: user.name,
                body: `${user.username}: ${createMes.content}`,
                data: {
                  chatId: channel.id,
                  name: user.name,
                  id: user.id,
                  username: user.username,
                  profile_pic: user.profile_pic,
                },
              }),
            });
          })
          .catch((err) => {
            console.error(err);
            setLoading(true);
            setError(errors.concat(err));
          });
      } else {
        setError(errors.concat({ message: "Add a message" }));
      }
    }
  }

  const getPath = () => {
    if (props.isPrivateChannel) {
      return `chat/private/${channel.id}`;
    } else {
      return "chat/public";
    }
  };

  function uploadFile(file, metadata) {
    const pathToUpload = channel.id;
    const ref = props.getMessagesRef();
    const filePath = `${getPath()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: storageRef.child(filePath).put(file, metadata),
      },
      () => {
        uploadTask.on(
          "state_changed",
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            setPercentUploaded(percentUploaded);
            // this.setState({ percentUploaded });
          },
          (err) => {
            console.error(err);
            setError(errors.concat(err));
            setUploadState("error");
            setUploadTask(null);
            // this.setState({
            //   errors: errors.concat(err),
            //   uploadState: "error",
            //   uploadTask: null,
            // });
          },
          () => {
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadUrl) => {
                sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch((err) => {
                console.error(err);
                setError(errors.concat(err));
                setUploadState("error");
                setUploadTask(null);
                // this.setState({
                //   errors: errors.concat(err),
                //   uploadState: "error",
                //   uploadTask: null,
                // });
              });
          }
        );
      }
    );
  }

  function sendFileMessage(fileUrl, ref, pathToUpload) {
    ref
      .child(pathToUpload)
      .push()
      .set(createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          errors: errors.concat(err),
        });
      });
  }

  const onMicrophonePress = () => {
    console.warn("Microphone");
  };

  const onSendPress = () => {
    // send the message to the backend
    sendMessage();
  };

  const onPress = () => {
    if (!message) {
      onMicrophonePress();
    } else {
      onSendPress();
    }
  };

  return (
    <>
      <ImageBackground
        style={{ width: "100%", position: "relative" }}
        source={props.bg}
      >
        {replyingMessage ? (
          <View
            style={{
              minHeight: 45,
              backgroundColor: "#ffffff",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: "#666666", marginBottom: 10 }}>
                Replying to{" "}
                {reply.userId === endUser.id
                  ? `${endUser.name}`
                  : "your message"}
              </Text>
              <TouchableOpacity
                style={{
                  marginBottom: 10,
                }}
                onPress={() => {
                  setReply({});
                  setReplyingMessage(false);
                }}
              >
                <AntDesign name="close" size={18} color="#000000" />
              </TouchableOpacity>
            </View>
            <Text>{reply.message}</Text>
          </View>
        ) : null}
        <View style={styles.container}>
          <View
            style={
              !message
                ? styles.mainContainer
                : { ...styles.mainContainer, alignItems: "flex-end" }
            }
          >
            <TouchableWithoutFeedback onPress={() => handleTogglePicker()}>
              <FontAwesome5 name="laugh-beam" size={24} color="grey" />
            </TouchableWithoutFeedback>
            <TextInput
              placeholder={"Type a message"}
              style={styles.textInput}
              multiline
              autoFocus={true}
              onBlur={() => {
                if (reply.message) {
                  setReplyingMessage(true);
                }
              }}
              onFocus={() => {
                if (reply.message) {
                  setReplyingMessage(true);
                }
              }}
              value={message}
              onChangeText={setMessage}
            />
            {!message && (
              <TouchableWithoutFeedback onPress={() => {}}>
                <Entypo
                  name="attachment"
                  size={18}
                  color="grey"
                  style={styles.icon}
                />
              </TouchableWithoutFeedback>
            )}
            {/* {!message && (
          <Fontisto name="camera" size={18} color="grey" style={styles.icon} />
        )} */}
          </View>
          <TouchableOpacity onPress={onPress}>
            <View style={styles.buttonContainer}>
              {!message ? (
                <MaterialCommunityIcons
                  name="microphone"
                  size={24}
                  color="white"
                />
              ) : (
                <Ionicons name="ios-send" size={24} color="white" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <EmojiBoard
        containerStyle={
          emojiPicker ? { position: "relative" } : { position: "absolute" }
        }
        tabBarStyle={{ height: 40, alignItems: "center" }}
        showBoard={emojiPicker}
        onClick={handleAddEmoji}
      />
    </>
  );
};

export default InputBox;
