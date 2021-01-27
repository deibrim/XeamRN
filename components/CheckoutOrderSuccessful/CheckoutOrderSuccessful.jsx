import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import Dialog from "react-native-popup-dialog";
import AppButton from "../AppButton/AppButton";
import { styles } from "./styles";

const CheckoutOrderSuccessful = ({ dialogVisible, setDialogVisible }) => {
  return (
    <Dialog visible={dialogVisible} width={0.9}>
      <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
        <View style={{ minHeight: 100 }}>
          <View
            style={{
              justifyContent: "center",
              paddingBottom: 10,
            }}
          >
            <View style={styles.icon}>
              <Feather name="check-circle" size={80} color="#006eff" />
            </View>
            <Text style={styles.stongText}>Order Successful</Text>
            <Text style={styles.normalText}>
              Congratulations! your order has been successfull placed
            </Text>
            <Text style={styles.hintText}>
              Within the next 6 hours you should get order confirmation from the
              store or refund
            </Text>
          </View>
          <View style={styles.btnWrapper}>
            <AppButton
              onPress={() => {
                // setDialogVisible(false);
              }}
              title={"Track Order"}
              customStyle={{
                marginVertical: 10,
                paddingHorizontal: 20,
                width: "80%",
              }}
              textStyle={{ fontSize: 13 }}
            />
            <AppButton
              onPress={() => {
                // setDialogVisible(false);
              }}
              title={"Continue Shoping"}
              customStyle={{
                marginVertical: 10,
                paddingHorizontal: 20,
                width: "80%",
                backgroundColor: "#ffffff",
              }}
              textStyle={{ fontSize: 13, color: "#006eff" }}
            />
          </View>
        </View>
      </View>
    </Dialog>
  );
};

export default CheckoutOrderSuccessful;
