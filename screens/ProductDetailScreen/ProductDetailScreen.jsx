// import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import AppButton from "../../components/AppButton/AppButton";
import firebase, { firestore } from "../../firebase/firebase.utils";
import CustomPopUp from "../../components/CustomPopUp/CustomPopUp";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";

const ProductDetailScreen = () => {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const route = useRoute();
  const [name, setName] = useState(route.params.productData.name);
  const [price, setPrice] = useState(route.params.productData.price);
  const [oPrice, setOPrice] = useState(route.params.productData.oPrice);
  const [quantity, setQuantity] = useState(route.params.productData.stock);
  const [uploading, setUploading] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState(["XS", "S", "M", "L"]);
  let flatListRef;

  const orderNow = async (pid, newImage) => {
    const timestamp = Date.now();
    const data = {
      id: pid,
      name,
      price: price * 1,
      oPrice: oPrice * 1,
      stock: quantity * 1,
      orders: 0,
      storeId: user.id,
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
  };
  return (
    <>
      <View style={{ position: "absolute", top: 30, left: 20, zIndex: 1 }}>
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 35,
            height: 35,
            borderRadius: 20,
            elevation: 2,
            backgroundColor: "#ffffff",
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="md-arrow-back" size={24} color="black" />
          {/* <AntDesign name="close" size={20} color="#111111" /> */}
        </TouchableOpacity>
      </View>
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
        data={route.params.productData.images}
        initialScrollIndex={0}
        initialNumToRender={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => imagePrev(item)}
      />
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            backgroundColor: "#ecf2fa",
            padding: 20,
            justifyContent: "flex-start",
            alignItems: "flex-start",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: Dimensions.get("screen").width - 40,
              justifyContent: "space-between",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <Text
              style={[
                styles.infoText,
                {
                  fontSize: 16,
                  fontWeight: "bold",
                  width: Dimensions.get("screen").width / 1.2 - 80,
                },
              ]}
              numberOfLines={4}
            >
              {name}
            </Text>
            <View style={{ marginLeft: 20 }}>
              {oPrice ? (
                <Text
                  style={[
                    styles.infoText,
                    {
                      marginRight: 10,
                      color: "#777777",
                      fontSize: 14,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  ${oPrice}
                </Text>
              ) : null}
              <Text
                style={[styles.infoText, { fontSize: 14, fontWeight: "bold" }]}
              >
                ${price}
              </Text>
            </View>
          </View>

          {sizes && (
            <View style={styles.infoSections}>
              <Text
                style={[
                  styles.infoText,
                  {
                    fontSize: 13,
                    fontWeight: "bold",
                    letterSpacing: 2,
                    color: "#777777",
                  },
                ]}
              >
                AVAILABLE SIZES
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                {sizes.map((item, index) => (
                  <View key={index} style={styles.sizeBox}>
                    <Text style={{ fontSize: 16 }}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
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
                ></View>
              ))}
            </View>
          </View>
          <View style={styles.infoSections}>
            <Text
              style={[
                styles.infoText,
                {
                  fontSize: 13,
                  fontWeight: "bold",
                  letterSpacing: 2,
                  color: "#777777",
                },
              ]}
            >
              PRODUCT DETAILS
            </Text>
          </View>
        </View>
      </View>
      <View style={{ position: "absolute", bottom: 10, right: 10 }}>
        <AppButton
          onPress={() => {}}
          title={"Buy now"}
          customStyle={{ margin: 10, paddingHorizontal: 20 }}
          textStyle={{ fontSize: 13 }}
        />
      </View>
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
    </>
  );
};

export default ProductDetailScreen;

function imagePrev(item) {
  return (
    <ImageBackground
      source={{
        uri: item.item,
      }}
      style={{
        height: Dimensions.get("screen").height / 1.8,
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
      ></View>
    </ImageBackground>
  );
}
