import {
  AntDesign,
  Ionicons,
  Feather,
  Entypo,
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
  TouchableWithoutFeedback,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { useSelector, useDispatch } from "react-redux";
import firebase, { firestore } from "../../firebase/firebase.utils";
import StoreGetStartedModel from "../../components/StoreGetStartedModel/StoreGetStartedModel";
import SetupTvInfo from "../../components/SetupTvInfo/SetupTvInfo";
import CustomPopUp from "../../components/CustomPopUp/CustomPopUp";
import { setCurrentUserXStore } from "../../redux/user/actions";
import { styles } from "./styles";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const EditXStoreScreen = () => {
  const xStore = useSelector((state) => state.user.currentUserXStore);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [storeCreated, setStoreCreated] = useState(false);
  const [image, setImage] = useState(xStore.logo);
  const [storeHandle, setStoreHandle] = useState(
    xStore.storeHandle.substring(0, xStore.storeHandle.length - 6)
  );
  const [location, setLocation] = useState(xStore.location || "");
  const [website, setWebsite] = useState(xStore.website || "");
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
    getLocationAsync();
  }, []);
  async function getLocationAsync() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMessage("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const address = await Location.reverseGeocodeAsync(location.coords);
    const addressObj = address[0];
    setLocation(`${addressObj.city}, ${addressObj.country}`);
    addressObj.country.toLowerCase() === "nigeria"
      ? setLocation(
          `${addressObj.city}, ${addressObj.region} State, ${addressObj.country}`
        )
      : setLocation(`${addressObj.city}, ${addressObj.country}`);
  }

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
  const onStoreUpdated = useCallback(() => {
    setStoreCreated(true);
    wait(2000).then(async () => {
      const userRef = firestore.doc(`xeamStores/${xStore.id}`);
      const snapShot = await userRef.get();
      dispatch(setCurrentUserXStore({ ...snapShot.data() }));
      const resetAction = navigation.reset({
        index: 0,
        actions: [navigation.navigate("XStoreScreen")],
      });
      navigation.dispatch(resetAction);
      setStoreCreated(false);
    });
  }, []);
  const uploadLogoToStorage = async () => {
    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = firebase
      .storage()
      .ref(`xeamStores/${xStore.id}/store_logo`);
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
          setImage(image);
          setUploading("");
          setLoading(false);
        });
      }
    );
  };
  const onUpdateteStore = async () => {
    try {
      const storeData = {
        storeHandle: `${storeHandle.toLowerCase()}.store`,
        location,
        logo: image,
        website: website.toLowerCase(),
        storeOwnerName: "Sarah Idris",
        storeOwnerUsername: "sarah",
      };

      firestore.collection("xeamStores").doc(xStore.id).update(storeData);
      setLoading(false);
      onStoreUpdated();
    } catch (e) {
      console.error(e);
    }
  };
  const checkStoreHandleAndCreateStore = async () => {
    if (storeHandle.trim() === "") {
      setErrorMessage("Store name is required");
      return;
    } else if (location.trim() === "") {
      setErrorMessage("Location is required");
      return;
    } else if (image.trim() === "") {
      setErrorMessage("Store Logo is required");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    const storesRef = await firestore
      .collection("xeamStores")
      .where("storeHandle", "==", `${storeHandle.toLowerCase()}`);
    const snapshot = await storesRef.get();

    if (!snapshot.empty) {
      const isExisted = snapshot.docs.filter((doc) => {
        return doc.data().id === xStore.id && doc.data();
      });
      if (isExisted.length === 0) {
        setErrorMessage("Store already existed");
        setLoading(false);
        return;
      }
      onUpdateteStore();
      return;
    }
    onUpdateteStore();
  };

  const Procedure = [
    <SetupTvInfo
      value={storeHandle}
      onChangeText={setStoreHandle}
      placeholder={"Store Name"}
      content={{
        headline: "Store name",
        body: `@${storeHandle.toLowerCase()}.store`,
        illustration: <Feather name="at-sign" size={50} color="#666666" />,
      }}
      isImage={false}
      index={0}
      setIndex={setIndex}
    />,
    <SetupTvInfo
      value={location}
      onChangeText={setLocation}
      placeholder={"Location"}
      content={{
        headline: "Location",
        body: ``,
        illustration: <Entypo name="location-pin" size={50} color="#666666" />,
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
        headline: "Store Logo",
        body: `You can explain so much with a descriptive logo`,
      }}
      isImage={true}
      index={3}
      setIndex={setIndex}
    />,
  ];

  return storeCreated ? (
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
        Getting Your Store Ready!
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
        </View>
        <Text style={{ ...styles.title, fontSize: 14 }}>Update XStore</Text>
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
              zIndex: 999999999999999999,
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 18, marginBottom: 20 }}>
              {uploading}
            </Text>
            <Text style={{ color: "#ffffff", fontSize: 18, marginBottom: 20 }}>
              {uploadingPercentage}%
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
          <TouchableWithoutFeedback
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
          </TouchableWithoutFeedback>
        ) : null}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableWithoutFeedback
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
                : checkStoreHandleAndCreateStore();
            }
          }}
        >
          <View
            style={
              index >= 3
                ? { ...styles.button, width: 120, backgroundColor: "#006eff" }
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
              {index >= 3 ? "Update Store" : "Next"}
            </Text>
            {index < 3 && (
              <Ionicons name="ios-arrow-forward" size={20} color="black" />
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

export default EditXStoreScreen;
