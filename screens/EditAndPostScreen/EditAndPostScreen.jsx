import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Video } from "expo-av";
import { useSelector } from "react-redux";

import styles from "./styles";
// import { Base64 } from "../../utils/DeEncoder";

const EditAndPostScreen = () => {
  const [paused, setPaused] = useState(false);

  const onPlayPausePress = () => {
    setPaused(!paused);
  };
  const route = useRoute();
  const navigation = useNavigation();

  const onCancel = async () => {
    navigation.goBack();
  };
  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onPlayPausePress}>
          <View>
            <Video
              source={{ uri: route.params.videoUri }}
              style={styles.video}
              onError={(e) => console.log(e)}
              resizeMode={"cover"}
              repeat={true}
              shouldPlay={paused}
              isLooping
              paused={paused}
            />
            <View style={styles.uiContainer}>
              <View style={styles.topContainer}>
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
                  onPress={onCancel}
                >
                  <AntDesign name="close" size={20} color="#111111" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setPaused(!paused);
                    navigation.navigate("PostReelScreen", {
                      videoUri: route.params.videoUri,
                      type: route.params.type,
                    });
                  }}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Next</Text>
                    <Ionicons
                      name="ios-arrow-forward"
                      size={20}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {!paused && (
                  <Ionicons name="ios-play" size={100} color="#444444" />
                )}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

export default EditAndPostScreen;
