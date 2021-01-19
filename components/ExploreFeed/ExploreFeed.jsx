// import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, FlatList, ScrollView, Text, View } from "react-native";
import ExploreFeedOngoingGiveaway from "../ExploreFeedOngoingGiveaway/ExploreFeedOngoingGiveaway";
import ExploreFeedTopTrending from "../ExploreFeedTopTrending/ExploreFeedTopTrending";
// import TrendingReelPreview from "../TrendingReelPreview/TrendingReelPreview";
import { styles } from "./styles";

const ExploreFeed = () => {
  const [loadingTopTrending, setLoadingTopTrending] = useState(true);
  const [topTrendingAvailable, setTopTrendingAvailable] = useState(false);
  const [loadingOngoingGiveaway, setLoadingOngoingGiveaway] = useState(false);
  const [isGiveawayAvailable, setIsGiveawayAvailable] = useState(false);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        {topTrendingAvailable ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.sectionTitle}>Top Trending</Text>
          </View>
        ) : null}
        <ExploreFeedTopTrending
          loadingTopTrending={loadingTopTrending}
          setLoadingTopTrending={setLoadingTopTrending}
          setTopTrendingAvailable={setTopTrendingAvailable}
        />
      </View>
      <View style={styles.section}>
        {isGiveawayAvailable ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.sectionTitle}>Ongoing Giveaways</Text>
          </View>
        ) : null}
        <ExploreFeedOngoingGiveaway
          loadingOngoingGiveaway={loadingOngoingGiveaway}
          setLoadingOngoingGiveaway={setLoadingOngoingGiveaway}
          setIsGiveawayAvailable={setIsGiveawayAvailable}
        />
      </View>
    </ScrollView>
  );
};

export default ExploreFeed;
