import React, { useEffect, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import { firestore } from "../../firebase/firebase.utils";
import TopSellingProductPreview from "../TopSellingProductPreview/TopSellingProductPreview";

const XStoreProductsTopSelling = ({
  user,
  setLoadingTopSelling,
  setTopSellingAvailable,
}) => {
  const [topSelling, setTopSelling] = useState([]);

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
    getTopSellingProductFromTimeline();
  }, []);

  async function getTopSellingProductFromTimeline() {
    const query = productRefs
      .orderBy("orders", "desc")
      .where("orders", ">", "0")
      .limit(1);
    const snapshot = await query.get();
    const productsArr = [];
    if (snapshot.size > 0) {
      setTopSellingAvailable(true);
      snapshot.docs.forEach((doc) => {
        productsArr.push(doc.data());
      });
      setTopSelling(productsArr);
      setLoadingTopSelling(false);
    }
  }
  return (
    <FlatList
      contentContainerStyle={{}}
      style={{}}
      snapToInterval={Dimensions.get("screen").width}
      snapToAlignment={"start"}
      decelerationRate={"fast"}
      showsHorizontalScrollIndicator={true}
      horizontal
      data={topSelling}
      initialScrollIndex={0}
      initialNumToRender={3}
      keyExtractor={(item, index) => index.toString()}
      renderItem={(item) => <TopSellingProductPreview data={item.item} />}
    />
  );
};

export default XStoreProductsTopSelling;
