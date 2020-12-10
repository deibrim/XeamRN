import {
  Ionicons,
  SimpleLineIcons,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";
import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  View,
  TouchableWithoutFeedback,
  Text,
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
import CommentModal from "../CommentModal/CommentModal";
import ReelPostMoreModal from "../ReelPostMoreModal/ReelPostMoreModal";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const ReelPost = (props) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [post, setPost] = useState(props.post);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [videoUri, setVideoUri] = useState("");

  const [paused, setPaused] = useState(false);
  const [activePaused, setActivePaused] = useState(true);
  const onSave = useCallback(() => {
    setSaved(true);
    wait(2000).then(() => setSaved(false));
  }, []);
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
  const onShowMore = () => {
    props.setToggleScroll(!props.toggleScroll);
    setShowMore(!showMore);
  };
  const getLikeCount = () => {
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
            {!activePaused ? (
              <View style={styles.centerContainer}>
                <View
                  style={{
                    borderRadius: 50,
                    height: 60,
                    width: 60,
                    backgroundColor: "#111111",
                    opacity: 0.7,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="ios-play"
                    size={40}
                    color="#ffffff"
                    style={{ marginLeft: 5 }}
                  />
                </View>
              </View>
            ) : null}
            {saved ? (
              <View style={{ ...styles.centerContainer, opacity: 0.7 }}>
                <Text style={{ fontSize: 18, color: "#ffffff" }}>Saved!</Text>
              </View>
            ) : null}
            {showMore ? (
              <View
                style={{
                  ...styles.centerContainer,
                  zIndex: 5,
                  opacity: 0.7,
                  backgroundColor: "#111111",
                }}
              >
                <ReelPostMoreModal
                  postOwnerId={post.user_id}
                  postData={post}
                  setShowMore={setShowMore}
                  onSave={onSave}
                />
              </View>
            ) : null}

            <View style={styles.rightContainer}>
              {/* <Image
                style={styles.profilePicture}
                source={{ uri: post.user.imageUri }}
              /> */}
              <View style={styles.rightContainerBg}>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={onLikePress}
                >
                  <AntDesign
                    name={"heart"}
                    size={20}
                    color={
                      post.likes[currentUser.id] === true ? "red" : "white"
                    }
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
                    <FontAwesome name={"commenting"} size={20} color="white" />
                    <Text style={styles.statsLabel}>{post.comments}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={onShowMore}
                >
                  <Ionicons name="ios-more" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bottomContainer}>
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      borderRadius: 15,
                      marginBottom: 10,
                      marginRight: 10,
                    }}
                    source={{
                      uri: post.user.profile_pic,
                    }}
                  />
                  <Text style={styles.handle}>{post.user.username} - </Text>
                  <Text style={styles.description}>{post.description}</Text>
                </View>

                <View style={styles.songRow}>
                  <SimpleLineIcons name="music-tone" size={16} color="white" />
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
