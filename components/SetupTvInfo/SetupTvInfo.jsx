import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  View,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  ProgressBarAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import firebase from "../../firebase/firebase.utils";

import { styles } from "./styles";

const SetupTvInfo = ({
  value,
  onChangeText,
  placeholder,
  content,
  isImage,
  onPress,
}) => {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <>
      <View
        style={{
          width: Dimensions.get("screen").width,
          height: "100%",
          position: "relative",
          backgroundColor: "#ecf2fa",
          paddingTop: 50,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            paddingHorizontal: "7%",
            marginBottom: 30,
          }}
        >
          {content.illustration}
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              fontWeight: "200",
              color: "#111111",
              marginBottom: 10,
              marginTop: 20,
            }}
          >
            {content.headline}
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 15,
              color: "#666666",
            }}
          >
            {content.body}
          </Text>
        </View>
        <View>
          {isImage ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 50,
                position: "absolute",
                width: "100%",
                // zIndex: 9999999999,
              }}
            >
              <Image
                source={{ uri: value }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 100,
                  borderColor: "#006eff",
                  borderWidth: 2,
                }}
              />
              <TouchableOpacity onPress={onPress}>
                <Text style={{ color: "#006eff", fontSize: 16, marginTop: 10 }}>
                  Upload
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.textInputContainer}>
              <TextInput
                value={value}
                onChangeText={(e) => onChangeText(e)}
                placeholder={placeholder}
                style={styles.textInput}
              />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default SetupTvInfo;
