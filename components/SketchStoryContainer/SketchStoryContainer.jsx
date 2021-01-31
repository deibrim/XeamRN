import {
  AntDesign,
  Entypo,
  Feather,
  Fontisto,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState, useRef } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import AppButton from "../AppButton/AppButton";
import { styles } from "./styles";
// import Draggable from "../Draggable/Draggable";
import Canvas from "../Canvas/Canvas";

const SketchStoryContainer = ({ setShowStoryTypes }) => {
  const user = useSelector((state) => state.user.currentUser);
  const tv = useSelector((state) => state.user.currentUserTvProfile);
  const store = useSelector((state) => state.user.currentUserXStore);
  const [showDraggable, setShowDraggable] = useState(true);
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#006eff67");
  const [textBoxVisible, setTextBoxVisible] = useState(false);
  const [text, setText] = useState("");
  const navigation = useNavigation();
  const [cameraRollUri, setCameraRollUri] = useState("");
  const captureViewRef = useRef();
  let _clear;
  let _undo;
  useEffect(() => {
    Permissions.askAsync(Permissions.CAMERA_ROLL);
    Keyboard.addListener("keyboardDidShow", () => {
      setShowStoryTypes(false);
      setKeyboardShowing(true);
      setFSize("focusFontSize");
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setShowStoryTypes(true);
      setKeyboardShowing(false);
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
  const undo = () => {
    if (_undo !== undefined) _undo();
  };
  const clear = () => {
    if (_clear !== undefined) _clear();
  };
  return (
    <View style={[styles.wrapper]}>
      <View style={styles.controls}>
        <TouchableWithoutFeedback
          onPress={() => setTextBoxVisible(!textBoxVisible)}
        >
          <View style={styles.controlBtn}>
            <MaterialIcons name="text-fields" size={26} color="#ffffff89" />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={undo}>
          <View style={styles.controlBtn}>
            <Fontisto name="undo" size={20} color="#ffffff89" />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={clear}>
          <View style={styles.controlBtn}>
            <MaterialIcons name="clear" size={24} color="#ffffff89" />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.controlBtn}>
            <Feather name="download" size={24} color="#ffffff89" />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <ViewShot style={{ backgroundColor: "transparent" }} ref={captureViewRef}>
        <View style={[styles.container, { backgroundColor }]}>
          {textBoxVisible && (
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
              returnKeyType="done"
              onChangeText={(e) => {
                setText(e);
              }}
              value={text}
            />
          )}
          <Canvas
            strokes={[]}
            containerStyle={{ flex: 1, backgroundColor: "rgba(0,0,0,0.01)" }}
            rewind={(undo) => {
              _undo = undo;
            }}
            clear={(clear) => {
              _clear = clear;
            }}
            color={"#000000"}
            strokeWidth={4}
            enabled={true}
            onChangeStrokes={(strokes) => {}}
          />
        </View>
      </ViewShot>
    </View>
  );
};

export default SketchStoryContainer;
