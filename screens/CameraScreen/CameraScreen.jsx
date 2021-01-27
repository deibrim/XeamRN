import {
  Ionicons,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
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
import { AssetsSelector } from "expo-images-picker";
import MediaLibraryModal from "../../components/MediaLibraryModal/MediaLibraryModal";
import { toggleShowBottomNavbar } from "../../redux/settings/actions";
import { useDispatch } from "react-redux";
import { LongPressGestureHandler } from "react-native-gesture-handler";

export default function CameraScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState("back");
  const [flashMode, setFlashMode] = useState("off");
  const [progressBarDirection] = useState("fromLeft");
  const [timer] = useState(new Animated.Value(0));
  const [isRecording, setIsRecording] = useState(false);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [deviceCameraRatio, setDeviceCameraRatio] = useState(["16:9"]);
  const route = useRoute();
  const dispatch = useDispatch();
  let camera;
  useEffect(() => {
    getPermissionAsync();
    // getMedias();
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
    getPermissionAsync();
    return <Text>No access to camera</Text>;
  }

  const onRecord = async () => {
    if (isRecording) {
      setIsRecording(false);
      camera.stopRecording();
    } else {
      setIsRecording(true);
      const data = await camera.recordAsync({
        maxDuration: 15,
        maxFileSize: 5000000,
        quality: Camera.Constants.VideoQuality["480p"],
      });
      setIsRecording(false);
      if (data) {
        setShowProgressBar(false);
        timer.stopAnimation(() => {});
        setIsRecording(false);
        navigation.navigate("EditAndPostScreen", {
          videoUri: data.uri,
          type: route.params.type,
        });
      }
    }
  };

  const animation = () => {
    return Animated.timing(timer, {
      toValue: 1,
      easing: Easing.ease,
      useNativeDriver: true,
      duration: 15000,
    }).start(({ finished }) => console.log(finished));
  };
  const renderProgressBar = () => {
    const { width } = Dimensions.get("window");

    let animation = { transform: [{ scaleX: timer }] };

    if (
      progressBarDirection === "fromLeft" ||
      progressBarDirection === "fromRight"
    ) {
      // Footer container as a width of 100% with paddingHorizontal of 7.5%
      let initialValue = width;

      if (progressBarDirection === "fromLeft") initialValue *= -1;

      const translateX = timer.interpolate({
        inputRange: [0, 1],
        outputRange: [initialValue, 0],
        extrapolate: "clamp",
      });

      animation.transform = [{ translateX }];
    }

    animation.backgroundColor = "#ffffff";

    return (
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, animation]} />
      </View>
    );
  };

  const onSwitchFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("on");
    }
  };
  const pickVideo = (uri) => {
    setIsPanelActive(false);
    navigation.navigate("EditAndPostScreen", {
      videoUri: uri,
      type: route.params.type,
    });
  };
  const getRatio = async () => {
    let ratio = await camera.getSupportedRatiosAsync(); //android only now
    setDeviceCameraRatio(ratio.pop());
  };
  return (
    <>
      <View style={{ position: "absolute", top: 30, left: 20, zIndex: 1 }}>
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
          onPress={() => {
            dispatch(toggleShowBottomNavbar(false));
            navigation.goBack();
          }}
        >
          <Ionicons name="md-arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={onSwitchFlashMode}
        style={{
          position: "absolute",
          left: 20,
          top: "20%",
          zIndex: 1,
          backgroundColor: "#006eff89",
          borderRadius: 50,
          height: 35,
          width: 35,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialIcons
          name={
            flashMode === "off"
              ? "flash-off"
              : flashMode === "on"
              ? "flash-on"
              : "flash-auto"
          }
          size={20}
          color="#ffffff89"
        />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          height: Dimensions.get("window").height,
          position: "relative",
        }}
      >
        <MediaLibraryModal
          isPanelActive={isPanelActive}
          setIsPanelActive={setIsPanelActive}
          type={route.params.type}
        />
        <Camera
          ref={(ref) => (camera = ref)}
          focusDepth={"on"}
          flashMode={flashMode}
          autoFocus={true}
          // useCamera2Api={true}
          ratio={deviceCameraRatio}
          onCameraReady={getRatio}
          style={{ flex: 1 }}
          type={type}
        >
          <View style={styles.otherControl}>
            {showProgressBar ? renderProgressBar() : null}
            <View style={styles.otherControlWrapper}>
              <TouchableOpacity
                style={styles.selectFromPhoneContainer}
                onPress={() => setIsPanelActive(true)}
              >
                <View style={styles.selectFromPhone}>
                  <Entypo name="folder-video" size={30} color="white" />
                </View>
              </TouchableOpacity>
              <View style={styles.recordControlBorder}>
                <LongPressGestureHandler
                  onHandlerStateChange={({ nativeEvent }) => {
                    if (nativeEvent.state === 4) {
                      setShowProgressBar(true);
                      animation();
                      onRecord();
                    } else if (nativeEvent.state === 5) {
                      setShowProgressBar(false);
                      timer.stopAnimation(() => {});
                      onRecord();
                    }
                  }}
                  minDurationMs={250}
                >
                  <View style={styles.recordControlWrapper}>
                    <View
                      style={
                        isRecording ? styles.buttonStop : styles.buttonRecord
                      }
                    ></View>
                  </View>
                </LongPressGestureHandler>
              </View>
              <TouchableOpacity
                style={styles.flipCamera}
                onPress={() => {
                  setType(type === "back" ? "front" : "back");
                }}
              >
                <MaterialCommunityIcons
                  name="axis-z-rotate-counterclockwise"
                  size={30}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    </>
  );
}
