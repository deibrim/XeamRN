import React from "react";
import { Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import StatFilterButtons from "../StatFilterButtons/StatFilterButtons";

const Graph = ({ Dimensions, filter, setFilter, title }) => {
  return (
    <View style={{ alignItems: "center", width: "100%" }}>
      <View
        style={{
          backgroundColor: "#609FF3",
          borderRadius: 16,
        }}
      >
        <View
          style={{
            width: "100%",
            padding: 20,
            paddingBottom: 0,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              {title}
            </Text>
            <View
              style={{
                backgroundColor: "green",
                borderRadius: 10,
                paddingHorizontal: 5,
                paddingVertical: 2,
                marginLeft: 5,
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              >
                {" + 20% "}
              </Text>
            </View>
          </View>
          <StatFilterButtons
            filter={filter}
            setFilter={setFilter}
            styl={{
              flexDirection: "row",
              height: 65,
              paddingVertical: 10,
            }}
          />
        </View>
        <LineChart
          data={{
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [
              {
                data: [100, 0, 0, 0, 0, 0, 0],
              },
            ],
          }}
          width={Dimensions.get("screen").width - 20}
          height={200}
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
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );
};

export default Graph;
