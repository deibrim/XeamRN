import { Fontisto, Ionicons, Entypo, Feather } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import SettingsItemWrapper from "../components/SettingsItemWrapper/SettingsItemWrapper";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function SettingsScreen() {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="ios-arrow-back"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.title}>Settings</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View
        contentContainerStyle={{ width: "100%", alignItems: "center" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.container}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
          <SettingsItemWrapper
            title={"Tv Account"}
            description={"Entertain your viewers "}
            icon={<Feather name="tv" size={20} color="white" />}
            onPress={() => navigation.navigate("EditChatScreen")}
          />
          <SettingsItemWrapper
            title={"Store Account"}
            description={"Sell your product with ease"}
            icon={<Fontisto name="shopping-store" size={20} color="white" />}
            onPress={() => navigation.navigate("EditChatScreen")}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GENERAL SETTINGS</Text>
          <SettingsItemWrapper
            title={"Chat"}
            description={"Customize your chat room"}
            icon={<Ionicons name="ios-chatboxes" size={20} color="white" />}
            onPress={() => navigation.navigate("EditChatScreen")}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MISCELLANEOUS</Text>
          <SettingsItemWrapper
            title={"Bug report"}
            description={"Report bug very simply"}
            icon={<Entypo name="bug" size={20} color="white" />}
            onPress={() => navigation.navigate("ReportBugcreen")}
            backgroundColor={"gray"}
          />
          <SettingsItemWrapper
            title={"Share the app"}
            description={"Share this app with your friends"}
            icon={<Feather name="share-2" size={20} color="white" />}
            onPress={() => navigation.navigate("ShareAppScreen")}
          />
        </View>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#ecf2fa",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ecf2fa",
    justifyContent: "space-between",
    elevation: 4,
  },
  title: {
    color: "#42414C",
    fontSize: 18,
    marginBottom: 1,
  },
  section: {
    marginVertical: 20,
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  sectionTitle: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    fontSize: 15,
    textAlign: "left",
    marginBottom: 10,
    fontWeight: "bold",
    color: "gray",
  },
  copyright: {
    position: "absolute",
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    bottom: 30,
  },
});
