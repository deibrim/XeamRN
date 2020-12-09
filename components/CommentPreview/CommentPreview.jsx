import { Entypo } from "@expo/vector-icons";
import React from "react";
import { useDispatch } from "react-redux";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { setReplyUser } from "../../redux/reel/actions";

const CommentPreview = ({ comment }) => {
  const dispatch = useDispatch();
  return (
    <>
      <View style={styles.container}>
        <View style={styles.lefContainer}>
          <View>
            <Image source={{ uri: comment.photo }} style={styles.photo} />
          </View>
          <View style={styles.midContainer}>
            <Text style={styles.username}>
              {comment.username.split("")[0].toUpperCase() +
                comment.username.substring(1)}
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get("window").width - 100,
              }}
            >
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          </View>
        </View>
      </View>
      {/* <View style={styles.footer}>
        <Text style={styles.repliesText}>{comment.replies.length} replies</Text>
        <View style={styles.replyButton}>
          <TouchableOpacity
            onPress={() => {
              dispatch(setReplyUser(comment.username));
            }}
          >
            <Entypo name="reply" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View> */}
    </>
  );
};

export default CommentPreview;
