import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  Text,
  TextInput,
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
  ]);
  const [name, setName] = useState("Product Name");
  const [price, setPrice] = useState("$$$");
  const [current, setCurrent] = useState("");
  const [sizeText, setSizeText] = useState("Size");
  const [colorText, setColorText] = useState("Color");
  const [textInputContainerVisible, setTextInputContainerVisible] = useState(
    false
  );
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
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
      <View style={{ position: "absolute", top: 0 }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {}}
          style={{
            width: "100%",
            // position: "absolute",
            // top: 0,
            // bottom: 0,
            // left: 0,
            // right: 0,
            height: Dimensions.get("screen").height,
          }}
        >
          {textInputContainerVisible &&
            textInputContainer(
              current,
              name,
              price,
              colors,
              sizes,
              sizeText,
              colorText,
              setName,
              setPrice,
              setColors,
              setSizes,
              setSizeText,
              setColorText,
              textInputContainerVisible,
              setTextInputContainerVisible
            )}
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
                    padding: 20,
                  }}
                >
                  {productInfo(
                    name,
                    () => {
                      setTextInputContainerVisible(true);
                      setCurrent("name");
                    },
                    { fontSize: 20 }
                  )}
                  {productInfo(
                    price,
                    () => {
                      setTextInputContainerVisible(true);
                      setCurrent("price");
                    },
                    {
                      fontSize: 17,
                      color: "#777777",
                    }
                  )}
                  <View>
                    {productInfo(
                      "Sizes",
                      () => {
                        setTextInputContainerVisible(true);
                        setCurrent("size");
                      },
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
                            position: "relative",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              top: -5,
                              right: -5,
                              width: 20,
                              height: 20,
                            }}
                            onPress={() => {
                              const filter = sizes.filter(
                                (item, ind) => ind !== index
                              );
                              setSizes(filter);
                            }}
                          >
                            <AntDesign name="close" size={15} color="#ff4747" />
                          </TouchableOpacity>
                          <Text style={{ fontSize: 20 }}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View>
                    {productInfo(
                      "Colors",
                      () => {
                        setTextInputContainerVisible(true);
                        setCurrent("color");
                      },
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
                            position: "relative",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              top: -5,
                              right: -5,
                              width: 20,
                              height: 20,
                            }}
                            onPress={() => {
                              const filter = colors.filter(
                                (item, ind) => ind !== index
                              );
                              setColors(filter);
                            }}
                          >
                            <AntDesign name="close" size={15} color="#ff4747" />
                          </TouchableOpacity>
                        </View>
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
                textStyle={{ fontSize: 13 }}
              />
            </View>
          </View>
        </Modal>
      </View>
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

function textInputContainer(
  current,
  name,
  price,
  colors,
  sizes,
  sizeText,
  colorText,
  setName,
  setPrice,
  setColors,
  setSizes,
  setSizeText,
  setColorText,
  textInputContainerVisible,
  setTextInputContainerVisible
) {
  return (
    <ScrollView
      contentContainerStyle={{
        height: Dimensions.get("screen").height,
        justifyContent: "center",
        alignItems: "center",
      }}
      style={{
        position: "absolute",
        width: "100%",
        top: 0,
        zIndex: 2,
        backgroundColor: "#00000099",
      }}
    >
      <View
        style={{
          width: "90%",
          backgroundColor: "#ffffff",
          elevation: 4,
          borderRadius: 20,
          minHeight: 200,
          padding: 20,
          marginBottom: 30,
        }}
      >
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder=""
          placeholderTextColor="#000000"
          autoFocus={true}
          autoCapitalize="none"
          onChangeText={(e) => {
            current === "name"
              ? setName(e)
              : current === "price"
              ? setPrice(e)
              : current === "size"
              ? setSizeText(e)
              : setColorText(e);
          }}
          value={
            current === "name"
              ? name
              : current === "price"
              ? price
              : current === "size"
              ? sizeText
              : colorText
          }
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
            justifyContent: "space-around",
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
              setTextInputContainerVisible(!textInputContainerVisible);
            }}
          >
            <AntDesign name="close" size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 35,
              height: 35,
              borderRadius: 20,
              elevation: 2,
              backgroundColor: "green",
            }}
            onPress={() => {
              current === "size"
                ? (setSizes([...sizes, sizeText]), setSizeText("Size"))
                : current === "color"
                ? (setColors([...colors, colorText]), setColorText("Color"))
                : "";
              setTextInputContainerVisible(!textInputContainerVisible);
            }}
          >
            <AntDesign name="check" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
