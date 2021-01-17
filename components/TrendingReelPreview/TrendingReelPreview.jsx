import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, Image, Text } from "react-native";
import { styles } from "./styles";

export default function TrendingReelPreview({ customStyles }) {
  return (
    <>
      <View style={[styles.reelCard, { ...customStyles }]}>
        <Image
          style={styles.reelCardImage}
          source={require("../../assets/cwall/9.jpg")}
        />
        {/* <View style={styles.userAddReel}>
          <AntDesign name="plus" size={24} color="#1777f2" />
        </View> */}
        <View style={styles.reelCardFooter}>
          <Text style={styles.reelCardFooterText}> Reel</Text>
        </View>
      </View>
    </>
  );
}
