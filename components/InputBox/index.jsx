import {
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
  Ionicons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import EmojiBoard from "react-native-emoji-board";
import firebase from "../../firebase/firebase.utils";

import BG from "../../assets/images/BG.png";
import styles from "./styles";

const InputBox = (props) => {
  const {
    messagesRef,
    currentChannel,
    currentUser,
    isPrivateChannel,
    getMessagesRef,
  } = props;
  // console.log("===============messagesRef=====================");
  // console.log(messagesRef);
  // console.log("====================================");
  // console.log("=================currentChannel===================");
  // console.log(currentChannel);
  // console.log("====================================");
  // console.log("==================currentUser==================");
  // console.log(currentUser);
  // console.log("====================================");
  // console.log("==================isPrivateChannel==================");
  // console.log(isPrivateChannel);
  // console.log("====================================");
  // console.log("==================getMessagesRef==================");
  // console.log(getMessagesRef());
  // console.log("====================================");console.log("===============messagesRef=====================");
  // console.log(messagesRef);
  // console.log("====================================");
  // console.log("=================currentChannel===================");
  // console.log(currentChannel);
  // console.log("====================================");
  // console.log("==================currentUser==================");
  // console.log(currentUser);
  // console.log("====================================");
  // console.log("==================isPrivateChannel==================");
  // console.log(isPrivateChannel);
  // console.log("====================================");
  // console.log("==================getMessagesRef==================");
  // console.log(getMessagesRef());
  // console.log("====================================");
  const [message, setMessage] = useState("");
  const [storageRef, setStorageRef] = useState(firebase.storage().ref());
  const [typingRef, setTypingRef] = useState(firebase.database().ref("typing"));
  const [uploadTask, setUploadTask] = useState(null);
  const [uploadState, setUploadState] = useState("");
  const [percentUploaded, setPercentUploaded] = useState(0);
  const [channel, setChannel] = useState(props.currentChannel);
  const [user, setUser] = useState(props.currentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [modal, setModal] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);

  function createMessage(
    fileUrl = null,
    audio = null,
    video = null,
    photo = null
  ) {
    const messageData = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.id,
        name: user.name,
      },
    };
    if (fileUrl && fileUrl !== null) {
      messageData["image"] = fileUrl;
    } else {
      messageData["content"] = message;
    }
    console.log("====================================");
    console.log(message);
    console.log("====================================");
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
    const { getMessagesRef } = props;
    // const { message, channel, user, typingRef } = this.state;

    if (message) {
      setLoading(true);
      // this.setState({ loading: true });
      console.log("====================================");
      console.log(channel.id);
      console.log("====================================");
      await getMessagesRef()
        .child(channel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setLoading(true);
          setMessage("");
          setError([]);
          // this.setState({ loading: false, message: "", errors: [] });
          typingRef.child(channel.id).child(user.id).remove();
        })
        .catch((err) => {
          console.error(err);
          setLoading(true);
          setError(errors.concat(err));
          // this.setState({
          //   loading: false,
          //   errors: errors.concat(err),
          // });
        });
    } else {
      setError(errors.concat({ message: "Add a message" }));
      // this.setState({
      //   errors: errors.concat({ message: "Add a message" }),
      // });
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
      <ImageBackground style={{ width: "100%" }} source={props.bg}>
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