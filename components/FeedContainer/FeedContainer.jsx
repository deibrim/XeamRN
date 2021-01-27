import React, { useEffect } from "react";
import { View } from "react-native";
import SkeletonContent from "react-native-skeleton-content";
import ReelPreview from "../ReelPreview/ReelPreview";
import { styles } from "./styles";
const FeedContainer = ({ reels, loading }) => {
  useEffect(() => {
    // getTimeline();
  }, []);
  return (
    <>
      <SkeletonContent
        containerStyle={{
          flex: 1,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexWrap: "wrap",
          paddingHorizontal: 10,
        }}
        isLoading={loading}
        layout={[
          { width: "48%", height: 220, marginTop: 6 },
          { width: "48%", height: 220, marginTop: 6 },
          { width: "48%", height: 220, marginTop: 6 },
          { width: "48%", height: 220, marginTop: 6 },
        ]}
      ></SkeletonContent>
      <View style={styles.listReels}>
        {reels.length
          ? reels.map((item, index) => (
              <ReelPreview
                key={index}
                data={{ ...item, index }}
                reels={reels}
              />
            ))
          : null}
      </View>
    </>
  );
};

export default FeedContainer;
