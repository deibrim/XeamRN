import React, { useEffect, useState } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import { Video } from "expo-av";
import styles from "./styles";

import { Entypo, AntDesign, FontAwesome, Fontisto } from "@expo/vector-icons";

const ReelPost = (props) => {
  const [post, setPost] = useState(props.post);
  const [isLiked, setIsLiked] = useState(false);
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
    const likesToAdd = isLiked ? -1 : 1;
    setPost({
      ...post,
      likes: post.likes + likesToAdd,
    });
    setIsLiked(!isLiked);
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
                  color={isLiked ? "red" : "white"}
                />
                <Text style={styles.statsLabel}>{post.likes}</Text>
              </TouchableOpacity>

              <View style={styles.iconContainer}>
                <FontAwesome name={"commenting"} size={24} color="white" />
                <Text style={styles.statsLabel}>{post.comments}</Text>
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
    </View>
  );
};

export default ReelPost;
