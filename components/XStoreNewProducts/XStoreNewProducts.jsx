import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { firestore } from "../../firebase/firebase.utils";
import ProductPreview from "../ProductPreview/ProductPreview";

const XStoreNewProducts = ({
  user,
  setLoadingNewProduct,
  setNewProductAvailable,
}) => {
  const [products, setProducts] = useState([]);

  const date = new Date();

  const first = date.getDate() - date.getDay();

  const firstDayOfTheWeek = Date.parse(
    new Date(date.setDate(first)).toLocaleString()
  );
  const productRefs = firestore
    .collection("xeamStoreTimeline")
    .doc(user.id)
    .collection("timelineProducts");

  useEffect(() => {
    getNewlyAddedProductFromTimeline();
  }, []);

  async function getNewlyAddedProductFromTimeline() {
    productRefs.orderBy("timestamp", "desc").limit(3);
    const snapshot = await productRefs.get();
    const productsArr = [];
    if (snapshot.size > 0) {
      setNewProductAvailable(true);
      snapshot.docs.forEach((doc) => {
        productsArr.push(doc.data());
      });
      setProducts(productsArr);
      setLoadingNewProduct(false);
    }
  }
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ paddingHorizontal: 10 }}
    >
      {products.map((item, index) => (
        <ProductPreview key={index} data={item} />
      ))}
      <View style={{ width: 10 }}></View>
    </ScrollView>
  );
};

export default XStoreNewProducts;
