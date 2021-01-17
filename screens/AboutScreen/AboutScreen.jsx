import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

import { useNavigation } from "@react-navigation/native";

import styles from "./styles";
import AboutInfoContaineer from "../../components/AboutInfoContaineer/AboutInfoContaineer";

const AboutScreen = () => {
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
        <Text style={{ ...styles.title, fontSize: 14 }}>About Xeam</Text>
      </View>
      <View style={styles.container}>
        <AboutInfoContaineer title={"The Company"} />
        <AboutInfoContaineer title={"Community Guildline"} />
        <AboutInfoContaineer title={"Privacy Policy"} />
        <AboutInfoContaineer title={"Copywrite Policy"} />
        <View style={styles.copyright}>
          <Text style={{ color: "gray", fontSize: 16, marginBottom: 10 }}>
            Xeam-Beta v1.0
          </Text>
          <Text style={{ color: "gray", fontSize: 16, marginBottom: 5 }}>
            From
          </Text>
          <Text style={{ color: "#006eff", fontSize: 16, fontWeight: "bold" }}>
            Xeam
          </Text>
        </View>
      </View>
    </>
  );
};

export default AboutScreen;
