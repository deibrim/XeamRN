import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Video } from "expo-av";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import firebase from "../../firebase/firebase.utils";

import styles from "./styles";
import { postReel } from "../../firebase/firebase.utils";
import { Base64 } from "../../utils/DeEncoder";

const EditAndPostScreen = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [description, setDescription] = useState("");
  const [paused, setPaused] = useState(false);
  const [videoUri, setVideoUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const onPlayPausePress = () => {
    setPaused(!paused);
  };
  const route = useRoute();
  const navigation = useNavigation();

  const uploadToStorage = async (videoFile, id) => {
    const response = await fetch(videoFile);
    const blob = await response.blob();
    try {
      const storageRef = firebase.storage().ref(`reels/${id}`);
      const uploadTask = storageRef.put(blob);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progressPercentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("====================================");
          console.log(progressPercentage);
          console.log("====================================");
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
            return downloadURL;
          });
        }
      );
    } catch (e) {
      console.error(e);
    }
  };
  // const uploadToCloud = async (videoFile) => {
  //   // const response = await fetch(videoFile);
  //   // const blob = await response.blob();
  //   // CLOUDINARY_URL=cloudinary://433554881362772:fvf9f-ENB05fh0-I8gHtuOgvhks@xeam
  //   const cloudUri = Base64.encode(videoFile);
  //   console.log("====================================");
  //   console.log(cloudUri);
  //   console.log("====================================");
  //   const base64Video = `data:video/mp4;base64,${cloudUri}`;
  //   const data = new FormData();
  //   data.append("file", `${base64Video}`);
  //   data.append("upload_preset", "ess7hlyv");
  //   data.append("resource_type", "video");
  //   data.append("cloud_name", "xeam");
  //   fetch("https://api.cloudinary.com/v1_1/xeam/upload", {
  //     method: "POST",
  //     body: data,
  //   })
  //     .then(async (response) => {
  //       let recordingURL = await response.json();
  //       console.log("Cloudinary Info:", recordingURL);
  //       return recordingURL;
  //     })
  //     .catch((err) => console.log("cloudinary err", err));
  // };
  const onCancel = async () => {
    navigation.goBack();
  };
  const handlePublish = async () => {
    const id = uuidv4().split("-").join("");
    // uploadToCloud(route.params.videoUri);
    uploadToStorage(route.params.videoUri, id);
  };
  const onPublish = async (uri, id) => {
    try {
      const newPost = {
        id,
        videoUri: uri,
        description,
        user_id: user.id,
        likes: {},
        likes: 0,
        comments: 0,
        music: `${user.name} - Original Audio`,
        posted_at: Date.now(),
        user: {
          name: user.name,
          profile_pic: user.profile_pic,
        },
      };
      postReel(newPost);
      navigation.navigate("HomeScreen");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onPlayPausePress}>
          <View>
            <Video
              source={{ uri: route.params.videoUri }}
              style={styles.video}
              onError={(e) => console.log(e)}
              resizeMode={"cover"}
              repeat={true}
              shouldPlay={paused}
              isLooping
              paused={paused}
            />
            <View style={styles.uiContainer}>
              <View style={styles.topContainer}>
                <TouchableOpacity onPress={onCancel}>
                  <AntDesign name="close" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handlePublish}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Next</Text>
                    <MaterialIcons
                      name="navigate-next"
                      size={30}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomContainer}>
                <TextInput
                  value={description}
                  onChangeText={(e) => setDescription(e)}
                  numberOfLines={5}
                  placeholder={"Description"}
                  style={styles.textInput}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

export default EditAndPostScreen;
