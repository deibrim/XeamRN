import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../AppButton/AppButton";
import { styles } from "./styles";
import firebase, { firestore } from "../../firebase/firebase.utils";
import CustomPopUp from "../CustomPopUp/CustomPopUp";

const AddProductModal = ({ modalVisible, setModalVisible }) => {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const [images, setImages] = useState([""]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oPrice, setOPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [current, setCurrent] = useState("");
  const [sizeText, setSizeText] = useState("Size");
  const [colorText, setColorText] = useState("Color");
  const [detailsText, setDetailsText] = useState("");
  const [uploading, setUploading] = useState("");
  const [uploadingCount, setUploadingCount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadingPercentage, setUploadingPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [textInputContainerVisible, setTextInputContainerVisible] = useState(
    false
  );
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [details, setDetails] = useState([]);
  let flatListRef;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });
    if (!result.cancelled) {
      setImages([...images, result.uri]);
    }
  };
  const addNewProduct = async (pid, newImage) => {
    const timestamp = Date.now();
    const data = {
      id: pid,
      name,
      price: price * 1,
      oPrice: oPrice * 1,
      stock: quantity * 1,
      orders: 0,
      storeId: user.id,
      details,
      timestamp,
      images: newImage,
    };
    if (colors.length > 0) {
      data["colors"] = colors;
    }
    if (sizes.length > 0) {
      data["sizes"] = sizes;
    }
    await firestore
      .collection("products")
      .doc(user.id)
      .collection("my_products")
      .doc(pid)
      .set(data);

    setImages([""]);
    setName("");
    setPrice("");
    setOPrice("");
    setQuantity("");
    setCurrent("");
    setSizeText("");
    setColorText("");
    setUploading("");
    setUploadingPercentage(0);
    setLoading(false);
    setTextInputContainerVisible(false);
    setColors([]);
    setSizes([]);
    setErrorMessage("");
    setModalVisible(false);
  };
  function uploadData() {
    if (name.trim() === "") {
      setErrorMessage("Product name is required!");
      return;
    } else if (price.trim() === "") {
      setErrorMessage("New price is required!");
      return;
    } else if (quantity.trim() === "") {
      setErrorMessage("Stock is required!");
      return;
    } else if (images.length - 1 === 0) {
      setErrorMessage("Minimum of an image is required!");
      return;
    } else if (details.length === 0) {
      setErrorMessage(" Add product details");
      return;
    }
    setLoading(true);
    const pid = uuidv4().split("-").join("");
    const newImage = [];
    const filterOut = images.filter((item, i) => i !== 0);
    filterOut.forEach(async (item, index) => {
      const response = await fetch(item);
      const blob = await response.blob();
      const storageRef = firebase
        .storage()
        .ref(`products/${user.id}/${pid}/${index}`);
      const uploadTask = storageRef.put(blob);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progressPercentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadingPercentage(Math.floor(progressPercentage));
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              setUploading("paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              setUploading(`Uploading...`);
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            newImage.push(downloadURL);
            setUploading(``);
            if (newImage.length === images.length - 1) {
              addNewProduct(pid, newImage);
            }
          });
        }
      );
    });
  }
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
            height: Dimensions.get("screen").height,
          }}
        >
          {errorMessage.trim() !== "" ? (
            <View
              style={{
                position: "absolute",
                top: 110,
                width: "100%",
                alignItems: "center",
              }}
            >
              <CustomPopUp
                message={`${errorMessage}`}
                type={"error"}
                customStyles={{
                  backgroundColor: "red",
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                customTextStyles={{ color: "#ffffff", textAlign: "center" }}
              />
            </View>
          ) : null}
          {loading && (
            <View
              style={{
                position: "absolute",
                minHeight: 200,
                width: "100%",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000",
                opacity: 0.6,
                zIndex: 999999999999999999,
              }}
            >
              <Text
                style={{ color: "#ffffff", fontSize: 18, marginBottom: 20 }}
              >
                {uploading}
              </Text>
              <Text
                style={{ color: "#ffffff", fontSize: 18, marginBottom: 20 }}
              >
                {uploadingPercentage}%
              </Text>
              <Image
                style={{ marginLeft: 5, width: 40, height: 40 }}
                source={require("../../assets/loader.gif")}
              />
            </View>
          )}
          {textInputContainerVisible &&
            textInputContainer(
              current,
              name,
              price,
              oPrice,
              quantity,
              colors,
              sizes,
              details,
              sizeText,
              colorText,
              detailsText,
              setName,
              setPrice,
              setOPrice,
              setQuantity,
              setColors,
              setSizes,
              setDetails,
              setSizeText,
              setColorText,
              setDetailsText,
              textInputContainerVisible,
              setTextInputContainerVisible,
              setErrorMessage
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
                        source={require("../../assets/images/placeholder.png")}
                        style={{
                          height: Dimensions.get("screen").height / 1.5,
                          width: Dimensions.get("screen").width,
                        }}
                        resizeMode={"cover"}
                      >
                        <View
                          style={{
                            height: "100%",
                            width: "100%",
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
                <ScrollView
                  style={{
                    minHeight: 260,
                    maxHeight: 300,
                    width: "100%",
                    backgroundColor: "#ecf2fa",
                    borderRadius: 20,
                    marginTop: -20,
                    padding: 20,
                    marginBottom: 20,
                  }}
                >
                  <View>
                    {productInfo(
                      "Product name",
                      () => {
                        setTextInputContainerVisible(true);
                        setCurrent("name");
                      },
                      {
                        fontSize: 15,
                        letterSpacing: 2,
                      },
                      { marginBottom: 0, marginTop: 10 }
                    )}
                    <Text
                      style={{
                        fontSize: 18,
                        color: "#777777",
                        marginLeft: 0,
                        marginBottom: 10,
                      }}
                    >
                      {name}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <View>
                      {productInfo(
                        "Old price",
                        () => {
                          setTextInputContainerVisible(true);
                          setCurrent("oPrice");
                        },
                        {
                          fontSize: 15,
                          letterSpacing: 2,
                        },
                        { marginBottom: 0 }
                      )}
                      <Text
                        style={{
                          fontSize: 17,
                          color: "#777777",
                          marginLeft: 10,
                          marginBottom: 10,
                        }}
                      >
                        {oPrice}
                      </Text>
                    </View>
                    <View>
                      {productInfo(
                        "New price",
                        () => {
                          setTextInputContainerVisible(true);
                          setCurrent("price");
                        },
                        {
                          fontSize: 15,
                          letterSpacing: 2,
                        },
                        { marginBottom: 0 }
                      )}
                      <Text
                        style={{
                          fontSize: 17,
                          color: "#777777",
                          marginLeft: 10,
                          marginBottom: 10,
                        }}
                      >
                        {price}
                      </Text>
                    </View>
                    <View>
                      {productInfo(
                        "Stock",
                        () => {
                          setTextInputContainerVisible(true);
                          setCurrent("quantity");
                        },
                        {
                          fontSize: 15,
                          letterSpacing: 2,
                        },
                        { marginBottom: 0 }
                      )}
                      <Text
                        style={{
                          fontSize: 17,
                          color: "#777777",
                          marginLeft: 10,
                          marginBottom: 10,
                        }}
                      >
                        {quantity}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 1, alignSelf: "flex-start" }}>
                      {productInfo(
                        "Sizes",
                        () => {
                          setTextInputContainerVisible(true);
                          setCurrent("size");
                        },
                        {
                          fontSize: 16,
                          letterSpacing: 2,
                        },
                        { marginBottom: 0 }
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",

                          width: "100%",
                          flexWrap: "wrap",
                          marginVertical: 5,
                        }}
                      >
                        {sizes.map((item, index) => (
                          <View
                            key={index}
                            style={{
                              height: 35,
                              width: 35,
                              borderRadius: 10,
                              backgroundColor: "#ecf2fa",
                              elevation: 2,
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: 10,
                              position: "relative",
                              marginVertical: 5,
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
                              <AntDesign
                                name="close"
                                size={15}
                                color="#ff4747"
                              />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 16 }}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "flex-start",
                      }}
                    >
                      {productInfo(
                        "Colors",
                        () => {
                          setTextInputContainerVisible(true);
                          setCurrent("color");
                        },
                        {
                          fontSize: 16,
                          letterSpacing: 2,
                        },
                        { marginBottom: 0 }
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                          flexWrap: "wrap",
                          marginVertical: 5,
                          marginBottom: 0,
                        }}
                      >
                        {colors.map((item, index) => (
                          <View
                            key={index}
                            style={{
                              height: 35,
                              width: 35,
                              borderRadius: 20,
                              backgroundColor: item,
                              elevation: 2,
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: 10,
                              position: "relative",
                              marginVertical: 5,
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
                              <AntDesign
                                name="close"
                                size={15}
                                color="#ff4747"
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignSelf: "flex-start",
                      marginTop: 20,
                    }}
                  >
                    {productInfo(
                      "Product Details",
                      () => {
                        setTextInputContainerVisible(true);
                        setCurrent("detail");
                      },
                      {
                        fontSize: 16,
                        letterSpacing: 2,
                      },
                      { marginBottom: 0 }
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                        flexWrap: "wrap",
                        marginVertical: 5,
                        marginBottom: 0,
                      }}
                    >
                      {details.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            elevation: 2,
                            flexDirection: "row",
                            alignItems: "flex-start",
                            paddingRight: 10,
                            position: "relative",
                            width: "100%",
                            marginVertical: 5,
                          }}
                        >
                          <Entypo
                            name="dot-single"
                            size={30}
                            color="black"
                            style={{ marginTop: -5 }}
                          />
                          <Text style={{ fontSize: 16, width: "95%" }}>
                            {item}
                          </Text>
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              top: -10,
                              right: 0,
                            }}
                            onPress={() => {
                              const filter = details.filter(
                                (item, ind) => ind !== index
                              );
                              setDetails(filter);
                            }}
                          >
                            <AntDesign name="close" size={20} color="#ff4747" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={{ height: 20 }}></View>
                </ScrollView>
              </View>

              <View
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  paddingRight: 10,
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
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
                    marginBottom: 5,
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <AntDesign name="close" size={20} color="#ffffff" />
                </TouchableOpacity>
                <View style={{ width: "50%", alignItems: "center" }}>
                  <AppButton
                    onPress={() => {
                      uploadData();
                    }}
                    title={"Add Product"}
                    customStyle={{ width: "90%", margin: 10, marginTop: 5 }}
                    textStyle={{ fontSize: 13 }}
                  />
                </View>
              </View>
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
  oPrice,
  quantity,
  colors,
  sizes,
  details,
  sizeText,
  colorText,
  detailsText,
  setName,
  setPrice,
  setOPrice,
  setQuantity,
  setColors,
  setSizes,
  setDetails,
  setSizeText,
  setColorText,
  setDetailsText,
  textInputContainerVisible,
  setTextInputContainerVisible,
  setErrorMessage
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
          keyboardType={
            current === "price"
              ? "number-pad"
              : current === "oPrice"
              ? "number-pad"
              : current === "quantity"
              ? "number-pad"
              : "default"
          }
          autoFocus={true}
          autoCapitalize={current === "detail" ? true : "none"}
          onChangeText={(e) => {
            setErrorMessage("");
            current === "name"
              ? setName(e)
              : current === "price"
              ? setPrice(e)
              : current === "oPrice"
              ? setOPrice(e)
              : current === "quantity"
              ? setQuantity(e)
              : current === "size"
              ? setSizeText(e.toUpperCase())
              : current === "color"
              ? setColorText(e.toLowerCase())
              : setDetailsText(e);
          }}
          value={
            current === "name"
              ? name
              : current === "price"
              ? price
              : current === "oPrice"
              ? oPrice
              : current === "quantity"
              ? quantity
              : current === "size"
              ? sizeText
              : current === "color"
              ? colorText
              : detailsText
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
                ? setSizes([...sizes, sizeText])
                : current === "color"
                ? setColors([...colors, colorText])
                : current === "detail"
                ? setDetails([...details, detailsText])
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
