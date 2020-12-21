import {
  AntDesign,
  Ionicons,
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  View,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { useSelector, useDispatch } from "react-redux";
import firebase, { firestore } from "../../firebase/firebase.utils";
import TvGetStartedModal from "../../components/TvGetStartedModal/TvGetStartedModal";
import { styles } from "./styles";
import SetupTvInfo from "../../components/SetupTvInfo/SetupTvInfo";
import CustomPopUp from "../../components/CustomPopUp/CustomPopUp";
import { setCurrentUserTvProfile } from "../../redux/user/actions";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
const EditTvProfileScreen = () => {
  const user = useSelector((state) => state.user.currentUser);
  const tvProfile = useSelector((state) => state.user.currentUserTvProfile);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [tvUpdated, setTvUpdated] = useState(false);
  const [logo] = useState(tvProfile.logo);
  const [image, setImage] = useState(tvProfile.logo);
  const [tvHandle, setTvHandle] = useState(
    tvProfile.tvHandle.substring(0, tvProfile.tvHandle.length - 3)
  );
  const [description, setDescription] = useState(tvProfile.description);
  const [website, setWebsite] = useState(tvProfile.website || "");
  const [uploading, setUploading] = useState("");
  const [uploadingPercentage, setUploadingPercentage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [index, setIndex] = useState(0);
  let flatListRef;

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
      setImage(await result.uri);
      uploadLogoToStorage();
    }
  };

  const scrollToIndex = (index) => {
    if (index === 4) {
      return;
    }
    flatListRef.scrollEnabled = true;
    flatListRef.scrollToIndex({ animated: true, index: "" + index });
    setIndex(index);
    flatListRef.scrollEnabled = false;
  };
  const onTvUpdated = useCallback(() => {
    setTvUpdated(true);
    wait(2000).then(async () => {
      const userRef = firestore.doc(`xeamTvs/${user.id}`);
      const snapShot = await userRef.get();
      dispatch(setCurrentUserTvProfile({ ...snapShot.data() }));
      navigation.navigate("TvProfileScreen");
      setTvUpdated(false);
    });
  }, []);
  async function uploadLogoToStorage() {
    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = firebase.storage().ref(`tv/${user.id}/tv_logo`);
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
            setUploading("Uploading...");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          setImage(downloadURL);
          setUploading(" Finish uploading logo");
          setLoading(false);
          onTvUpdated();
        });
      }
    );
  }
  const onUpdateTv = async () => {
    setErrorMessage("");
    try {
      const tvData = {
        tvHandle: `${tvHandle.toLowerCase()}.tv`,
        description,
        logo: image,
        website: website.toLowerCase(),
        tvOwnerUsername: user.username,
      };

      firestore.collection("xeamTvs").doc(user.id).update(tvData);
      setLoading(false);
      onTvUpdated();
    } catch (e) {
      console.error(e);
    }
  };
  const checkTvHandleAndUpdateProfile = async () => {
    if (tvHandle.trim() === "") {
      setErrorMessage("Tv Handle is required");
      return;
    } else if (description.trim() === "") {
      setErrorMessage("Tv Description is required");
      return;
    } else if (image.trim() === "") {
      setErrorMessage("Tv Logo is required");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    const tvsRef = await firestore
      .collection("xeamTvs")
      .where("tvHandle", "==", `${tvHandle.toLowerCase()}.tv`);
    const snapshot = await tvsRef.get();

    if (!snapshot.empty) {
      const isExisted = snapshot.docs.filter((doc) => {
        return doc.data().id === tvProfile.id && doc.data();
      });
      if (isExisted.length === 0) {
        setErrorMessage("TvHandle already existed");
        setLoading(false);
        return;
      }
      onUpdateTv();
      return;
    }
    onUpdateTv();
  };

  const Procedure = [
    <SetupTvInfo
      value={tvHandle}
      onChangeText={setTvHandle}
      placeholder={"Tv handle"}
      content={{
        headline: "Tv handle",
        body: `@${tvHandle.toLowerCase()}.tv`,
        illustration: <Feather name="at-sign" size={50} color="#666666" />,
      }}
      isImage={false}
      index={0}
      setIndex={setIndex}
    />,
    <SetupTvInfo
      value={description}
      onChangeText={setDescription}
      placeholder={"Description"}
      content={{
        headline: "Tv Description",
        body: `Give a brief summary of the type of content your viewers should be expecting`,
        illustration: (
          <MaterialIcons name="speaker-notes" size={50} color="#666666" />
        ),
      }}
      isImage={false}
      index={1}
      setIndex={setIndex}
    />,
    <SetupTvInfo
      value={website}
      onChangeText={setWebsite}
      placeholder={"Url"}
      content={{
        headline: "Website",
        body: `https://${website.toLowerCase()}`,
        illustration: (
          <MaterialCommunityIcons name="web" size={50} color="#666666" />
        ),
      }}
      isImage={false}
      index={2}
      setIndex={setIndex}
    />,
    <SetupTvInfo
      value={image}
      onPress={pickImage}
      placeholder={"Url"}
      content={{
        headline: "Tv Logo",
        body: `You can explain so much with a descriptive logo`,
      }}
      isImage={true}
      index={3}
      setIndex={setIndex}
    />,
  ];

  return tvUpdated ? (
    <View
      style={{
        minHeight: 200,
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ecf2fa",
      }}
    >
      <AntDesign
        name="checkcircleo"
        size={50}
        color="green"
        style={{ marginBottom: 30 }}
      />
      <Text style={{ color: "#111111", fontSize: 18, marginBottom: 20 }}>
        Getting Your Profile Ready!
      </Text>
      <Image
        style={{ width: 35, height: 35 }}
        source={require("../../assets/loader.gif")}
      />
    </View>
  ) : (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!loading && (
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: 20,
                elevation: 2,
                backgroundColor: "#ff4747",
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <AntDesign name="close" size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={{ ...styles.title, fontSize: 14 }}>Update Tv Profile</Text>
      </View>
      <View
        style={{
          height: "100%",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
          {uploading.trim() !== "" ? (
            <CustomPopUp
              message={`${uploadingPercentage}%`}
              type={"warning"}
              customStyles={{
                backgroundColor: "yellow",
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
              customTextStyles={{ color: "#ffffff", textAlign: "center" }}
            />
          ) : null}
        </View>
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
              opacity: 0.6,
              zIndex: 1,
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 18, marginBottom: 20 }}>
              Updating Profile...
            </Text>
            <Image
              style={{ marginLeft: 5, width: 40, height: 40 }}
              source={require("../../assets/loader.gif")}
            />
          </View>
        )}
        <FlatList
          contentContainerStyle={{}}
          ref={(ref) => {
            flatListRef = ref;
          }}
          scrollEnabled={false}
          snapToInterval={Dimensions.get("screen").width}
          snapToAlignment={"start"}
          decelerationRate={"fast"}
          showsHorizontalScrollIndicator={true}
          horizontal
          data={Procedure}
          initialScrollIndex={0}
          initialNumToRender={3}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => item.item}
        />
      </View>

      <View style={{ ...styles.buttonContainer, left: 10 }}>
        {index ? (
          <TouchableOpacity
            onPress={() => {
              if (index == 0) {
                scrollToIndex(0);
              } else if (index == 1) {
                scrollToIndex(0);
              } else if (index == 2) {
                scrollToIndex(1);
              } else if (index == 3) {
                scrollToIndex(2);
              }
            }}
          >
            <View style={styles.button}>
              <Ionicons name="ios-arrow-back" size={20} color="black" />
              <Text
                style={{ ...styles.buttonText, marginLeft: 5, marginRight: 0 }}
              >
                Prev
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            if (index == 0) {
              scrollToIndex(1);
            } else if (index == 1) {
              scrollToIndex(2);
            } else if (index == 2) {
              scrollToIndex(3);
            } else {
              uploading
                ? setErrorMessage(`Can't update while uploading logo`)
                : checkTvHandleAndUpdateProfile();
            }
          }}
        >
          <View
            style={
              index >= 3
                ? { ...styles.button, width: 100, backgroundColor: "#006eff" }
                : { ...styles.button }
            }
          >
            <Text
              style={
                index >= 3
                  ? { ...styles.buttonText, color: "#ffffff" }
                  : { ...styles.buttonText }
              }
            >
              {index >= 3 ? "Update Tv" : "Next"}
            </Text>
            {index < 3 && (
              <Ionicons name="ios-arrow-forward" size={20} color="black" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default EditTvProfileScreen;
