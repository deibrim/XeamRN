import React from "react";
import { View } from "react-native";
import AppButton from "../../components/AppButton/AppButton";
import { styles } from "./styles";
const StatFilterButtons = ({ filter, setFilter, styl }) => {
  return (
    <View style={styl}>
      <AppButton
        title={"This Week"}
        customStyle={
          filter === "thisWeek"
            ? { ...styles.btn, backgroundColor: "#ffffff", marginRight: 10 }
            : {
                ...styles.btn,
                backgroundColor: "#ecf2fa",
                elvation: 5,
                marginRight: 10,
              }
        }
        textStyle={{ fontSize: 12, color: "#006eff" }}
        onPress={() => {
          setFilter("thisWeek");
        }}
      />
      <AppButton
        title={"This Month"}
        customStyle={
          filter === "thisMonth"
            ? { ...styles.btn, backgroundColor: "#ffffff" }
            : { ...styles.btn, backgroundColor: "#ecf2fa", elvation: 5 }
        }
        textStyle={{ fontSize: 12, color: "#006eff" }}
        onPress={() => {
          setFilter("thisMonth");
        }}
      />
    </View>
  );
};

export default StatFilterButtons;
