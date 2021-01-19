import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, ScrollView, Text, View } from "react-native";
import TrendingReelPreview from "../TrendingReelPreview/TrendingReelPreview";
import { firestore } from "../../firebase/firebase.utils";
import { styles } from "./styles";

const ExploreFeedTopTrending = ({
  loadingTopTrending,
  setLoadingTopTrending,
  setTopTrendingAvailable,
}) => {
  const [currentReel, setCurrentReel] = useState({});
  const [reels, setReels] = useState([]);
  const date = new Date();

  const first = date.getDate() - date.getDay();

  const firstDayOfTheWeek = Date.parse(
    new Date(date.setDate(first)).toLocaleString()
  );

  useEffect(() => {
    getTopTrending();
  }, []);

  async function getTopTrending() {
    setLoadingTopTrending(true);
    const productRefs = await firestore
      .collection("allReels")
      .orderBy("posted_at")
      .where("posted_at", ">", firstDayOfTheWeek)
      .limit(10);
    const snapshot = await productRefs.get();
    if (snapshot.size > 0) {
      setTopTrendingAvailable(true);
      const productsArr = [];
      snapshot.docs.forEach((doc) => {
        productsArr.push(doc.data());
      });
      setReels(productsArr);
      setLoadingTopTrending(false);
    } else {
      setLoadingTopTrending(false);
    }
  }
  const onViewRef = useRef(({ viewableItems, changed }) => {
    const data = {
      isViewable: viewableItems[0].isViewable,
      index: viewableItems[0].index,
    };
    setCurrentReel(data);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  return (
    <FlatList
      contentContainerStyle={{}}
      style={{ paddingLeft: 10 }}
      snapToInterval={Dimensions.get("screen").width}
      snapToAlignment={"center"}
      decelerationRate={"fast"}
      showsHorizontalScrollIndicator={true}
      onViewableItemsChanged={onViewRef.current}
      viewabilityConfig={viewConfigRef.current}
      horizontal
      data={reels}
      initialScrollIndex={0}
      initialNumToRender={3}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <TrendingReelPreview
          index={index}
          data={item}
          currentReel={currentReel}
          customStyles={{
            width: Dimensions.get("screen").width - 20,
            margin: 0,
          }}
        />
      )}
    />
  );
};

export default ExploreFeedTopTrending;
