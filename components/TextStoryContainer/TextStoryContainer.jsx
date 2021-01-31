import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
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
import useAxios from "axios-hooks";
// import AppButton from "../AppButton/AppButton";
// import Draggable from "../Draggable/Draggable";
import { styles } from "./styles";

const TextStoryContainer = ({ setShowStoryTypes }) => {
  const user = useSelector((state) => state.user.currentUser);
  const tv = useSelector((state) => state.user.currentUserTvProfile);
  const store = useSelector((state) => state.user.currentUserXStore);
  const [{ data: POSTData, loading, error }, executePost] = useAxios(
    {
      url: "http://localhost:5000/stories",
      method: "POST",
    },
    { manual: true }
  );
  const [showDraggable, setShowDraggable] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#006eff67");
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [textBoxVisible, setTextBoxVisible] = useState(false);
  const [fontSize, setFontSize] = useState(30);
  const [fSize, setFSize] = useState("focusFontSize");
  const [focusFontSize, setFocusFontSize] = useState(20);
  const [editing, setEditing] = useState({ id: 1, data: "lol" });
  const [texts, setTexts] = useState([{ id: 1, data: "lol" }]);
  const [text, setText] = useState("");
  const navigation = useNavigation();
  const [cameraRollUri, setCameraRollUri] = useState("");
  const captureViewRef = useRef();
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
      {/* {showDraggable && (
        <View
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: 70,
            backgroundColor: "red",
          }}
        ></View>
      )} */}
      <View style={styles.controls}>
        <TouchableWithoutFeedback
          onPress={() => setTextBoxVisible(!textBoxVisible)}
        >
          <View style={styles.controlBtn}>
            <MaterialIcons name="text-fields" size={26} color="#ffffff89" />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.controlBtn}>
            <MaterialIcons name="insert-link" size={26} color="#ffffff89" />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <ViewShot style={{ backgroundColor: "transparent" }} ref={captureViewRef}>
        <View style={[styles.container, { backgroundColor }]}>
          {/* <Draggable
            widget={"Hello"}
            showDraggable={showDraggable}
            setShowDraggable={setShowDraggable}
          /> */}
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
        </View>
      </ViewShot>
    </View>
  );
};

export default TextStoryContainer;
