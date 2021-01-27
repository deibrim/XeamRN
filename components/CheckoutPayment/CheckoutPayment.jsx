import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { CreditCardInput } from "react-native-input-credit-card";
import AppButton from "../AppButton/AppButton";
import { styles } from "./styles";

const CheckoutPayment = () => {
  const [isChecked, setChecked] = useState(false);
  const [creditCardInput, setCreditCardInput] = useState({});

  const onChange = (formData) =>
    setCreditCardInput(JSON.stringify(formData, null, " "));
  // const onFocus = (field) => console.log("focusing", field);
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.step}>Step 2</Text>
        <Text style={styles.headText}>Payment</Text>
      </View>
      <ScrollView style={styles.container}>
        <CreditCardInput
          // autoFocus
          requiresName
          requiresCVC
          // requiresPostalCode
          cardScale={1.0}
          labelStyle={styles.label}
          inputStyle={styles.input}
          validColor={"black"}
          invalidColor={"red"}
          placeholderColor={"darkgray"}
          // onFocus={onFocus}
          onChange={onChange}
          contentContainerStyle={{ alignItems: "flex-start" }}
        />
        <View style={styles.checkboxWrapper}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "#006eff" : "#11111189"}
          />
          <Text
            style={[styles.checkboxText, isChecked && { color: "#006eff" }]}
          >
            Save card details
          </Text>
        </View>
        <View style={styles.btnWrapper}>
          <AppButton
            onPress={() => {
              setStep(2);
            }}
            title={"Complete Order"}
            customStyle={styles.btn}
            textStyle={styles.btnTxt}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default CheckoutPayment;
