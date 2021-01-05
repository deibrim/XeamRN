import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../AppButton/AppButton";
import { styles } from "./styles";
const AddProductModal = ({ modalVisible, setModalVisible }) => {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const [images, setImages] = useState([
    "https://static.nike.com/a/images/w_1536,c_limit/9de44154-c8c3-4f77-b47e-d992b7b96379/image.jpg",
    "https://static.nike.com/a/images/w_1536,c_limit/9de44154-c8c3-4f77-b47e-d992b7b96379/image.jpg",
  ]);
  const [name, setName] = useState("Product Name");
  const [price, setPrice] = useState("$$$");
  const [colors, setColors] = useState(["#006eff", "blue", "red", "green"]);
  const [sizes, setSizes] = useState(["XS", "S", "M", "L"]);
  let flatListRef;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setImages([...images, result.uri]);
    }
  };
  useEffect(() => {
    return () => "";
  }, [images]);

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
            backgroundColor: "#ecf2fa",
          }}
        >
          <View
            style={{
              height: "100%",
              flex: 1,
              width: "100%",
            }}
          >
            <View style={styles.container}>
              <FlatList
                contentContainerStyle={{}}
                style={{
                  flex: 1,
                }}
                ref={(ref) => {
                  flatListRef = ref;
                }}
                snapToInterval={Dimensions.get("screen").width}
                snapToAlignment={"start"}
                decelerationRate={"fast"}
                showsHorizontalScrollIndicator={true}
                horizontal
                data={images}
                initialScrollIndex={0}
                initialNumToRender={3}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(item) => {
                  return item.index === 0 ? (
                    <ImageBackground
                      source={{
                        uri: item.item,
                      }}
                      style={{
                        height: Dimensions.get("screen").height / 1.5,
                        width: Dimensions.get("screen").width,
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          width: "100%",
                          backgroundColor: "#00000035",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            height: 100,
                            width: 100,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#00000075",
                            borderRadius: 30,
                          }}
                          onPress={pickImage}
                        >
                          <Entypo name="plus" size={40} color="#ffffff" />
                          <Text style={{ color: "#ffffff" }}>Add Image</Text>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                  ) : (
                    imagePrev(item, images, setImages)
                  );
                }}
              />
              <View
                style={{
                  // flex: 1,
                  minHeight: 250,
                  width: "100%",
                  backgroundColor: "#ecf2fa",
                  borderRadius: 20,
                  marginTop: -20,
                  padding: 15,
                }}
              >
                {productInfo(name, () => {}, { fontSize: 20 })}
                {productInfo(price, () => {}, {
                  fontSize: 20,
                  color: "#777777",
                })}
                <View>
                  {productInfo(
                    "Sizes",
                    () => {},
                    {
                      fontSize: 16,
                    },
                    { marginBottom: 0 }
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 10,
                    }}
                  >
                    {sizes.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 10,
                          backgroundColor: "#ecf2fa",
                          elevation: 2,
                          alignItems: "center",
                          justifyContent: "center",
                          marginHorizontal: 5,
                        }}
                      >
                        <Text style={{ fontSize: 20 }}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View>
                  {productInfo(
                    "Colors",
                    () => {},
                    {
                      fontSize: 16,
                    },
                    { marginBottom: 0 }
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 10,
                    }}
                  >
                    {colors.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: 20,
                          backgroundColor: item,
                          elevation: 2,
                          alignItems: "center",
                          justifyContent: "center",
                          marginHorizontal: 5,
                        }}
                      ></View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

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
                  setModalVisible(!modalVisible);
                }}
              >
                <AntDesign name="close" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <AppButton
              onPress={() => {
                setModalVisible(false);
              }}
              title={"Add Product"}
              customStyle={{ width: "90%", margin: 10 }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AddProductModal;

function productInfo(name, onPress, styl, cStyl) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        ...cStyl,
      }}
    >
      <Text style={styl}>{name}</Text>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 10,
        }}
        onPress={onPress}
      >
        <Entypo name="plus" size={14} color="#006eff" />
        <Text style={{ fontSize: 14, color: "#006eff" }}>add</Text>
      </TouchableOpacity>
    </View>
  );
}

function imagePrev(item, images, setImages) {
  return (
    <ImageBackground
      source={{
        uri: item.item,
      }}
      style={{
        height: Dimensions.get("screen").height / 1.5,
        width: Dimensions.get("screen").width,
      }}
    >
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "#00000035",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            height: 100,
            width: 100,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#00000075",
            borderRadius: 30,
          }}
          onPress={() => {
            const newState = images.filter(
              (ite, index) => index !== item.index
            );
            setImages(newState);
          }}
        >
          <AntDesign name="close" size={25} color="#ff4747" />
          <Text style={{ color: "#ffffff", fontSize: 30 }}>{item.index}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
