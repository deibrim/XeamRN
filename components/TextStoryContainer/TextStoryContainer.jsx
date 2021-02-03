import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState, useRef } from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import { Slider } from "react-native-range-slider-expo";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
// import AppButton from "../AppButton/AppButton";
import Draggable from "../Draggable/Draggable";
import { styles } from "./styles";
import ColorPicker from "../ColorPicker/ColorPicker";
import { colors } from "../../constants/Colors";

const TextStoryContainer = ({ setShowStoryTypes }) => {
  const user = useSelector((state) => state.user.currentUser);
  const tv = useSelector((state) => state.user.currentUserTvProfile);
  const store = useSelector((state) => state.user.currentUserXStore);
  const [showDraggable, setShowDraggable] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#549EFF");
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [textBoxVisible, setTextBoxVisible] = useState(false);
  const [fontSize, setFontSize] = useState(20);
  const [focusFontSize, setFocusFontSize] = useState(20);
  const [editing, setEditing] = useState();
  const [canDelete, setCanDelete] = useState(false);

  //   {
  //   id: 1,
  //   data: "lol",
  //   fontSize: 13,
  //   color: "#000000",
  // }
  const [texts, setTexts] = useState([
    // { id: 1, data: "lol", fontSize: 13, color: "#000000" },
  ]);
  const [textColor, setTextColor] = useState("#000000");
  const [text, setText] = useState("");
  const [finalText, setFinalText] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const captureViewRef = useRef();
  useEffect(() => {
    Permissions.askAsync(Permissions.CAMERA_ROLL);
    Keyboard.addListener("keyboardDidHide", () => {
      if (!editing && text.trim() !== "" && texts.length && !keyboardShowing) {
        setTexts((prev) => {
          const nextId = prev[prev.length - 1].id + 1;
          return [
            ...prev,
            { id: nextId, data: text, fontSize, color: textColor },
          ];
        });
        setText("");
      } else if (text.trim() !== "" && !keyboardShowing) {
        setFinalText(text);
        setTexts([{ id: 1, data: text, fontSize, color: textColor }]);
        setText("");
      } else if (editing) {
        const filterOut = texts.filter((item, index) => item.id !== editing.id);
        setTexts([
          ...filterOut,
          { id: editing.id, data: text, fontSize, color: textColor },
        ]);
        setText("");
      } else {
        setTexts([...texts, { id: 1, data: text, fontSize, color: textColor }]);
        setText("");
      }
      setShowStoryTypes(true);
      setKeyboardShowing(false);
      setTextBoxVisible(false);
    });
  }, [keyboardShowing, text, editing, textColor, fontSize]);
  Keyboard.addListener("keyboardDidShow", () => {
    setShowStoryTypes(false);
    setKeyboardShowing(true);
  });
  Keyboard.addListener("keyboardWillHide", () => {
    setKeyboardShowing(false);
    setTextBoxVisible(false);
  });

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
  return (
    <View style={[styles.wrapper]}>
      {!textBoxVisible && (
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={() => onCapture(true)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
              <Ionicons name="ios-arrow-forward" size={18} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      )}
      {!textBoxVisible && (
        <View style={styles.controls}>
          <TouchableWithoutFeedback
            onPress={() => setTextBoxVisible(!textBoxVisible)}
          >
            <View style={styles.controlBtn}>
              <MaterialIcons name="text-fields" size={26} color="#ffffff89" />
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity onPress={() => onCapture(false)}>
            <View style={styles.controlBtn}>
              <Feather name="download" size={24} color="#ffffff89" />
            </View>
          </TouchableOpacity>
          {tv ||
            (store && (
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.controlBtn}>
                  <MaterialIcons
                    name="insert-link"
                    size={26}
                    color="#ffffff89"
                  />
                </View>
              </TouchableWithoutFeedback>
            ))}
        </View>
      )}
      <ViewShot style={{ backgroundColor: "transparent" }} ref={captureViewRef}>
        <View style={[styles.container, { backgroundColor }]}>
          {texts.map((item, index) => (
            <Draggable
              key={index}
              showDraggable={showDraggable}
              setShowDraggable={setShowDraggable}
              data={item}
              editing={editing}
              setEditing={setEditing}
              setTextBoxVisible={setTextBoxVisible}
              setText={setText}
              setFontSize={setFontSize}
              setTextColor={setTextColor}
            />
            // </TouchableOpacity>
          ))}
          {textBoxVisible && (
            <ScrollView
              keyboardShouldPersistTaps={"handled"}
              contentContainerStyle={{
                justifyContent: "center",
              }}
              style={{
                paddingTop: 0,
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                backgroundColor: "#00000034",
              }}
            >
              <View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      fontSize: editing ? editing.fontSize : fontSize,
                      color: textColor,
                    },
                  ]}
                  underlineColorAndroid="transparent"
                  multiline={true}
                  autoFocus
                  autoCapitalize
                  // placeholder="Type Something"
                  placeholderTextColor="#000000"
                  autoCapitalize="none"
                  onBlur={() => {}}
                  onFocus={() => {}}
                  returnKeyType="done"
                  defaultValue={editing && editing.data}
                  onChangeText={(e) => {
                    setText(e);
                  }}
                  value={text}
                />
              </View>
              <View style={styles.fontSizeSliderWrapper}>
                <Slider
                  min={5}
                  max={100}
                  step={1}
                  valueOnChange={(value) => setFontSize(value)}
                  initialValue={20}
                  knobColor="#ffffff"
                  valueLabelsBackgroundColor="#ffffff"
                  inRangeBarColor="#ffffff22"
                  outOfRangeBarColor="#ffffff98"
                  styleSize={"small"}
                  showRangeLabels={false}
                />
              </View>
              <View style={styles.textColorPickerWrapper}>
                <ColorPicker
                  onPress={setTextColor}
                  colors={colors}
                  color={textColor}
                  column
                />
              </View>
            </ScrollView>
          )}
        </View>
      </ViewShot>

      {!keyboardShowing && (
        <View style={styles.backgroundColorPickerWrapper}>
          <ColorPicker
            onPress={setBackgroundColor}
            colors={colors}
            color={backgroundColor}
          />
        </View>
      )}
    </View>
  );
};

export default TextStoryContainer;
