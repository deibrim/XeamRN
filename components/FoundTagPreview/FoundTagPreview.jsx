import { Feather, Fontisto } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";

const FoundTagPreview = ({ item }) => {
  // const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => {}}>
      <View style={styles.tagContainer}>
        <View style={styles.lefContainer}>
          <View style={{ position: "relative" }}>
            <View style={styles.avatar}>
              <Fontisto name="hashtag" size={24} color="white" />
            </View>
          </View>
          <View style={styles.midContainer}>
            <Text style={styles.tagname}>{item.id}</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={styles.highlight}
            >
              {item.postCount}{" "}
              <Text
                numberOfLines={1}
                ellipsizeMode={"tail"}
                style={[styles.highlight, { fontWeight: "500" }]}
              >
                posts
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FoundTagPreview;
