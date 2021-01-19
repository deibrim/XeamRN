import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, ScrollView, Text, View } from "react-native";
import TrendingReelPreview from "../TrendingReelPreview/TrendingReelPreview";
import { firestore } from "../../firebase/firebase.utils";
import { styles } from "./styles";

const ExploreFeedOngoingGiveaway = ({
  loadingOngoingGiveaway,
  setLoadingOngoingGiveaway,
  setIsGiveawayAvailable,
}) => {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    getOngoingGiveaway();
  }, []);

  async function getOngoingGiveaway() {
    setLoadingOngoingGiveaway(true);
    const productRefs = await firestore
      .collection("allReels")
      .orderBy("type", "asc")
      .where("type", ">=", "giveaway")
      // .where("end_at", ">", Date.now())
      .limit(10);
    const snapshot = await productRefs.get();
    if (snapshot.size > 0) {
      setIsGiveawayAvailable(true);
      const productsArr = [];
      snapshot.docs.forEach((doc) => {
        productsArr.push(doc.data());
      });
      setReels(productsArr);
      setLoadingOngoingGiveaway(false);
    } else {
      setLoadingOngoingGiveaway(false);
    }
  }
  return (
    <FlatList
      contentContainerStyle={{}}
      style={{ paddingLeft: 10 }}
      snapToInterval={Dimensions.get("screen").width}
      snapToAlignment={"center"}
      decelerationRate={"fast"}
      showsHorizontalScrollIndicator={true}
      horizontal
      data={reels}
      initialScrollIndex={0}
      initialNumToRender={3}
      keyExtractor={(item, index) => index.toString()}
      renderItem={(item) => (
        <TrendingReelPreview
          data={item.item}
          customStyles={{
            width: Dimensions.get("screen").width - 20,
            // paddingHorizontal: 8,
            margin: 0,
          }}
        />
      )}
    />
  );
};

export default ExploreFeedOngoingGiveaway;
