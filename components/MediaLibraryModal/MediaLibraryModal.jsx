import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View } from "react-native";
import { AssetsSelector } from "expo-images-picker";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import { SwipeablePanel } from "rn-swipeable-panel";

const MediaLibraryModal = ({ isPanelActive, setIsPanelActive, type }) => {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const onDone = (data) => {
    setIsPanelActive(false);
    navigation.navigate("EditAndPostScreen", { videoUri: data[0].uri, type });
  };

  const goBack = () => {
    setIsPanelActive(false);
  };
  return (
    // <SwipeablePanel
    //   fullWidth={true}
    //   openLarge={true}
    //   onClose={() => {
    //     setIsPanelActive(false);
    //   }}
    //   onPressCloseButton={() => {
    //     setIsPanelActive(false);
    //   }}
    //   isActive={isPanelActive}
    //   style={{ backgroundColor: "#ecf2fa", zIndex: 3 }}
    //   closeOnTouchOutside={true}
    // >
    isPanelActive ? (
      <View style={styles.container}>
        <AssetsSelector
          options={{
            assetsType: ["video"],
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
    ) : null
    // {/* </SwipeablePanel> */}
  );
};

export default MediaLibraryModal;
