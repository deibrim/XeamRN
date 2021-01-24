import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CheckoutOrderSuccessful from "../../components/CheckoutOrderSuccessful/CheckoutOrderSuccessful";
import CheckoutPayment from "../../components/CheckoutPayment/CheckoutPayment";
import CheckoutShippingForm from "../../components/CheckoutShippingForm/CheckoutShippingForm";
import { styles } from "./styles";

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [dialogVisible, setDialogVisible] = useState(true);
  const navigate = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else {
      navigation.goBack();
    }
  };
  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigate()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="ios-arrow-back" size={24} color="black" />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Checkout</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 20,
              marginLeft: 5,
              elevation: 2,
              backgroundColor: "#ffffff",
            }}
            onPress={() => {}}
          >
            <Feather name="more-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.path}>
          <View style={step >= 1 && styles.icon}>
            <Feather name="map-pin" size={20} color="black" />
          </View>
          <View
            style={[styles.line, step > 1 && { backgroundColor: "#006eff" }]}
          ></View>
          <View style={step >= 2 && styles.icon}>
            <Octicons name="credit-card" size={20} color="black" />
          </View>
          <View
            style={[styles.line, step > 2 && { backgroundColor: "#006eff" }]}
          ></View>
          <View style={step >= 3 && styles.icon}>
            <Feather name="check-circle" size={20} color="black" />
          </View>
        </View>
        {step === 1 ? <CheckoutShippingForm setStep={setStep} /> : null}
        {step === 2 ? <CheckoutPayment setStep={setStep} /> : null}
        {step === 3 ? (
          <CheckoutOrderSuccessful
            setStep={setStep}
            dialogVisible={dialogVisible}
            setDialogVisible={setDialogVisible}
          />
        ) : null}
      </View>
    </>
  );
};

export default CheckoutScreen;
