import React from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import { styles } from "./styles";
const AfterReporting = ({ setReported, customText }) => {
  return (
    <>
      <View style={styles.container}>
        <Text
          style={{
            color: "#111111",
            fontSize: 16,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Thanks for reporting this {customText}
        </Text>
        <Text
          style={{
            color: "#666666",
            textAlign: "center",
            paddingBottom: 20,
            marginBottom: 20,
            borderBottomColor: "#555555",
            borderBottomWidth: 1,
          }}
        >
          If you think this account is violating our Community Guideline and
          should be removed, mark this account as inappropriate
        </Text>
        <TouchableWithoutFeedback onPress={() => {}}>
          <Text
            style={{
              color: "#ff4747",

              textAlign: "center",
              paddingVertical: 5,
            }}
          >
            Mark as inappropriate
          </Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            setReported(false);
          }}
        >
          <Text
            style={{
              color: "#006eff",
              textAlign: "center",
              paddingVertical: 5,
            }}
          >
            Show {customText}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

export default AfterReporting;
