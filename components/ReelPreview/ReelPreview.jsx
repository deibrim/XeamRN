import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Image, Text, TouchableWithoutFeedback } from "react-native";
import { Video } from "expo-av";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";

export default function ReelPreview(props) {
  const { videoUri, user, index, views } = props.data;
  const { profile_pic, name, username } = user;
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();
  const getViewCount = () => {
    return Object.values(views).filter((v) => v).length;
  };
  return (
    <>
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate("ReelScreen", {
            selectedIndex: index,
            reelsArray: props.reels,
          })
        }
      >
        <View style={styles.reelCard}>
          <Video
            source={{ uri: videoUri }}
            style={styles.reelCardImage}
            onError={(e) => console.log(e)}
            resizeMode={"cover"}
            repeat={true}
            shouldPlay={false}
            paused={true}
            usePoster={true}
            onError={() => setErrorMessage("Currently not available")}
          />
          <View style={[styles.overlay, { height: "100%" }]}>
            <View style={styles.reelCardFooter}>
              <Image
                style={{ height: 25, width: 25, borderRadius: 20 }}
                source={{ uri: profile_pic }}
              />
              <Text style={styles.reelCardFooterText}> {username}</Text>
            </View>
          </View>
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              flexDirection: "row",
              alignItems: "center",
              opacity: 0.7,
            }}
          >
            <MaterialIcons name="visibility" size={18} color="#f8f8f8" />
            <Text style={{ ...styles.reelCardFooterText, color: "#f8f8f8" }}>
              {" "}
              {getViewCount()}
            </Text>
          </View>
          {errorMessage ? (
            <View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#111111",
                opacity: 0.7,
                zIndex: 5,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "#ffffff" }}>{errorMessage}</Text>
            </View>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
