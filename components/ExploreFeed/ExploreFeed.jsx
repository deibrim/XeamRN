import { Feather } from "@expo/vector-icons";
import React from "react";
import { Dimensions, FlatList, ScrollView, Text, View } from "react-native";
import TrendingReelPreview from "../TrendingReelPreview/TrendingReelPreview";
import { styles } from "./styles";

const ExploreFeed = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.sectionTitle}>Top Trending</Text>
        </View>
        <FlatList
          contentContainerStyle={{}}
          style={{ paddingLeft: 10 }}
          snapToInterval={Dimensions.get("screen").width}
          snapToAlignment={"center"}
          decelerationRate={"fast"}
          showsHorizontalScrollIndicator={true}
          horizontal
          data={["", ""]}
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
      </View>
      <View style={styles.section}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.sectionTitle}>Ongoing Giveaways</Text>
        </View>
        <FlatList
          contentContainerStyle={{}}
          style={{ paddingLeft: 10 }}
          snapToInterval={Dimensions.get("screen").width}
          snapToAlignment={"center"}
          decelerationRate={"fast"}
          showsHorizontalScrollIndicator={true}
          horizontal
          data={["", ""]}
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
      </View>
    </ScrollView>
  );
};

export default ExploreFeed;
