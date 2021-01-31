import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View } from "react-native";
// import { AssetsSelector } from "expo-images-picker";
import AssetsSelector from "../AssetsSelector/AssetsSelector";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";

const MediaLibraryModal = ({
  isPanelActive,
  setIsPanelActive,
  type,
  storyType,
}) => {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const onDone = (data) => {
    const mediaType = data[0].mediaType;
    console.log(mediaType);
    const routeParams =
      mediaType === "video"
        ? {
            videoUri: data[0].uri,
            type,
            mediaType,
          }
        : {
            photoUri: data[0].uri,
            type,
            mediaType,
            height: data[0].height,
            width: data[0].width,
          };
    navigation.navigate("EditAndPostScreen", routeParams);
  };

  const goBack = () => {
    setIsPanelActive(false);
  };
  return isPanelActive ? (
    <View style={styles.container}>
      <AssetsSelector
        options={{
          assetsType: [storyType],
          noAssets: {
            Component: () => <View></View>,
          },
          maxSelections: 1,
          margin: 2,
          portraitCols: 3,
          landscapeCols: 5,
          widgetWidth: 100,
          widgetBgColor: "#ecf2fa",
          videoIcon: {
            Component: Ionicons,
            iconName: "ios-videocam",
            color: "#00000000",
            size: 22,
          },
          selectedIcon: {
            Component: Ionicons,
            iconName: "ios-checkmark-circle-outline",
            color: "white",
            bg: "#00000050",
            size: 26,
          },
          defaultTopNavigator: {
            continueText: "DONE ",
            goBackText: "BACK ",
            textStyle: styles.textStyle,
            buttonStyle: styles.buttonStyle,
            backFunction: () => goBack(),
            doneFunction: (data) => onDone(data),
          },
        }}
      />
    </View>
  ) : null;
};

export default MediaLibraryModal;
