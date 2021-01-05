import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AppButton from "../AppButton/AppButton";

const AddProductModal = ({ modalVisible, setModalVisible }) => {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "space-evenly",
            alignItems: "center",
            backgroundColor: "#ffffff",
            width: "100%",
          }}
        >
          <View
            style={{
              height: "100%",
              width: "100%",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "30%",
            }}
          >
            <Text>Add Product</Text>
            <View style={{ position: "absolute", top: 10, left: 10 }}>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 35,
                  height: 35,
                  borderRadius: 20,
                  elevation: 2,
                  backgroundColor: "#ff4747",
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <AntDesign name="close" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
          <AppButton
            onPress={() => {
              setModalVisible(false);
            }}
            title={"Add Product"}
            customStyle={{ width: "90%", margin: 10 }}
          />
        </View>
      </Modal>
    </>
  );
};

export default AddProductModal;
