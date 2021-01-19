import React, { useEffect, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import { firestore } from "../../firebase/firebase.utils";
import RecommendedStorePreview from "../RecommendedStorePreview/RecommendedStorePreview";

const XStoreRecommendedStore = ({ user, setLoadingRecommendedStores }) => {
  const [recommendedStores, setRecommendedStores] = useState([]);

  const storeRefs = firestore.collection("xeamStores");

  useEffect(() => {
    getTopSellingProductFromTimeline();
  }, []);

  async function getTopSellingProductFromTimeline() {
    storeRefs.where("id", "!=", `${user.id}`).limit(3);
    const snapshot = await storeRefs.get();
    const storesArr = [];
    if (snapshot.size > 0) {
      snapshot.docs.forEach((doc) => {
        storesArr.push(doc.data());
      });
      setRecommendedStores(storesArr);
      setLoadingRecommendedStores(false);
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
      data={recommendedStores}
      initialScrollIndex={0}
      initialNumToRender={3}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        // item.id !== user.id &&
        <RecommendedStorePreview data={item} />
      )}
    />
  );
};

export default XStoreRecommendedStore;
