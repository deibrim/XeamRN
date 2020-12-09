import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import {  Notifications } from "expo";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { firestore } from "../firebase/firebase.utils";
import { useSelector, useDispatch } from "react-redux";
import TrendingReelPreview from "../components/TrendingReelPreview/TrendingReelPreview";
import ReelPreview from "../components/ReelPreview/ReelPreview";
import { setReels } from "../redux/reel/actions";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const reels = useSelector((state) => state.reel.loadedReels);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTimeline();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    enablePushNotifications();
    getTimeline();
  }, []);
  async function askPermissions() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return false;
    }
    return true;
  }

  async function registerForPushNotifications() {
    const enabled = await askPermissions();
    if (!enabled) {
      return Promise.resolve();
    }
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    return token;
  }
  async function enablePushNotifications() {
    let token = await registerForPushNotifications();
    if (token) {
      firestore.doc(`users/${user.id}`).update({ push_token: token });
    }
  }

  function getTimeline() {
    setLoading(true);
    const reelRef = firestore
      .collection("timeline")
      .doc(`${user.id}`)
      .collection("timelineReels")
      .orderBy("posted_at", "desc");
    reelRef.onSnapshot((snapshot) => {
      const reelsArr = [];
      snapshot.docs.forEach((doc) => {
        reelsArr.push(doc.data());
      });
      dispatch(setReels(reelsArr));
      setLoading(false);
    });
  }
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("CameraScreen")}>
          <Feather name="video" size={26} color="gray" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {" "}
          Hi,{" "}
          <Text style={{ color: "#006aff", fontWeight: "bold" }}>
            {user.name && user.name.split(" ")[0]}
          </Text>
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <View style={styles.imageContainer}>
              <Image
                style={styles.profilePic}
                source={{
                  uri: user.profile_pic,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ width: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.container}
      >
        <View style={styles.trendSection}>
          <Text style={styles.sectionTitle}>🔥 Reels 🔥</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingLeft: 11 }}
          >
            <TrendingReelPreview />
            <TrendingReelPreview />
          </ScrollView>
        </View>
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Reels</Text>
          {loading && (
            <View
              style={{
                flex: 1,
                minHeight: 100,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
              <Image
                style={{ marginLeft: 5, width: 30, height: 30 }}
                source={require("../assets/loader.gif")}
              />
            </View>
          )}
          <View style={styles.listReels}>
            {reels.map((item, index) => (
              <ReelPreview
                key={index}
                data={{ ...item, index }}
                reels={reels}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf2fa",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 10,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ecf2fa",
    justifyContent: "space-between",
    elevation: 4,
  },
  title: {
    fontSize: 16,
  },
  imageContainer: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#006aff",
  },
  profilePic: {
    width: 28,
    height: 28,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#797a7a",
    paddingLeft: 10,
  },
  trendSection: {
    marginTop: 20,
    // paddingLeft: 10,
  },
  recentSection: { marginVertical: 20, paddingHorizontal: 0 },
  listReels: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
});
