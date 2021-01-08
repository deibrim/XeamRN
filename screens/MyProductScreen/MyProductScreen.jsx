import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import AddProductModal from "../../components/AddProductModal/AddProductModal";
import MyProductPreview from "../../components/MyProductPreview/MyProductPreview";
import { styles } from "./styles";

const MyProductScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const xStore = useSelector((state) => state.user.currentUserXStore);
  const navigation = useNavigation();
  const [loadingProducts, setLoadingProducts] = true;
  const [products, setProducts] = useState([
    // {
    //   name: 'Nike Adapt BB 2.0 "Tie-Dye" Basketball Shoe',
    //   price: 350,
    //   images: [
    //     "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-9cfea66d-b519-4b29-8e43-ce4164e8c558/adapt-bb-2-tie-dye-basketball-shoe-vdFwKS.jpg",
    //   ],
    // },
    // {
    //   name: "Nike Joyride",
    //   price: 400,
    //   images: [
    //     "https://static.nike.com/a/images/w_1536,c_limit/9de44154-c8c3-4f77-b47e-d992b7b96379/image.jpg",
    //   ],
    // },
  ]);
  useEffect(() => {
    getProducts();
  }, []);
  async function getProducts() {
    // setLoadingProducts(true);
    const productRefs = await firestore
      .collection("products")
      .doc(xStore.id)
      .collection("my_products")
      .orderBy("orders")
      .limit(10);
    const snapshot = await productRefs.get();
    const productsArr = [];
    snapshot.docs.forEach((doc) => {
      console.log(doc.data());
      productsArr.push(doc.data());
    });
    setProducts(productsArr);
    setLoadingProducts(false);
  }

  return (
    <>
      <AddProductModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="ios-arrow-back"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.title}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={{ ...styles.title, fontSize: 14 }}>My Products</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 13,
            color: "#111111",
            marginBottom: 10,
          }}
        >
          PRODUCT OVERVIEW
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginBottom: 85,
          }}
        >
          {products.map((item, index) => (
            <MyProductPreview key={index} data={item} />
          ))}
        </View>
      </ScrollView>
      {addProduct(setModalVisible)}
    </>
  );
};

export default MyProductScreen;

function addProduct(setModalVisible) {
  return (
    <View
      style={{
        height: 80,
        width: "100%",
        position: "absolute",
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          height: 50,
          width: "90%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#ffffff",
          elevation: 5,
          borderRadius: 25,
          paddingHorizontal: 20,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: "#444444", fontSize: 16 }}>Add Product</Text>
        <View
          style={{
            height: 25,
            width: 25,
            backgroundColor: "#006eff",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
          }}
        >
          <Entypo name="plus" size={20} color="#ffffff" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
