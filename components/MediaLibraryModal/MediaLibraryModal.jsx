import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const MediaLibraryModal = ({
  modalVisible,
  setModalVisible,
  album,
  pickVideo,
}) => {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const pickVideoFromPhone = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0,
        videoMaxDuration: 15,
      });

      if (!result.cancelled) {
        pickVideo(result.uri);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    modalVisible && (
      <>
        <View
          style={{
            width: "100%",
            position: "absolute",
            height: Dimensions.get("screen").height - 200,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            backgroundColor: "#ecf2fa",
            borderRadius: 20,
          }}
        >
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{
              backgroundColor: "transparent",
            }}
          >
            <View
              style={{
                marginTop: 80,
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
                paddingHorizontal: 10,
              }}
            >
              {album.map((item, index) => {
                {
                  /* return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => pickVideo(item.uri)}
                  >
                    <Image
                      source={{ uri: item.uri }}
                      resizeMode={"cover"}
                      style={{
                        width: 165,
                        height: 165,
                        margin: 2,
                        borderRadius: 10,
                      }}
                    />
                  </TouchableOpacity>
                ); */
                }
                return item.mediaType === "video" ? (
                  <TouchableOpacity
                    key={index}
                    onPress={() => pickVideo(item.uri)}
                  >
                    <Video
                      key={index}
                      source={{ uri: item.uri }}
                      style={{
                        width: 165,
                        height: 165,
                        margin: 2,
                        borderRadius: 10,
                      }}
                      onError={(e) => console.log(e)}
                      resizeMode={"cover"}
                      shouldPlay={false}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    key={index}
                    onPress={() => pickVideo(item.uri)}
                  >
                    <Image
                      source={{ uri: item.uri }}
                      resizeMode={"cover"}
                      style={{
                        width: 165,
                        height: 165,
                        margin: 2,
                        borderRadius: 10,
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <View
            style={{
              position: "absolute",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
              top: 10,
              left: 0,
              right: 0,
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 35,
                height: 35,
                borderRadius: 20,
                elevation: 2,
                backgroundColor: "#ff4747",
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <AntDesign name="close" size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 130,
                height: 35,
                borderRadius: 20,
                elevation: 2,
                backgroundColor: "#006eff",
              }}
              onPress={pickVideoFromPhone}
            >
              <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
                Pick from device
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    )
  );
};

export default MediaLibraryModal;
