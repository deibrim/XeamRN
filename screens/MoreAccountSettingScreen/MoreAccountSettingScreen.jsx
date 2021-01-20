import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

import { useNavigation } from "@react-navigation/native";

import styles from "./styles";
import DeleteAccountsContainer from "../../components/DeleteAccountsContainer/DeleteAccountsContainer";
import ChangePasswordContainer from "../../components/ChangePasswordContainer/ChangePasswordContainer";

const MoreAccountSettingScreen = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  const navigation = useNavigation();

  useEffect(() => {}, []);
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
              <Text style={styles.title}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={{ ...styles.title, fontSize: 14 }}>More settings</Text>
      </View>
      <View style={styles.container}>
        {/* 
          Change password
          security
          privacy
          purge account
           */}
        <ChangePasswordContainer />
        <DeleteAccountsContainer />
      </View>
    </>
  );
};

export default MoreAccountSettingScreen;
