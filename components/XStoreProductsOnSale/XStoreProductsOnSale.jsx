import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { firestore } from "../../firebase/firebase.utils";
import ProductPreview from "../ProductPreview/ProductPreview";

const XStoreProductsOnSale = ({
  user,
  setLoadingOnSaleProduct,
  setOnSaleProductAvailable,
}) => {
  const [products, setProducts] = useState([]);

  const productRefs = firestore
    .collection("productTimeline")
    .doc(user.id)
    .collection("products");

  useEffect(() => {
    getProductOnSaleFromTimeline();
  }, []);

  async function getProductOnSaleFromTimeline() {
    const query = productRefs
      .orderBy("oPrice", "desc")
      .where("oPrice", "!=", 0)
      .limit(3);
    const snapshot = await query.get();
    const productsArr = [];
    if (snapshot.size > 0) {
      setOnSaleProductAvailable(true);
      snapshot.docs.forEach((doc) => {
        productsArr.push(doc.data());
      });
      setProducts(productsArr);
      setLoadingOnSaleProduct(false);
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

export default XStoreProductsOnSale;
