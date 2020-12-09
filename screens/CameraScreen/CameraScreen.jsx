import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
// import Constants from "expo-constants";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import React, { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, Dimensions } from "react-native";

import styles from "./styles";

export default function CameraScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const camera = useRef();
  useEffect(() => {
    getPermissionAsync();
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
      const data = await camera.current.recordAsync({
        maxDuration: 300,
        // maxFileSize: 5000000,
        quality: Camera.Constants.VideoQuality["480p"],
      });
      navigation.navigate("EditAndPostScreen", { videoUri: data.uri });
    }
  };

  const pickVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        navigation.navigate("EditAndPostScreen", { videoUri: result.uri });
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <View
      style={{
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
      }}
    >
      <Camera
        ref={camera}
        ratio={"4:3"}
        style={{
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width,
        }}
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
            onPress={pickVideo}
          >
            <View style={styles.selectFromPhone}>
              <AntDesign name="plus" size={20} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flipCamera}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Ionicons name={"ios-reverse-camera"} size={40} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
