import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, View, TouchableOpacity, Text } from "react-native";
import { useSelector } from "react-redux";
import { styles } from "./styles";

const FoundUserPreview = ({ item }) => {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        item.id === user.id
          ? navigation.navigate("ProfileScreen")
          : navigation.navigate("UserProfileScreen", {
              userId: item.id,
            });
      }}
    >
      <View style={styles.userContainer}>
        <View style={styles.lefContainer}>
          <View style={{ position: "relative" }}>
            <Image source={{ uri: item.profile_pic }} style={styles.avatar} />
          </View>
          <View style={styles.midContainer}>
            <Text style={styles.username}>
              {item.username.split("")[0].toUpperCase() +
                item.username.substring(1)}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={styles.highlight}
            >
              {item.name} {item.headline && "|"} {item.headline}
            </Text>
          </View>
          <View style={{ marginLeft: "auto" }}>
            {item.isTvActivated && (
              <TouchableOpacity
                onPress={() => {
                  item.id === user.id
                    ? navigation.navigate("TvProfileScreen")
                    : navigation.navigate("UserTvProfileScreen", {
                        userTvId: item.id,
                      });
                }}
              >
                <View style={styles.button}>
                  <Feather name="tv" size={14} color="white" />
                </View>
              </TouchableOpacity>
            )}
            {item.isBusinessAccount && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("UserStoreScreen", { storeId: item.id })
                }
              >
                <View style={{ ...styles.button, backgroundColor: "#ffffff" }}>
                  <AntDesign name="isv" size={14} color="#006eff" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FoundUserPreview;
