import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useEffect, useState, useRef } from "react";
import { Keyboard, TextInput, View } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import AppButton from "../AppButton/AppButton";
import { styles } from "./styles";

const TextStoryContainer = ({}) => {
  const user = useSelector((state) => state.user.currentUser);
  const tv = useSelector((state) => state.user.currentUserTvProfile);
  const store = useSelector((state) => state.user.currentUserXStore);
  const [backgroundColor, setBackgroundColor] = useState("#006eff67");
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [fontSize, setFontSize] = useState(30);
  const [fSize, setFSize] = useState("focusFontSize");
  const [focusFontSize, setFocusFontSize] = useState(20);

  const [text, setText] = useState("");
  const navigation = useNavigation();
  const [cameraRollUri, setCameraRollUri] = useState("");
  const captureViewRef = useRef();
  useEffect(() => {
    Permissions.askAsync(Permissions.CAMERA_ROLL);
    Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardShowing(true);
      setFSize("focusFontSize");
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardShowing(false);
      setFSize("fontSize");
    });
  }, [keyboardShowing]);

  const onCapture = async (share) => {
    try {
      let result = await captureRef(captureViewRef, {
        quality: 1,
        format: "png",
      });
      const asset = await MediaLibrary.createAssetAsync(result);
      setCameraRollUri(asset.uri);
    } catch (snapshotError) {
      console.error(snapshotError);
    }
  };
  return (
    <View style={[styles.wrapper]}>
      <ViewShot style={{ backgroundColor: "transparent" }} ref={captureViewRef}>
        <View style={[styles.container, { backgroundColor }]}>
          <TextInput
            style={[
              styles.input,
              { fontSize: fSize === "fontSize" ? fontSize : focusFontSize },
            ]}
            underlineColorAndroid="transparent"
            multiline={true}
            placeholder="Type Something"
            placeholderTextColor="#000000"
            autoCapitalize="none"
            onBlur={() => setFSize(fontSize)}
            onFocus={() => setFSize(focusFontSize)}
            onChangeText={(e) => {
              setText(e);
            }}
            value={text}
          />
        </View>
      </ViewShot>
    </View>
  );
};

export default TextStoryContainer;
