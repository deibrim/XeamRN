import {
  Ionicons,
  SimpleLineIcons,
  AntDesign,
  FontAwesome,
  MaterialIcons,
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
import AfterReporting from "../AfterReporting/AfterReporting";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const ReelPost = (props) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [post] = useState(props.post);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoUri, setVideoUri] = useState("");
  const [reported, setReported] = useState(false);
  const [paused, setPaused] = useState(false);
  const [shouldContinuePlaying, setShouldContinuePlaying] = useState(false);
  const [activePaused, setActivePaused] = useState(true);

  const onSave = useCallback(() => {
    setSaved(true);
    wait(2000).then(() => setSaved(false));
  }, []);
  const onView = useCallback(() => {
    const viewCount = getViewCount();
    wait(2000).then(() => {
      const isViewed = post.views[currentUser.id] === true;
      const currentUserId = currentUser.id;
      if (isViewed) {
        return;
      } else if (!isViewed) {
        post.views[currentUserId] = true;
        let views = post.views;
        firestore
          .collection("reels")
          .doc(post.user_id)
          .collection("userReels")
          .doc(post.id)
          .update({ viewCount, views });
      }
    });
  }, []);
  const onPlayPausePress = () => {
    setPaused(!paused);
  };
  const onActivePlayPausePress = () => {
    setActivePaused(!activePaused);
  };

  const onLikePress = () => {
    const likeCount = getLikeCount();
    const isLiked = post.likes[currentUser.id] === true;
    const currentUserId = currentUser.id;
    // const Likes = { ...post.likes };
    if (isLiked) {
      post.likes[currentUserId] = false;
      let likes = post.likes;
      firestore
        .collection("reels")
        .doc(post.user_id)
        .collection("userReels")
        .doc(post.id)
        .update({ likeCount: likeCount - 1, likes });
      removeLikeFromActivityFeed(
        currentUser,
        post.user_id,
        post.id,
        currentUser.id != post.user_id
      );
      setIsLiked(!isLiked);
    } else if (!isLiked) {
      post.likes[currentUserId] = true;
      let likes = post.likes;
      firestore
        .collection("reels")
        .doc(post.user_id)
        .collection("userReels")
        .doc(post.id)
        .update({ likeCount: likeCount + 1, likes });
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
    if (activePaused) {
      setActivePaused(false);
    }
    props.setToggleScroll(!props.toggleScroll);
    setShowMore(!showMore);
  };
  function getLikeCount() {
    return Object.values(post.likes).filter((v) => v).length;
  }
  function getViewCount() {
    return Object.values(post.views).filter((v) => v).length;
  }

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
  const onDisplayVideo = () => {
    if (props.currentReel.index === props.index || shouldContinuePlaying) {
      return (
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
          onLoadStart={() => setVideoLoading(true)}
          onLoad={() => {
            setVideoLoading(false);
            setShouldContinuePlaying(true);
            onView();
          }}
        />
      );
    }
  };
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
          {onDisplayVideo()}

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
            {videoLoading && activePaused && (
              <View
                style={{
                  ...styles.centerContainer,
                  zIndex: 5,
                  // opacity: 0.7,
                  // backgroundColor: "#111111",
                }}
              >
                <Image
                  style={{ marginLeft: 5, width: 40, height: 40 }}
                  source={require("../../assets/loader.gif")}
                />
              </View>
            )}
            {saved ? (
              <View style={{ ...styles.centerContainer, opacity: 0.7 }}>
                <Text style={{ fontSize: 18, color: "#ffffff" }}>Saved!</Text>
              </View>
            ) : null}
            {reported ? (
              <View
                style={{
                  ...styles.centerContainer,
                  backgroundColor: "#ffffff",
                  zIndex: 15,
                  paddingHorizontal: "20%",
                }}
              >
                <AfterReporting setReported={setReported} customText={"post"} />
              </View>
            ) : null}
            {showMore ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  setShowMore(false);
                }}
              >
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
                    reported={reported}
                    setReported={setReported}
                  />
                </View>
              </TouchableWithoutFeedback>
            ) : null}

            <View style={styles.rightContainer}>
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
                  {post.user_id === currentUser.id && (
                    <Text style={styles.statsLabel}>
                      {post.user_id === currentUser.id && getLikeCount()}
                    </Text>
                  )}
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
                  <Text
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                      marginBottom: 10,
                      marginRight: 10,
                    }}
                  >
                    <Text style={styles.handle}>{post.user.username} - </Text>
                    <Text style={styles.description}>{post.description}</Text>
                  </Text>
                </View>

                <View style={styles.songRow}>
                  <SimpleLineIcons name="music-tone" size={16} color="white" />
                  <Text style={styles.songName}>
                    {post.music || "Original Audio"}
                  </Text>
                  <View
                    style={{
                      marginLeft: "auto",
                      flexDirection: "row",
                      alignItems: "center",
                      opacity: 0.7,
                    }}
                  >
                    <MaterialIcons
                      name="visibility"
                      size={18}
                      color="#f8f8f8"
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "500",
                        color: "#f8f8f8",
                        marginLeft: 2,
                      }}
                    >
                      {getViewCount()}
                    </Text>
                  </View>
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
          postOwnerId={post.user_id}
          setShowComments={setShowComments}
          setToggleScroll={props.setToggleScroll}
        />
      ) : null}
    </View>
  );
};

export default ReelPost;
