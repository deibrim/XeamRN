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
    .collection("productTimeline")
    .doc(user.id)
    .collection("products");

  useEffect(() => {
    getNewlyAddedProductFromTimeline();
  }, []);

  async function getNewlyAddedProductFromTimeline() {
    const query = productRefs.orderBy("timestamp", "asc").limit(5);
    const snapshot = await query.get();
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
