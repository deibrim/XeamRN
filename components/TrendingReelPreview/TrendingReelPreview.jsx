import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Image, Text } from "react-native";
import { Video } from "expo-av";
import { styles } from "./styles";

export default function TrendingReelPreview({
  customStyles,
  data,
  currentReel,
  index,
}) {
  const getViewCount = () => {
    return Object.values(data.views).filter((v) => v).length;
  };
  return (
    <>
      <View style={[styles.reelCard, { ...customStyles }]}>
        {data.videoUri ? (
          <Video
            source={{ uri: data && data.videoUri ? data.videoUri : "" }}
            style={styles.reelCardImage}
            onError={(e) => console.log(e)}
            resizeMode={"cover"}
            repeat={true}
            shouldPlay={true}
            shouldPlay={currentReel.index === index ? true : false}
            paused={false}
            isMuted={true}
            usePoster={true}
            onError={() => setErrorMessage("Currently not available")}
          />
        ) : (
          <Image
            style={styles.reelCardImage}
            source={require("../../assets/cwall/9.jpg")}
          />
        )}
        <View style={styles.reelCardFooter}>
          <Text style={styles.reelCardFooterText}>
            {data.description ? data.description : "Reel"}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              opacity: 0.7,
            }}
          >
            <MaterialIcons name="visibility" size={18} color="#f8f8f8" />
            <Text style={{ ...styles.reelCardFooterText, color: "#f8f8f8" }}>
              {" "}
              {data.views ? getViewCount() : 0}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}
