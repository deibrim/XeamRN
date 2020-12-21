import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
// import { Video } from "expo-av";
// import CameraRoll from "@react-native-community/cameraroll";
import * as MediaLibrary from "expo-media-library";
// import { MediaLibrary, Permissions } from "expo";
import styles from "./styles";
import MediaLibraryModal from "../../components/MediaLibraryModal/MediaLibraryModal";

export default function CameraScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [album, setAlbum] = useState(null);
  const [type, setType] = useState("back");
  const [isRecording, setIsRecording] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceCameraRatio, setDeviceCameraRatio] = useState(["16:9"]);
  let camera;
  useEffect(() => {
    getPermissionAsync();
    getMedias();
  }, []);
  async function getPermissionAsync() {
    const cam = await Permissions.askAsync(Permissions.CAMERA);
    const roll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (
      roll.status === "granted" &&
      cam.status === "granted" &&
      audio.status == "granted"
    ) {
      setHasPermission(true);
    }
  }
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    getPermission();
    return <Text>No access to camera</Text>;
  }

  const onRecord = async () => {
    if (isRecording) {
      setIsRecording(false);
      camera.current.stopRecording();
    } else {
      setIsRecording(true);
      const data = await camera.recordAsync({
        maxDuration: 300,
        maxFileSize: 5000000,
        quality: Camera.Constants.VideoQuality["480p"],
      });
      navigation.navigate("EditAndPostScreen", { videoUri: data.uri });
    }
  };

  async function getMedias() {
    // let photos = CameraRoll.getAlbums({ assetType: "All" });
    const album = await MediaLibrary.getAssetsAsync({
      first: 12,
      mediaType: "video",
    });
    const filteredAlbum = album.assets.filter((item) => item.duration < 1500);
    setAlbum(filteredAlbum);
  }
  const pickVideo = (uri) => {
    setModalVisible(false);
    navigation.navigate("EditAndPostScreen", { videoUri: uri });
  };
  const getRatio = async () => {
    let ratio = await camera.getSupportedRatiosAsync(); //android only now
    setDeviceCameraRatio(ratio.pop());
  };
  return (
    <>
      <View
        style={{
          flex: 1,
          height: Dimensions.get("window").height,
          position: "relative",
        }}
      >
        {album && modalVisible && (
          <MediaLibraryModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            album={album}
            pickVideo={pickVideo}
          />
        )}
        <Camera
          ref={(ref) => (camera = ref)}
          focusDepth={"on"}
          autoFocus={true}
          // useCamera2Api={true}
          ratio={deviceCameraRatio}
          onCameraReady={getRatio}
          style={{ flex: 1 }}
          type={type}
        >
          <View style={styles.recordControl}>
            <View style={styles.recordControlBorder}>
              <TouchableOpacity
                onPress={onRecord}
                style={isRecording ? styles.buttonStop : styles.buttonRecord}
              />
            </View>
          </View>
          <View style={styles.otherControl}>
            <TouchableOpacity
              style={styles.selectFromPhoneContainer}
              onPress={() => setModalVisible(true)}
            >
              <View style={styles.selectFromPhone}>
                {/* <AntDesign name="plus" size={20} color="white" /> */}
                {album && (
                  <Image
                    source={{ uri: album[0].uri }}
                    resizeMode={"cover"}
                    style={{ width: 20, height: 20, margin: 2 }}
                  />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.flipCamera}
              onPress={() => {
                setType(type === "back" ? "front" : "back");
              }}
            >
              <Ionicons name={"ios-reverse-camera"} size={40} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
        {/* {album ? (
          <View style={styles.assets}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {album.assets.map((item, index) => (
                <Video
                  key={index}
                  source={{ uri: item.uri }}
                  style={{ width: 80, height: 80, margin: 2 }}
                  onError={(e) => console.log(e)}
                  resizeMode={"cover"}
                  shouldPlay={false}
                />
              ))}
            </ScrollView>
          </View>
        ) : null} */}
      </View>
    </>
  );
}
{
  /*<Image
                  key={index}
                  source={{ uri: item.uri }}
                  resizeMode={"cover"}
                  style={{ width: 80, height: 80, margin: 2 }}
                /> */
}
