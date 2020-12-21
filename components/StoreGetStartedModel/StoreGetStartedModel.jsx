import {
  AntDesign,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../AppButton/AppButton";
import { styles } from "./styles";
const StoreGetStartedModel = ({ modalVisible, setModalVisible }) => {
  // const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  let flatListRef;

  const getStartedContent = [
    {
      headline: "Obtain the Duo mode of E-commercing",
      body:
        "You can hold an account of your store, presenting the entire product’s elements, to reach potential buyers.",
      illustration: <FontAwesome5 name="store-alt" size={50} color="#555555" />,
    },
    {
      headline: "Communicate with your brand.",
      body:
        "Secure your Tv channel for a better credibility of your merchandise.",
      illustration: (
        <MaterialCommunityIcons name="voice" size={50} color="#555555" />
      ),
    },
    {
      headline: "Flourish your Store with Creativity.",
      body:
        "Sell & Popularize your products in exchange of profit. Grow your business by connecting with customers.",
      illustration: (
        <MaterialCommunityIcons name="voice" size={50} color="#555555" />
      ),
    },
  ];
  const scrollToIndex = (index) => {
    flatListRef.scrollEnabled = true;
    flatListRef.scrollToIndex({ animated: true, index: "" + index });
    setIndex(index);
    flatListRef.scrollEnabled = false;
  };
  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "space-evenly",
            alignItems: "center",
            backgroundColor: "#ffffff",
            width: "100%",
          }}
        >
          <View
            style={{
              height: "100%",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "30%",
            }}
          >
            <FlatList
              contentContainerStyle={{}}
              style={{
                flex: 1,
                marginVertical: "auto",
              }}
              ref={(ref) => {
                flatListRef = ref;
              }}
              scrollEnabled={false}
              snapToInterval={Dimensions.get("screen").width}
              snapToAlignment={"start"}
              decelerationRate={"fast"}
              showsHorizontalScrollIndicator={true}
              horizontal
              data={getStartedContent}
              initialScrollIndex={0}
              initialNumToRender={3}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item) => {
                return (
                  <View
                    style={{
                      width: Dimensions.get("screen").width,
                      height: "70%",
                      position: "relative",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        paddingHorizontal: "7%",
                      }}
                    >
                      {item.item.illustration}
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 28,
                          fontWeight: "200",
                          color: "#111111",
                          marginBottom: 10,
                          marginTop: 20,
                        }}
                      >
                        {item.item.headline}
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 16,
                          color: "#666666",
                        }}
                      >
                        {item.item.body}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
            <View style={{ position: "absolute", top: 10, left: 10 }}>
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
                  navigation.goBack();
                  setModalVisible(!modalVisible);
                }}
              >
                <AntDesign name="close" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => scrollToIndex(0)}
              style={{ padding: 5 }}
            >
              <View
                style={
                  index === 0
                    ? { ...styles.dot, backgroundColor: "#111111" }
                    : { ...styles.dot }
                }
              ></View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => scrollToIndex(1)}
              style={{ padding: 5 }}
            >
              <View
                style={
                  index === 1
                    ? {
                        ...styles.dot,
                        // marginHorizontal: 5,
                        backgroundColor: "#111111",
                      }
                    : {
                        ...styles.dot,
                        //  marginHorizontal: 5
                      }
                }
              ></View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => scrollToIndex(2)}
              style={{ padding: 5 }}
            >
              <View
                style={
                  index === 2
                    ? { ...styles.dot, backgroundColor: "#111111" }
                    : { ...styles.dot }
                }
              ></View>
            </TouchableOpacity>
          </View>
          <AppButton
            onPress={() => {
              if (index == 0) {
                scrollToIndex(1);
              } else if (index == 1) {
                scrollToIndex(2);
              } else {
                setModalVisible(false);
              }
            }}
            title={index === 2 ? "Get Started" : "Next"}
            customStyle={{
              width: index === 2 ? "90%" : 80,
              margin: 10,
              borderRadius: 40,
            }}
            iconComponent={
              index !== 2 && (
                <Ionicons
                  name="ios-arrow-forward"
                  size={20}
                  color="white"
                  style={{ marginLeft: 5 }}
                />
              )
            }
          />
        </View>
      </Modal>
    </>
  );
};

export default StoreGetStartedModel;
