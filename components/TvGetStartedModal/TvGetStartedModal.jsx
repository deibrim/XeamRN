import { AntDesign, MaterialIcons } from "@expo/vector-icons";
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
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../AppButton/AppButton";

const TvGetStartedModal = ({ modalVisible, setModalVisible }) => {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  let flatListRef;

  const getStartedContent = [
    {
      headline: "Setup TV Profile",
      body:
        "With a tv profile you get access to extra features and you can monitor your performance with extra info we will be providing you",
      illustration: <MaterialIcons name="live-tv" size={50} color="#555555" />,
    },
  ];
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
          <AppButton
            onPress={() => {
              setModalVisible(false);
            }}
            title={"Get Started"}
            customStyle={{ width: "90%", margin: 10 }}
          />
        </View>
      </Modal>
    </>
  );
};

export default TvGetStartedModal;
