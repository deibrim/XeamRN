import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Video } from "expo-av";
import { useSelector } from "react-redux";
import { postUserStory } from "../../firebase/firebase.utils";
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
  const [resizeMode, setResizeMode] = useState("cover");
  const [postingTo, setPostingTo] = useState("");

  const onPlayPausePress = () => {
    setPaused(!paused);
  };
  const route = useRoute();
  const navigation = useNavigation();

  const onCancel = async () => {
    navigation.goBack();
  };

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
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            setVideoUri(downloadURL);
            setUploading("");
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
    uploadToStorage(route.params.videoUri, id);
  };
  async function onPublish(uri, id) {
    try {
      const newPost = {
        id,
        uri,
        type: route.params.mediaType,
        isSeen: false,
        duration: route.params.mediaType === "image" ? 5 : 15,
        externalLink: "",
        views: {},
        postedAt: Date.now(),
      };
      if (postingTo === "personal") {
        const pdata = {
          userId: user.id,
          username: user.username,
          profile_pic: user.profile_pic,
          stories: [newPost],
          updatedAt: Date.now(),
        };
        postUserStory(pdata);
      }
      if (postingTo === "tv") {
        const pdata = {
          userId: user.id,
          username: tvProfile.tvHandle,
          profile_pic: tvProfile.logo,
          stories: [newPost],
          updatedAt: Date.now(),
        };
        postTvStory(pdata);
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
        <TouchableWithoutFeedback onPress={onPlayPausePress}>
          <View>
            <Video
              source={{ uri: route.params.videoUri }}
              style={styles.video}
              onError={(e) => console.log(e)}
              resizeMode={resizeMode}
              repeat={true}
              shouldPlay={paused}
              isLooping
              paused={paused}
            />
            <View style={styles.uiContainer}>
              <TouchableOpacity
                onPress={() =>
                  setResizeMode(resizeMode === "cover" ? "contain" : "cover")
                }
                style={{
                  position: "absolute",
                  right: 15,
                  bottom: "10%",
                  zIndex: 2,
                  backgroundColor: "#006eff89",
                  elevation: 2,
                  borderRadius: 50,
                  height: 40,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
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
                    setPaused(false);
                    navigation.navigate("PostReelScreen", {
                      videoUri: route.params.videoUri,
                      type: route.params.type,
                      resizeMode,
                    });
                  }}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Next</Text>
                    <Ionicons
                      name="ios-arrow-forward"
                      size={18}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
              </View>
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
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

export default EditAndPostScreen;
