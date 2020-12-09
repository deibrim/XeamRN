import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Image, View, ScrollView, Text, TouchableOpacity } from "react-native";
import CommentInput from "../CommentInput/CommentInput";
import { styles } from "./styles";
import { firestore } from "../../firebase/firebase.utils";
import CommentPreview from "../CommentPreview/CommentPreview";
const CommentModal = ({
  postId,
  postOwnerId,
  setShowComments,
  setToggleScroll,
}) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getComments();
  }, []);
  async function getComments() {
    const commentRef = await firestore
      .collection("comments")
      .doc(postId)
      .collection("comments")
      .orderBy("date", "asc");
    commentRef.onSnapshot((snapshot) => {
      const commentArr = [];
      snapshot.docs.forEach((comment) => {
        commentArr.push(comment.data());
      });
      setComments(commentArr);
    });
    setLoading(false);
  }
  return loading ? (
    <View
      style={{
        flex: 1,
        minHeight: 200,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <Image
        style={{ marginLeft: 5, width: 30, height: 30 }}
        source={require("../../assets/loader.gif")}
      />
    </View>
  ) : (
    <View style={styles.commentModal}>
      <View style={styles.commentHead}>
        <Text style={{ fontSize: 16 }}>Comments</Text>
        <TouchableOpacity
          style={{ width: 50, alignItems: "flex-end" }}
          onPress={() => {
            setToggleScroll(true);
            setShowComments(false);
          }}
        >
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView styles={styles.comments}>
        {comments.map((item, index) => (
          <CommentPreview key={index} comment={item} />
        ))}
      </ScrollView>
      <View style={styles.commentBox}>
        <CommentInput postId={postId} postOwnerId={postOwnerId} />
      </View>
    </View>
  );
};

export default CommentModal;
