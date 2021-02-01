import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from "react-native";
import { Video } from "expo-av";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import firebase, {
  postUserStory,
  set24HoursTimer,
} from "../../firebase/firebase.utils";
// import { Base64 } from "../../utils/DeEncoder";
import styles from "./styles";

const EditAndPostScreen = () => {
  const user = useSelector((state) => state.user.currentUser);
  const tvProfile = useSelector((state) => state.user.currentUserTvProfile);
  const xStore = useSelector((state) => state.user.currentUserXStore);
  const [description, setDescription] = useState("");
  const [videoUri, setVideoUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadingPercentage, setUploadingPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [resizeMode, setResizeMode] = useState("cover");
  const [postingTo, setPostingTo] = useState("personal");
  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    Permissions.askAsync(Permissions.CAMERA_ROLL);
  }, []);
  const onPlayPausePress = () => {
    setPaused(!paused);
  };

  const onCancel = async () => {
    if (route.params.asset) {
      await MediaLibrary.deleteAssetsAsync(route.params.asset);
    }
    navigation.goBack();
  };
  const _videoRef = (ref) => {};
  const uploadToStorage = async (file, id) => {
    const response = await fetch(file);
    const blob = await response.blob();
    try {
      const storageRef = firebase.storage().ref(`stories/${user.id}/${id}`);
      const uploadTask = storageRef.put(blob);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progressPercentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadingPercentage(Math.floor(progressPercentage));
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              setUploading("paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              setUploading("uploading");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            setVideoUri(downloadURL);
            setUploading("");
            if (route.params.asset) {
              await MediaLibrary.deleteAssetsAsync(route.params.asset);
            }
            onPublish(downloadURL, id);
          });
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    const id = uuidv4().split("-").join("");
    if (route.params.mediaType === "video") {
      uploadToStorage(route.params.videoUri, id);
    } else {
      uploadToStorage(route.params.photoUri, id);
    }
  };
  async function onPublish(uri, id) {
    const calcDuration = duration / 1000;
    try {
      const mediaType = route.params.mediaType;
      const newPost = {
        id,
        uri,
        type: mediaType,
        isSeen: false,
        duration: mediaType === "video" ? calcDuration : 5,
        externalLink: "",
        views: {},
        postedAt: Date.now(),
        resizeMode,
      };
      if (mediaType === "video") {
        newPost["isPaused"] = true;
      }
      if (postingTo === "personal") {
        const pdata = {
          userId: user.id,
          username: user.username,
          profile_pic: user.profile_pic,
          stories: [newPost],
          updatedAt: Date.now(),
        };
        postUserStory(pdata, newPost, "personal");
      }
      if (postingTo === "tv") {
        const pdata = {
          userId: user.id,
          username: tvProfile.tvHandle,
          profile_pic: tvProfile.logo,
          stories: [newPost],
          updatedAt: Date.now(),
        };
        postTvStory(pdata, newPost, "tv");
      }
      setLoading(false);
      navigation.navigate("HomeScreen");
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={route.params.mediaType === "video" && onPlayPausePress}
        >
          <View>
            {route.params.mediaType === "video" ? (
              <Video
                source={{ uri: route.params.videoUri }}
                style={styles.video}
                ref={_videoRef}
                onError={(e) => console.log(e)}
                resizeMode={resizeMode}
                onLoad={({ durationMillis }) => setDuration(durationMillis)}
                repeat={true}
                shouldPlay={paused}
                isLooping
                paused={paused}
              />
            ) : (
              <Image
                source={{ uri: route.params.photoUri }}
                style={[
                  styles.image,
                  {
                    height: Dimensions.get("screen").height,
                    width: Dimensions.get("screen").width,
                  },
                ]}
                resizeMode={resizeMode}
              />
            )}
            <View style={styles.uiContainer}>
              <TouchableOpacity
                onPress={() =>
                  setResizeMode(resizeMode === "cover" ? "contain" : "cover")
                }
                style={styles.resizer}
              >
                <Entypo
                  name={
                    resizeMode === "contain"
                      ? "resize-full-screen"
                      : "resize-100-"
                  }
                  size={22}
                  color="#ffffff"
                />
              </TouchableOpacity>
              <View style={styles.topContainer}>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 35,
                    height: 35,
                    borderRadius: 20,
                    elevation: 2,
                    backgroundColor: "#ffffff",
                  }}
                  onPress={onCancel}
                >
                  <AntDesign name="close" size={20} color="#111111" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (route.params.type === "story" && !loading) {
                      handlePublish();
                      return;
                    }
                    if (!loading) {
                      setPaused(false);
                      navigation.navigate("PostReelScreen", {
                        videoUri: route.params.videoUri,
                        type: route.params.type,
                        resizeMode,
                      });
                    }
                  }}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>
                      {route.params.type === "story" ? "Post" : "Next"}
                    </Text>
                    <Ionicons
                      name="ios-arrow-forward"
                      size={18}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {route.params.mediaType === "video" ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {!paused && (
                    <Ionicons name="ios-play" size={100} color="#444444" />
                  )}
                </View>
              ) : null}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

export default EditAndPostScreen;
