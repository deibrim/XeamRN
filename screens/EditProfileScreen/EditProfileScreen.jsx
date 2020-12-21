import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  TextInput,
  ScrollView,
  Image,
  View,
  Text,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ProgressBarAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import firebase, {
  firestore,
  updateProfileData,
} from "../../firebase/firebase.utils";
import { styles } from "./styles";
import EditProfileInputGroup from "../../components/EditProfileInputGroup/EditProfileInputGroup";
import CustomPopUp from "../../components/CustomPopUp/CustomPopUp";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
const EditProfileScreen = () => {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();

  const [image, setImage] = useState(user.profile_pic);
  const [profilePic, setProfilePic] = useState(user.profile_pic);
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username || "");
  const [location, setLocation] = useState(user.location || "");
  const [bio, setBio] = useState(user.bio || "");
  const [website, setWebsite] = useState(user.website || "");
  const [headline, setHeadline] = useState(user.headline || "");
  const [selectedGender, setSelectedGender] = useState(user.gender || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPercentage, setUploadingPercentage] = useState(0);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      const response = await fetch(result.uri);
      const blob = await response.blob();
      setImage(result.uri);
      const storageRef = firebase.storage().ref(`users/${user.id}/profile-pic`);
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
            setProfilePic(downloadURL);
            setUploading("");
          });
        }
      );
    }
  };
  const handleSave = async () => {
    setLoading(true);
    const incomingData = {
      username: username.toLowerCase(),
      name,
      profile_pic: profilePic,
      location,
      website,
      bio,
      headline,
      gender: selectedGender,
    };

    const success = await updateProfileData(user.id, incomingData);
    setLoading(false);
    success && navigation.navigate("ProfileScreen");
  };
  const checkUsernameAndUpdateAccount = async () => {
    const usersRef = await firestore
      .collection("users")
      .where("username", "==", `${username.toLowerCase()}`);
    const snapshot = await usersRef.get();
    if (!snapshot.empty) {
      const isExisted = snapshot.docs.filter((doc) => {
        return doc.data().id === user.id && doc.data();
      });
      if (isExisted.length === 0) {
        setErrorMessage("Username already existed");
        setLoading(false);
        wait(5000).then(async () => {
          setErrorMessage("");
        });
        return;
      }
      handleSave();
    }
    handleSave();
  };
  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <AntDesign name="close" size={20} color="black" />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={checkUsernameAndUpdateAccount}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={uploadingPercentage}
      />
      <ScrollView
        //  contentContainerStyle={{ width: "100%", alignItems: "center" }}
        style={styles.container}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={{ uri: image }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 100,
              borderColor: "#006eff",
              borderWidth: 2,
            }}
          />
          <TouchableOpacity onPress={pickImage}>
            <Text style={{ color: "#006eff", fontSize: 16, marginTop: 10 }}>
              Upload Image
            </Text>
          </TouchableOpacity>
        </View>
        <EditProfileInputGroup
          label={"Full name"}
          handleChange={setName}
          value={name}
        />
        <EditProfileInputGroup
          label={"Username"}
          handleChange={setUsername}
          value={username}
        />
        <EditProfileInputGroup
          label={"Location"}
          handleChange={setLocation}
          value={location}
        />
        <EditProfileInputGroup
          label={"Bio"}
          handleChange={setBio}
          value={bio}
        />
        <EditProfileInputGroup
          label={"Website"}
          handleChange={setWebsite}
          value={website}
        />
        <EditProfileInputGroup
          label={"Headline"}
          handleChange={setHeadline}
          value={headline}
        />
        <View
          style={{
            position: "absolute",
            bottom: 60,
            width: "100%",
            alignItems: "center",
          }}
        >
          {errorMessage.trim() !== "" ? (
            <CustomPopUp
              message={`${errorMessage}`}
              type={"error"}
              customStyles={{
                backgroundColor: "red",
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
              customTextStyles={{ color: "#ffffff", textAlign: "center" }}
            />
          ) : null}
        </View>
      </ScrollView>
    </>
  );
};

export default EditProfileScreen;
