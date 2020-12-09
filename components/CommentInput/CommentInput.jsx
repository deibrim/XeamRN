import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { addAComment } from "../../firebase/firebase.utils";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "./styles";

const CommentInput = ({ postId, postOwnerId }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const replyUser = useSelector((state) => state.reel.replyUser);
  const [id] = useState(uuidv4().split("-").join(""));
  const [comment, setComment] = useState(
    replyUser !== "" ? `@${replyUser}` : ""
  );
  const [loading, setLoading] = useState(false);

  async function addComment(event) {
    setLoading(true);
    if (comment.trim() === "") return;
    const data = {
      id,
      username: currentUser.username,
      text: comment,
      photo: currentUser.profile_pic,
      date: Date.now(),
      replies: [],
    };
    await addAComment(
      currentUser,
      data,
      postId,
      postOwnerId,
      postOwnerId === currentUser.id
    );
    setComment("");
    setLoading(false);
  }
  return (
    <>
      <View style={styles.container}>
        <View
          style={
            !comment
              ? styles.mainContainer
              : { ...styles.mainContainer, alignItems: "flex-end" }
          }
        >
          <TextInput
            placeholder={"Write comment"}
            style={styles.textInput}
            multiline
            value={comment}
            onChangeText={setComment}
            autoFocus={replyUser !== "" ? true : false}
          />
        </View>
        <TouchableOpacity onPress={!loading ? addComment : () => {}}>
          <View style={styles.buttonContainer}>
            {loading ? (
              <MaterialCommunityIcons
                name="send-lock"
                size={24}
                color="#f2f5f5"
              />
            ) : (
              <MaterialCommunityIcons name="send" size={24} color="white" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CommentInput;
