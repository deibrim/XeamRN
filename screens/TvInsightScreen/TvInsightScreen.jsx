import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";
import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import InsightBox from "../../components/InsightBox/InsightBox";
import { styles } from "./styles";

const TvInsightScreen = () => {
  const navigation = useNavigationState();

  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="ios-arrow-back"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.title}>Tv Insight</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.container}>
        <View
          style={{ alignItems: "center", width: "100%", marginVertical: 20 }}
        >
          <LineChart
            data={{
              labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={Dimensions.get("screen").width - 20}
            height={220}
            chartConfig={{
              backgroundColor: "#006eff",
              backgroundGradientFrom: "#227FFB",
              backgroundGradientTo: "#609FF3",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <InsightBox
            icon={<AntDesign name={"heart"} size={30} color={"#006eff"} />}
            title={"Total Likes"}
            value={"0"}
            width={Dimensions.get("screen").width / 2 - 14}
          />
          <InsightBox
            icon={<MaterialIcons name="visibility" size={30} color="#006eff" />}
            title={"Total Views"}
            value={"0"}
            width={Dimensions.get("screen").width / 2 - 14}
          />
          <InsightBox
            icon={<MaterialIcons name="visibility" size={30} color="#006eff" />}
            title={"Total Visits"}
            value={"0"}
            width={Dimensions.get("screen").width - 20}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default TvInsightScreen;
