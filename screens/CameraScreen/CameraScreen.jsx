import {
  Ionicons,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
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
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from "react-native";
import styles from "./styles";
import MediaLibraryModal from "../../components/MediaLibraryModal/MediaLibraryModal";
import { toggleShowBottomNavbar } from "../../redux/settings/actions";
import { useDispatch, useSelector } from "react-redux";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import TextStoryContainer from "../../components/TextStoryContainer/TextStoryContainer";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default function CameraScreen() {
  const user = useSelector((state) => state.user.currentUser);
  const tvProfile = useSelector((state) => state.user.currentUserTvProfile);
  const xStore = useSelector((state) => state.user.currentUserXStore);
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState("back");
  const [flashMode, setFlashMode] = useState("off");
  const [progressBarDirection] = useState("fromLeft");
  const [timer] = useState(new Animated.Value(0));
  const [isRecording, setIsRecording] = useState(false);
  const [labelHidden, hideLabel] = useState(false);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [deviceCameraRatio, setDeviceCameraRatio] = useState(["16:9"]);
  const [storyType, setStoryType] = useState("video");
  const [postingTo, setPostingTo] = useState("personal");
  const route = useRoute();
  const dispatch = useDispatch();
  let camera;
  useEffect(() => {
    getPermissionAsync();
    wait(5000).then(() => {
      hideLabel(true);
    });
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
          mediaType: "video",
        });
      }
    }
  };
  const onTakePicture = async () => {
    const data = await camera.takePictureAsync()({
      quality: 1,
    });

    if (data) {
      console.log(data);
      // navigation.navigate("EditAndPostScreen", {
      //   photoUri: data.uri,
      //   type: route.params.type,
      //   mediaType: "photo",
      // });
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
  // const pickVideo = (uri) => {
  //   setIsPanelActive(false);
  //   navigation.navigate("EditAndPostScreen", {
  //     videoUri: uri,
  //     type: route.params.type,
  //     mediaType: "video",
  //   });
  // };
  const getRatio = async () => {
    let ratio = await camera.getSupportedRatiosAsync(); //android only now
    setDeviceCameraRatio(ratio.pop());
  };
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            dispatch(toggleShowBottomNavbar(false));
            navigation.goBack();
          }}
        >
          <Ionicons name="md-arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {route.params.type === "story" ? (
          <View style={styles.postToContainer}>
            {xStore && (
              <>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setPostingTo("store");
                  }}
                >
                  <View
                    style={[
                      styles.postTo,
                      postingTo !== "store" && { backgroundColor: "#ffffff45" },
                    ]}
                  >
                    <Image
                      source={{ uri: user.profile_pic }}
                      style={styles.postToImage}
                    />
                    {labelHidden ? null : (
                      <Text style={styles.postToText}>Store Story</Text>
                    )}
                  </View>
                </TouchableWithoutFeedback>
                <View style={{ width: 10, height: 10 }}></View>
              </>
            )}
            <TouchableWithoutFeedback
              onPress={() => {
                setPostingTo("personal");
              }}
            >
              <View
                style={[
                  styles.postTo,
                  postingTo !== "personal" && { backgroundColor: "#ffffff45" },
                ]}
              >
                <Image
                  source={{ uri: user.profile_pic }}
                  style={styles.postToImage}
                />
                {labelHidden ? null : (
                  <Text style={styles.postToText}>Your Story</Text>
                )}
              </View>
            </TouchableWithoutFeedback>
            <View style={{ width: 10, height: 10 }}></View>
            {tvProfile && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setPostingTo("tv");
                }}
              >
                <View
                  style={[
                    styles.postTo,
                    postingTo !== "tv" && { backgroundColor: "#ffffff45" },
                  ]}
                >
                  <Image
                    source={{ uri: user.profile_pic }}
                    style={styles.postToImage}
                  />
                  {labelHidden ? null : (
                    <Text style={styles.postToText}>Tv Story</Text>
                  )}
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        ) : null}
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
        {storyType !== "text" && (
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
            {/* <Feather name="camera" size={24} color="black" /> */}
          </Camera>
        )}
        {storyType === "text" && <TextStoryContainer />}
        <View style={styles.otherControl}>
          {route.params.type === "story" ? (
            <View style={styles.storyTypes}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setStoryType("text");
                }}
              >
                <View style={[styles.storyType]}>
                  <View
                    style={[
                      styles.storyTypeIconWrapper,
                      storyType !== "text" && { borderColor: "#ffffff45" },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="cursor-text"
                      size={30}
                      color="#000000"
                    />
                  </View>
                  <View style={[styles.storyTypeTextWrapper]}>
                    {labelHidden ? null : (
                      <Text style={styles.storyTypeText}>Text</Text>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <View style={{ width: 10, height: 10 }}></View>
              <TouchableWithoutFeedback
                onPress={() => {
                  setStoryType("video");
                }}
              >
                <View style={[styles.storyType]}>
                  <View
                    style={[
                      styles.storyTypeIconWrapper,
                      storyType !== "video" && { borderColor: "#ffffff45" },
                    ]}
                  >
                    <Feather name="video" size={30} color="#000000" />
                  </View>
                  <View style={[styles.storyTypeTextWrapper]}>
                    {labelHidden ? null : (
                      <Text style={styles.storyTypeText}>Video</Text>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <View style={{ width: 10, height: 10 }}></View>
              <TouchableWithoutFeedback
                onPress={() => {
                  setStoryType("photo");
                }}
              >
                <View style={[styles.storyType]}>
                  <View
                    style={[
                      styles.storyTypeIconWrapper,
                      storyType !== "photo" && { borderColor: "#ffffff45" },
                    ]}
                  >
                    <AntDesign name="picture" size={30} color="#000000" />
                  </View>
                  <View style={[styles.storyTypeTextWrapper]}>
                    {labelHidden ? null : (
                      <Text style={styles.storyTypeText}>Photo</Text>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : null}

          {showProgressBar ? renderProgressBar() : null}
          {storyType === "text" ? null : (
            <View style={styles.otherControlWrapper}>
              <TouchableOpacity
                style={styles.selectFromPhoneContainer}
                onPress={() => setIsPanelActive(true)}
              >
                <View style={styles.selectFromPhone}>
                  <Entypo
                    name={
                      storyType === "video" ? "folder-video" : "folder-images"
                    }
                    size={30}
                    color="white"
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.recordControlBorder}>
                {storyType === "video" ? (
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
                ) : null}
                {storyType === "photo" ? (
                  <TouchableOpacity onPress={onTakePicture}>
                    <View style={styles.recordControlWrapper}>
                      <View
                        style={
                          isRecording ? styles.buttonStop : styles.buttonRecord
                        }
                      ></View>
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.flipCamera}
                onPress={() => {
                  setType(type === "back" ? "front" : "back");
                }}
              >
                <MaterialCommunityIcons
                  name="axis-z-rotate-counterclockwise"
                  size={22}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </>
  );
}
