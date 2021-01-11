import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import firebase from "../../firebase/firebase.utils";

import styles from "./styles";
import { postReel } from "../../firebase/firebase.utils";
import { postTvReel } from "../../firebase/tvFunctions";
import { postStoreReel } from "../../firebase/storeFunctions";
// import { Base64 } from "../../utils/DeEncoder";

const PostReelScreen = () => {
  const user = useSelector((state) => state.user.currentUser);
  const tvProfile = useSelector((state) => state.user.currentUserTvProfile);
  const xStore = useSelector((state) => state.user.currentUserXStore);
  const [description, setDescription] = useState("");
  const [videoUri, setVideoUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingPercentage, setUploadingPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const id = uuidv4().split("-").join("");
    // uploadToCloud(route.params.videoUri);\
    uploadToStorage(route.params.videoUri, id);
  };
  const onPublish = async (uri, id) => {
    let hashtags = description.split(" ").filter(function (n) {
      if (/#/.test(n)) return n;
    });
    let usertags = description.split(" ").filter(function (n) {
      if (/@/.test(n)) return n;
    });
    try {
      const newPost = {
        id,
        videoUri: uri,
        description,
        likes: {},
        views: {},
        comments: 0,
        posted_at: Date.now(),
      };

      newPost["tags"] = hashtags;
      newPost["descriptionUserTags"] = usertags;

      if (route.params.type === "feedReel") {
        newPost["user_id"] = user.id;
        newPost["user"] = {
          username: user.username,
          profile_pic: user.profile_pic,
        };
        (newPost["music"] = `${user.username} - Original Audio`),
          postReel(newPost);
      }
      if (route.params.type === "tvReel") {
        newPost["tvId"] = user.id;
        newPost["user"] = {
          username: tvProfile.tvHandle,
          profile_pic: tvProfile.logo,
        };
        (newPost["music"] = `${tvProfile.tvHandle} - Original Audio`),
          postTvReel(newPost);
      }
      if (route.params.type === "review") {
        newPost["storeId"] = user.id;
        newPost["user"] = {
          username: xStore.storeHandle,
          profile_pic: xStore.logo,
        };
        (newPost["music"] = `${xStore.storeHandle} - Original Audio`),
          postStoreReel(newPost);
      }
      setLoading(false);
      navigation.navigate("HomeScreen");
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.uiContainer}>
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
              <MaterialIcons name="navigate-before" size={30} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePublish}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Post</Text>
                <Ionicons name="ios-arrow-forward" size={20} color="black" />
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
      </ScrollView>
      {loading && (
        <View
          style={{
            position: "absolute",
            minHeight: 200,
            width: "100%",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
            opacity: 0.9,
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 18, marginBottom: 20 }}>
            {uploadingPercentage}%
          </Text>
          <Image
            style={{ marginLeft: 5, width: 40, height: 40 }}
            source={require("../../assets/loader.gif")}
          />
        </View>
      )}
    </>
  );
};

export default PostReelScreen;
