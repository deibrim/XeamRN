import { AntDesign, Ionicons, Entypo, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { setChatBackground } from "../../redux/settings/actions";
import BG1 from "../../assets/cwall/1.jpg";
import BG2 from "../../assets/cwall/2.jpg";
import BG3 from "../../assets/cwall/3.jpg";
import BG4 from "../../assets/cwall/4.png";
import BG5 from "../../assets/cwall/5.jpg";
import BG6 from "../../assets/cwall/6.jpg";
import BG7 from "../../assets/cwall/7.jpg";
import BG8 from "../../assets/cwall/8.jpg";
import BG9 from "../../assets/cwall/9.jpg";

import { styles } from "./styles";

export default function EditChatScreen() {
  const chatBackground = useSelector((state) => state.chat.chatBackground);
  const [selected, setSelected] = useState(chatBackground);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const changeBackground = (index) => {
    dispatch(setChatBackground(index));
    setSelected(index);
  };
  const pickPictureFromPhone = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.cancelled) {
        dispatch(setChatBackground(result.uri));
        setSelected("");
        // console.log(result.uri);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="ios-arrow-back"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.title}>Back</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Text style={{ ...styles.title, fontSize: 14 }}>Chat Settings</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ width: "100%", alignItems: "center" }}
        style={styles.container}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BACKGROUND</Text>
          <View style={styles.wallpapers}>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                height: 130,
                width: "30%",
                borderRadius: 20,
                elevation: 2,
                backgroundColor: "#006eff",
              }}
              onPress={pickPictureFromPhone}
            >
              <Image
                source={
                  typeof chatBackground === "string"
                    ? {
                        uri: `${chatBackground}`,
                      }
                    : null
                }
                style={[
                  {
                    ...styles.wallpaperPreview,
                    width: "100%",
                    borderWidth: 2,
                    borderColor:
                      typeof chatBackground === "string"
                        ? "#006eff"
                        : "#ecf2fa",
                  },
                ]}
              />
              <Text
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  position: "absolute",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Pick from device
              </Text>
            </TouchableOpacity>
            <TouchableWithoutFeedback onPress={() => changeBackground(1)}>
              <Image
                source={BG1}
                style={[
                  styles.wallpaperPreview,
                  selected === 1 ? styles.currentsWallpaper : "",
                ]}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => changeBackground(2)}>
              <Image
                source={BG2}
                style={[
                  styles.wallpaperPreview,
                  selected === 2 ? styles.currentsWallpaper : "",
                ]}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => changeBackground(3)}>
              <Image
                source={BG3}
                style={[
                  styles.wallpaperPreview,
                  selected === 3 && styles.currentsWallpaper,
                ]}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => changeBackground(4)}>
              <Image
                source={BG4}
                style={[
                  styles.wallpaperPreview,
                  selected === 4 ? styles.currentsWallpaper : "",
                ]}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => changeBackground(5)}>
              <Image
                source={BG5}
                style={[
                  styles.wallpaperPreview,
                  selected === 5 ? styles.currentsWallpaper : "",
                ]}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => changeBackground(6)}>
              <Image
                source={BG6}
                style={[
                  styles.wallpaperPreview,
                  selected === 6 ? styles.currentsWallpaper : "",
                ]}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => changeBackground(7)}>
              <Image
                source={BG7}
                style={[
                  styles.wallpaperPreview,
                  selected === 7 ? styles.currentsWallpaper : "",
                ]}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => changeBackground(8)}>
              <Image
                source={BG8}
                style={[
                  styles.wallpaperPreview,
                  selected === 8 ? styles.currentsWallpaper : "",
                ]}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => changeBackground(9)}>
              <Image
                source={BG9}
                style={[
                  styles.wallpaperPreview,
                  selected === 9 ? styles.currentsWallpaper : "",
                ]}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FONT</Text>
        </View>
      </ScrollView>
    </>
  );
}
