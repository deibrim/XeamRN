import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import Checkbox from "expo-checkbox";
import AppButton from "../AppButton/AppButton";
import CustomPopUp from "../CustomPopUp/CustomPopUp";
import { styles } from "./styles";

const CheckoutShippingForm = ({ setStep }) => {
  const [isChecked, setChecked] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const onProceedToPayment = () => {
    if (name.trim() === "") {
      setMessage({ type: "error", text: "Name is required" });
      return;
    } else if (address.trim() === "") {
      setMessage({ type: "error", text: "Address is required" });
      return;
    } else if (country.trim() === "") {
      setMessage({ type: "error", text: "Country is required" });
      return;
    } else if (city.trim() === "") {
      setMessage({ type: "error", text: "City is required" });
      return;
    } else if (zip.trim() === "") {
      setMessage({ type: "error", text: "Zip Code is required" });
      return;
    } else {
      setStep(2);
    }
  };
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.step}>Step 1</Text>
        <Text style={styles.headText}>Shipping</Text>
      </View>
      {message.type !== "" ? (
        <CustomPopUp
          message={
            message.type === "success" ? `${message.text}` : `${message.text}`
          }
          type={"success"}
          customStyles={
            message.type === "success"
              ? {
                  ...styles.customMessageStyle,
                  backgroundColor: "green",
                }
              : {
                  ...styles.customMessageStyle,
                  backgroundColor: "red",
                }
          }
          customTextStyles={styles.customMessageTextStyles}
        />
      ) : null}
      <ScrollView style={styles.container}>
        <CustomTextInput
          icon={
            <AntDesign
              style={styles.inputGroupIcon}
              name="user"
              size={24}
              color="black"
            />
          }
          onChangeText={(e) => {
            setName(e);
          }}
          value={name}
          title={"Your Name"}
          isFullWidth={true}
        />
        <CustomTextInput
          icon={
            <Feather
              name="map-pin"
              style={styles.inputGroupIcon}
              size={24}
              color="black"
            />
          }
          onChangeText={(e) => {
            setAddress(e);
          }}
          value={address}
          title={"Your Address"}
          isFullWidth={true}
        />
        <CustomTextInput
          onChangeText={(e) => {
            setCountry(e);
          }}
          value={country}
          title={"Your Country"}
          isFullWidth={true}
        />
        <View style={styles.row}>
          <CustomTextInput
            onChangeText={(e) => {
              setCity(e);
            }}
            value={city}
            title={"Your City"}
            isFullWidth={false}
          />
          <CustomTextInput
            onChangeText={(e) => {
              setZip(e);
            }}
            value={zip}
            title={"Zip Code"}
            isFullWidth={false}
          />
        </View>
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
            Save shipping details
          </Text>
        </View>
        <View style={styles.btnWrapper}>
          <AppButton
            onPress={() => {
              // onProceedToPayment();
              setStep(2);
            }}
            title={"Continue to Payment"}
            customStyle={styles.btn}
            textStyle={styles.btnTxt}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default CheckoutShippingForm;

function CustomTextInput({ icon, onChangeText, value, title, isFullWidth }) {
  return (
    <View style={styles.inputGroupWrapper}>
      <Text style={[styles.label, !icon && { paddingLeft: 20 }]}>{title}</Text>
      <View style={[styles.inputGroup, !isFullWidth && { width: "100%" }]}>
        {icon}
        <TextInput
          style={[styles.input, !icon && { paddingLeft: 15 }]}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={onChangeText}
          value={value}
        />
      </View>
    </View>
  );
}
