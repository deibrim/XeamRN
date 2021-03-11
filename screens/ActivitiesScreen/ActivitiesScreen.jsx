// import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { firestore } from "../../firebase/firebase.utils";
import { toggleHasNoty } from "../../redux/user/actions";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function ActivitiesScreen() {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const [activities, setActivities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getActivityFeed();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getActivityFeed();
  }, []);
  async function getActivityFeed() {
    setLoading(true);
    const activityFeedRef = await firestore
      .collection("activity_feed")
      .doc(user.id)
      .collection("feedItems")
      .orderBy("timestamp", "desc")
      .limit(20);
    activityFeedRef.onSnapshot((snapshot) => {
      const activitiesArr = [];
      snapshot.docs.forEach((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
        };
        activitiesArr.push(data);
      });
      setActivities(activitiesArr);
      setLoading(false);
    });
  }

  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>Activities</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ width: "100%", alignItems: "center" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.container}
      >
        {loading && (
          <View
            style={{
              flex: 1,
              minHeight: 150,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{ marginLeft: 5, width: 30, height: 30 }}
              source={require("../assets/loader.gif")}
            />
          </View>
        )}
        <View>
          {activities.map((item, index) => (
            <ActivityPreview key={index} item={item} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}
function ActivityPreview({ item }) {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  !item.viewed && onView();

  async function onView() {
    await firestore
      .collection("activity_feed")
      .doc(user.id)
      .collection("feedItems")
      .doc(item.id)
      .update({ viewed: true });
    dispatch(toggleHasNoty(false));
  }
  return (
    <TouchableOpacity
      onPress={() => {
        item.type === "follow" &&
          navigation.navigate("UserProfileScreen", {
            userId: item.userId,
          });
      }}
      style={{
        width: "100%",
        marginVertical: 5,
      }}
    >
      <View
        // key={index}
        style={{
          flexDirection: "row",
          height: 80,
          width: "100%",
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          paddingHorizontal: 20,
          backgroundColor: !item.viewed ? "#006eff22" : "white",
        }}
      >
        <Image
          style={{
            width: 50,
            height: 50,
            resizeMode: "cover",
            borderRadius: 50,
            borderWidth: 2,
            borderColor: "#fff",
            marginRight: 10,
          }}
          source={{ uri: `${item.userProfileImg}` }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {item.username}{" "}
            <Text style={{ fontWeight: "400", fontSize: 14 }}>
              {item.type === "follow"
                ? "started following you"
                : item.type === "tvFollow"
                ? "started following your tv"
                : item.type === "storeFollow"
                ? "started following your store"
                : item.type === "like"
                ? "like your reel"
                : "commented on your reel"}
            </Text>
          </Text>
          <Text style={{ color: "gray" }}>
            {moment(item.timestamp).fromNow()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf2fa",
    paddingTop: 5,
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
});
