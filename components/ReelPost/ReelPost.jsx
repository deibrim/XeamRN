import React, { useEffect, useState } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { Video } from "expo-av";
import styles from "./styles";
import {
  firestore,
  addLikeToActivityFeed,
  removeLikeFromActivityFeed,
} from "../../firebase/firebase.utils";
import { Entypo, AntDesign, FontAwesome, Fontisto } from "@expo/vector-icons";
import CommentInput from "../CommentInput/CommentInput";
import { ScrollView } from "react-native-gesture-handler";
import CommentModal from "../CommentModal/CommentModal";

const ReelPost = (props) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [post, setPost] = useState(props.post);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [videoUri, setVideoUri] = useState("");

  const [paused, setPaused] = useState(false);
  const [activePaused, setActivePaused] = useState(true);

  const onPlayPausePress = () => {
    setPaused(!paused);
  };
  const onActivePlayPausePress = () => {
    setActivePaused(!activePaused);
  };

  const onLikePress = () => {
    const isLiked = post.likes[currentUser.id] === true;
    const cuserId = currentUser.id;
    // const Likes = { ...post.likes };
    if (isLiked) {
      post.likes[cuserId] = false;
      let likes = post.likes;
      firestore
        .collection("reels")
        .doc(post.user_id)
        .collection("userReels")
        .doc(post.id)
        .update({ likes });
      removeLikeFromActivityFeed(
        currentUser,
        post.user_id,
        post.id,
        currentUser.id != post.user_id
      );
      setIsLiked(!isLiked);
    } else if (!isLiked) {
      post.likes[cuserId] = true;
      let likes = post.likes;
      firestore
        .collection("reels")
        .doc(post.user_id)
        .collection("userReels")
        .doc(post.id)
        .update({ likes });
      addLikeToActivityFeed(
        currentUser,
        post.user_id,
        post.id,
        currentUser.id != post.user_id,
        post.videoUri
      );
      setIsLiked(!isLiked);
    }
  };
  const getLikeCount = () => {
    // if (post.likes == null) {
    //   return 0;
    // }
    // let count = 0;
    // // if the key is explicitly set to true, add a like
    // post.likes.values.forEach((val) => {
    //   if (val == true) {
    //     count += 1;
    //   }
    // });

    return Object.values(post.likes).filter((v) => v).length;
  };

  const getVideoUri = async () => {
    if (post.videoUri.startsWith("http")) {
      setVideoUri(post.videoUri);
      return;
    }
    setVideoUri(await Storage.get(post.videoUri));
  };

  useEffect(() => {
    getVideoUri();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={
          props.currentReel.index === props.index
            ? onActivePlayPausePress
            : onPlayPausePress
        }
      >
        <View>
          <Video
            source={{ uri: videoUri }}
            style={styles.video}
            onError={(e) => console.log(e)}
            resizeMode={"cover"}
            repeat={true}
            shouldPlay={
              props.currentReel.index === props.index ? activePaused : paused
            }
            isLooping
            paused={paused}
          />

          <View style={styles.uiContainer}>
            <View style={styles.rightContainer}>
              {/* <Image
                style={styles.profilePicture}
                source={{ uri: post.user.imageUri }}
              /> */}

              <TouchableOpacity
                style={styles.iconContainer}
                onPress={onLikePress}
              >
                <AntDesign
                  name={"heart"}
                  size={24}
                  color={post.likes[currentUser.id] === true ? "red" : "white"}
                />
                <Text style={styles.statsLabel}>{getLikeCount()}</Text>
              </TouchableOpacity>

              <View style={styles.iconContainer}>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    props.setToggleScroll(false);
                    setShowComments(true);
                  }}
                >
                  <FontAwesome name={"commenting"} size={24} color="white" />
                  <Text style={styles.statsLabel}>{post.comments}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bottomContainer}>
              <View>
                {/* <Text style={styles.handle}>@{post.user.username}</Text> */}
                <Text style={styles.description}>{post.description}</Text>

                <View style={styles.songRow}>
                  <Entypo name={"beamed-note"} size={18} color="white" />
                  <Text style={styles.songName}>
                    {post.music || "Original Audio"}
                  </Text>
                </View>
              </View>

              {/* <Image
                style={styles.songImage}
                source={{ uri: post.song.imageUri }}
              /> */}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {showComments ? (
        <CommentModal
          postId={post.id}
          postOwnerId={post.user.user_id}
          setShowComments={setShowComments}
          setToggleScroll={props.setToggleScroll}
        />
      ) : null}
    </View>
  );
};

export default ReelPost;
