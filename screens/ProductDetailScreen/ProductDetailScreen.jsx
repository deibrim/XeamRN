import {
  Entypo,
  Feather,
  Ionicons,
  // MaterialCommunityIcons,
} from "@expo/vector-icons";
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
import { v4 as uuidv4 } from "uuid";
import { useNavigation, useRoute } from "@react-navigation/native";
import AppButton from "../../components/AppButton/AppButton";
import { firestore } from "../../firebase/firebase.utils";
import CustomPopUp from "../../components/CustomPopUp/CustomPopUp";
import { styles } from "./styles";
import AddToBagDialogBox from "../../components/AddToBagDialogBox/AddToBagDialogBox";

const ProductDetailScreen = () => {
  const user = useSelector((state) => state.user.currentUser);
  const bagSize = useSelector((state) => state.shopping.bagSize);
  const navigation = useNavigation();
  const route = useRoute();
  const productData = route.params.productData;
  const [name] = useState(productData.name);
  const [price] = useState(productData.price);
  const [oPrice] = useState(productData.oPrice);
  const [total, setTotal] = useState(0 * 1);
  const [stock] = useState(productData.stock);
  const [quantity, setQuantity] = useState(1 * 1);
  const [isBuyingNow, setIsBuyingNow] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [productDetails] = useState(productData.details || []);
  const [colors] = useState(productData.colors || []);
  const [sizes] = useState(productData.sizes || []);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  let flatListRef;

  const onAddToBag = async () => {
    const docId = `${productData.id}${productData.storeId}${
      selectedSize.trim() !== "" && selectedSize
    }${selectedColor.trim() !== "" && selectedColor}`;
    const productRef = firestore
      .collection("shoppingBags")
      .doc(user.id)
      .collection("products")
      .doc(docId);
    const snapshot = await productRef.get();
    if (snapshot.exists) {
      productRef.update({ quantity: snapshot.data().quantity + quantity });
    } else {
      const data = {
        id: docId,
        productId: productData.id,
        storeId: productData.storeId,
        quantity,
        price,
        timestamp: Date.now(),
      };
      if (selectedSize) {
        data["size"] = selectedSize;
      }
      if (selectedColor) {
        data["color"] = selectedColor;
      }
      productRef.set(data);
    }
  };

  const orderNow = async () => {
    const id = uuidv4().split("-").join("");
    const productInfo = {
      productId: productData.id,
      name,
      total,
      price,
      quantity,
      storeId: productData.storeId,
    };
    const data = {
      id,
      products: [productInfo],
      timeOfOrder: Date.now(),
      status: "pending",
      customerId: user.id,
      customer: {
        name: user.name,
        username: user.username,
      },
    };
    if (selectedSize) {
      productInfo["size"] = selectedSize;
    }
    if (selectedColor) {
      productInfo["color"] = selectedColor;
    }
    await firestore
      .collection("sellerOrders")
      .doc(productData.storeId)
      .collection("orders")
      .doc(id)
      .set(data);
  };
  return (
    <>
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity
          style={[styles.topButton, { width: 35 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="md-arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.topButton, { paddingHorizontal: 10 }]}
          onPress={() => {}}
        >
          <Feather name="shopping-bag" size={18} color="black" />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 14,
              letterSpacing: 1,
              fontWeight: "bold",
            }}
          >
            {bagSize}
          </Text>
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
        data={productData.images}
        initialScrollIndex={0}
        initialNumToRender={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => imagePrev(item)}
      />
      <View style={styles.container}>
        <ScrollView
          style={{
            minHeight: 260,
            // maxHeight: 300,
            width: "100%",
            backgroundColor: "#ecf2fa",
            borderRadius: 20,
            marginTop: -20,
            padding: 20,
            marginBottom: 20,
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

          {sizes.length ? (
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
          ) : null}
          {colors.length ? (
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
                AVAILABLE COLORS
              </Text>
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
          ) : null}
          {productDetails.length ? (
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
                {productDetails.map((item, index) => (
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
                    <Text style={{ fontSize: 16, width: "95%" }}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
          <View style={{ height: 50 }}></View>
        </ScrollView>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          flexDirection: "row",
        }}
      >
        <AppButton
          onPress={() => {
            setSelectedColor("");
            setSelectedSize("");
            setQuantity(1);
            setTotal(price);
            setIsBuyingNow(false);
            setDialogVisible(true);
          }}
          iconComponent={
            <Feather
              name="shopping-bag"
              size={20}
              color="#006eff"
              style={{ marginLeft: 10 }}
            />
          }
          // iconComponent={}
          title={"Add to bag"}
          customStyle={{
            margin: 10,
            paddingHorizontal: 20,
            backgroundColor: "#ffffff",
          }}
          textStyle={{ fontSize: 13, color: "#006eff" }}
        />
        <AppButton
          onPress={() => {
            setSelectedColor("");
            setSelectedSize("");
            setQuantity(1);
            setTotal(price);
            setIsBuyingNow(true);
            setDialogVisible(true);
          }}
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
      <AddToBagDialogBox
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
        name={name}
        sizes={sizes}
        quantity={quantity}
        setQuantity={setQuantity}
        colors={colors}
        onAddToBag={onAddToBag}
        price={price}
        stock={stock}
        storeId={productData.storeId}
        productId={productData.id}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        total={total}
        setTotal={setTotal}
        isBuyingNow={isBuyingNow}
      />
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
