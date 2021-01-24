import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

const CheckoutPayment = () => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.step}>Step 2</Text>
        <Text style={styles.headText}>Payment</Text>
      </View>
    </>
  );
};

export default CheckoutPayment;
