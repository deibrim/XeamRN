import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, Image, Text, TouchableWithoutFeedback } from "react-native";
import { Video } from "expo-av";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";

export default function ReelPreview(props) {
  const { videoUri, user, index } = props.data;
  const { profile_pic, name, username } = user;
  const navigation = useNavigation();
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
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
