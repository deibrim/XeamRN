import { Feather, Fontisto, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState, useRef } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import AppButton from "../AppButton/AppButton";
import { styles } from "./styles";
// import Draggable from "../Draggable/Draggable";
import Canvas from "../Canvas/Canvas";
import ColorPicker from "../ColorPicker/ColorPicker";
import { colors } from "../../constants/Colors";
import { Slider } from "react-native-range-slider-expo";

const SketchStoryContainer = ({ setShowStoryTypes }) => {
  const user = useSelector((state) => state.user.currentUser);
  const tv = useSelector((state) => state.user.currentUserTvProfile);
  const store = useSelector((state) => state.user.currentUserXStore);
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#549EFF");
  const [textBoxVisible, setTextBoxVisible] = useState(false);
  const [text, setText] = useState("");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const navigation = useNavigation();
  const route = useRoute();
  const captureViewRef = useRef();
  let _clear;
  let _undo;
  useEffect(() => {
    Permissions.askAsync(Permissions.CAMERA_ROLL);
    Keyboard.addListener("keyboardDidShow", () => {
      setShowStoryTypes(false);
      setKeyboardShowing(true);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setShowStoryTypes(true);
      setKeyboardShowing(false);
    });
  }, [keyboardShowing, strokeWidth, colors, _clear, _undo]);
  const onNext = async (asset) => {
    navigation.navigate("EditAndPostScreen", {
      photoUri: asset.uri,
      type: route.params.type,
      mediaType: "photo",
      height: asset.height,
      width: asset.width,
      asset: asset,
    });
  };
  const onCapture = async (next) => {
    try {
      let result = await captureRef(captureViewRef, {
        quality: 1,
        format: "jpg",
      });
      const asset = await MediaLibrary.createAssetAsync(result);
      if (asset && next) {
        onNext(asset);
      }
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
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => onCapture(true)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
            <Ionicons name="ios-arrow-forward" size={18} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.controlBtn}>
            <MaterialIcons name="text-fields" size={26} color="#ffffff89" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={undo}>
          <View style={styles.controlBtn}>
            <Fontisto name="undo" size={20} color="#ffffff89" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={clear}>
          <View style={styles.controlBtn}>
            <MaterialIcons name="clear" size={24} color="#ffffff89" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onCapture(false)}>
          <View style={styles.controlBtn}>
            <Feather name="download" size={24} color="#ffffff89" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.controlBtn}>
            <MaterialIcons name="insert-link" size={26} color="#ffffff89" />
          </View>
        </TouchableOpacity>
      </View>
      <ViewShot
        style={{ backgroundColor: backgroundColor }}
        ref={captureViewRef}
      >
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
              onBlur={() => {}}
              onFocus={() => {}}
              returnKeyType="done"
              onChangeText={(e) => {
                setText(e);
              }}
              value={text}
            />
          )}
          <Canvas
            strokes={[]}
            containerStyle={{ flex: 1, backgroundColor: "rgba(0,0,0,0.0)" }}
            rewind={(undo) => {
              _undo = undo;
            }}
            clear={(clear) => {
              _clear = clear;
            }}
            color={"#ffffff"}
            strokeWidth={strokeWidth}
            enabled={true}
            onChangeStrokes={(strokes) => {}}
          />
        </View>
      </ViewShot>
      <View style={styles.backgroundColorPickerWrapper}>
        <ColorPicker
          onPress={setBackgroundColor}
          colors={colors}
          color={backgroundColor}
        />
      </View>
      <View style={styles.strokeWidthSliderWrapper}>
        <Slider
          min={5}
          max={100}
          step={2}
          valueOnChange={(value) => setStrokeWidth(value)}
          initialValue={4}
          knobColor="#ffffff"
          valueLabelsBackgroundColor="#ffffff"
          inRangeBarColor="#ffffff22"
          outOfRangeBarColor="#ffffff98"
          styleSize={"small"}
          showRangeLabels={false}
        />
      </View>
    </View>
  );
};

export default SketchStoryContainer;
