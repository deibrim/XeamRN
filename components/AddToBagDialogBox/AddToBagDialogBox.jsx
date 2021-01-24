import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import Dialog from "react-native-popup-dialog";
import AppButton from "../AppButton/AppButton";
import { styles } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import CustomPopUp from "../CustomPopUp/CustomPopUp";
import { setCurrentOrder } from "../../redux/shopping/actions";

const AddToBagDialogBox = ({
  dialogVisible,
  setDialogVisible,
  name,
  sizes,
  quantity,
  setQuantity,
  colors,
  onAddToBag,
  price,
  stock,
  storeId,
  productId,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  total,
  setTotal,
  isBuyingNow,
}) => {
  const user = useSelector((state) => state.user.currentUser);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const buyNow = () => {
    setErrorMessage("");
    const id = uuidv4().split("-").join("");
    if (quantity <= 0) {
      setErrorMessage(`Quantity can't be less than 1`);
      return;
    }
    if (sizes.length && selectedSize.trim() === "") {
      setErrorMessage(`Please select a size`);
      return;
    }
    if (colors.length && selectedColor.trim() === "") {
      setErrorMessage(`Please select a color`);
      return;
    }
    const productInfo = {
      productId,
      name,
      total: quantity * price,
      price,
      quantity,
      storeId,
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
    setDialogVisible(false);
    dispatch(setCurrentOrder(data));
    navigation.navigate("CheckoutScreen");
    setErrorMessage("");
  };
  return (
    <Dialog
      visible={dialogVisible}
      onTouchOutside={() => {
        setDialogVisible(false);
      }}
      width={0.9}
    >
      <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
        <View style={{ minHeight: 100 }}>
          <View style={styles.customDialogTitle}>
            <Text
              style={[
                styles.username,
                {
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "bold",
                },
              ]}
            >
              ADD TO BAG
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              paddingBottom: 10,
            }}
          >
            {errorMessage !== "" ? (
              <CustomPopUp
                message={`${errorMessage}`}
                type={"error"}
                customStyles={styles.customErrorStyle}
                customTextStyles={styles.customErrorTextStyles}
              />
            ) : null}
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
                  SELECT SIZE
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
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedSize(item);
                      }}
                      style={[
                        {
                          marginRight: 10,
                          marginVertical: 5,
                          padding: 1,
                        },
                        selectedSize === item && {
                          borderWidth: 3,
                          borderColor: "#006eff",
                          borderRadius: 12,
                          marginTop: 0,
                        },
                      ]}
                    >
                      <View key={index} style={[styles.sizeBox]}>
                        <Text style={{ fontSize: 16 }}>{item}</Text>
                      </View>
                    </TouchableOpacity>
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
                  SELECT COLOR
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
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedColor(item);
                      }}
                      style={[
                        {
                          marginRight: 10,
                          marginVertical: 5,
                          borderRadius: 25,
                        },
                        selectedColor === item && {
                          borderWidth: 3,
                          borderColor: "#006eff",
                          padding: 2,
                        },
                      ]}
                    >
                      <View
                        key={index}
                        style={{
                          height: 35,
                          width: 35,
                          borderRadius: 25,
                          backgroundColor: item,
                          elevation: 2,
                          alignItems: "center",
                          justifyContent: "center",

                          position: "relative",
                        }}
                      ></View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <View style={[styles.infoSections, { flexDirection: "column" }]}>
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
                  QUANTITY
                </Text>
                <View style={styles.quantitySelectorContainer}>
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder=""
                    placeholderTextColor="#000000"
                    keyboardType={"number-pad"}
                    autoFocus={true}
                    maxLength={stock}
                    onFocus={() => quantity === 0 && setQuantity(1 * 1)}
                    onChangeText={(e) => {
                      setTotal(price * e);
                      setQuantity(e * 1);
                    }}
                    value={quantity * 1}
                  />
                </View>
              </View>
              <View style={[styles.infoSections, { flexDirection: "column" }]}>
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
                  TOTAL
                </Text>
                <View
                  style={{
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      letterSpacing: 1,
                    }}
                  >
                    {total}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingBottom: 10,
            }}
          >
            <AppButton
              onPress={() => {
                setDialogVisible(false);
              }}
              title={"Cancel"}
              customStyle={{
                marginVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "#ffffff",
              }}
              textStyle={{ fontSize: 13, color: "#ff0000" }}
            />
            {isBuyingNow ? (
              <AppButton
                onPress={() => {
                  buyNow();
                }}
                title={"Buy now"}
                customStyle={{ marginVertical: 10, paddingHorizontal: 20 }}
                textStyle={{ fontSize: 13 }}
              />
            ) : (
              <AppButton
                onPress={() => {
                  onAddToBag();
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
                  marginVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: "#ffffff",
                }}
                textStyle={{ fontSize: 13, color: "#006eff" }}
              />
            )}
          </View>
        </View>
      </View>
    </Dialog>
  );
};

export default AddToBagDialogBox;

{
  /* <View style={styles.quantitySelectorButtons}>
<AppButton
    onPress={() => {
    let quant = quantity * 1;
    quantity <= stock && setQuantity(quant++);
    }}
    customStyle={styles.quantitySelectorButton}
    iconComponent={
    <Ionicons name="add-outline" size={20} color="black" />
    }
/>
<AppButton
    onPress={() => {
    let quant = quantity * 1;
    quantity > 0 && setQuantity(quant--);
    }}
    customStyle={styles.quantitySelectorButton}
    iconComponent={
    <Ionicons
        name="md-remove-outline"
        size={24}
        color="black"
    />
    }
/>
</View> */
}
