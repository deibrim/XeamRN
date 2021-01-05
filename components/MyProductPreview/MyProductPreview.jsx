import { Fontisto } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Image, Text, TouchableWithoutFeedback } from "react-native";
// import { Video } from "expo-av";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";

export default function MyProductPreview(props) {
  const { uri, name, price } = props.data;
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();
  return (
    <>
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.productCard}>
          <Image
            source={{
              uri: uri,
            }}
            style={styles.productCardImage}
            resizeMode={"cover"}
          />
          {/* <Video
            source={{ uri: videoUri }}
            style={styles.productCardImage}
            onError={(e) => console.log(e)}
            resizeMode={"cover"}
            repeat={true}
            shouldPlay={false}
            paused={true}
            usePoster={true}
            onError={() => setErrorMessage("Currently not available")}
          /> */}
          <View style={[styles.overlay, { height: "100%" }]}>
            <View style={styles.productCardFooter}>
              <View
                style={[
                  {
                    height: 0,
                    minHeight: 61,
                    bottom: 0,
                    width: "100%",
                    paddingHorizontal: 5,
                    backgroundColor: "#00000095",
                    paddingVertical: 5,
                    borderRadius: 10,
                  },
                ]}
              >
                <Text
                  numberOfLines={2}
                  ellipsizeMode={"tail"}
                  style={styles.productCardFooterText}
                >
                  {" "}
                  {name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={[
                      styles.productCardFooterText,
                      {
                        fontSize: 13,
                        fontWeight: "bold",
                        marginLeft: 10,
                        marginTop: 5,
                      },
                    ]}
                  >
                    ${price}
                  </Text>
                  <View
                    style={{
                      //   position: "absolute",
                      //   top: 10,
                      //   right: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      opacity: 0.7,
                    }}
                  >
                    <Fontisto name="star" size={15} color="yellow" />
                    <Text
                      style={{
                        ...styles.productCardFooterText,
                        color: "#f8f8f8",
                        marginTop: 3,
                      }}
                    >
                      {4.9}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
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
