import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
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
import SkeletonContent from "react-native-skeleton-content";
import { SwipeablePanel } from "rn-swipeable-panel";
import { firestore } from "../firebase/firebase.utils";
import { useSelector, useDispatch } from "react-redux";
import TrendingReelPreview from "../components/TrendingReelPreview/TrendingReelPreview";
import ReelPreview from "../components/ReelPreview/ReelPreview";
import { setReels } from "../redux/reel/actions";
import { setCurrentChannel, setPrivateChannel } from "../redux/chat/actions";
import SwipeablePanelContent from "../components/SwipeablePanelContent/SwipeablePanelContent";
import { toggleShowBottomNavbar } from "../redux/settings/actions";
import AddProductModal from "../components/AddProductModal/AddProductModal";
import StoriesPreviewContainer from "../components/StoriesPreviewContainer/StoriesPreviewContainer";
import FeedContainer from "../components/FeedContainer/FeedContainer";
import StoriesViewModal from "../components/StoriesViewModal/StoriesViewModal";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default React.memo(function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [hasTimeline, setHasTimeline] = useState(true);
  const user = useSelector((state) => state.user.currentUser);
  const reels = useSelector((state) => state.reel.loadedReels);
  const dispatch = useDispatch();
  const responseListener = useRef();
  const navigation = useNavigation();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // getTimeline();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    getFollowing(user.id);
    enablePushNotifications();
    // getTimeline();
    listenForPushNotifications();
    listenForPushNotificationActions();
    navigation.navigate("HomeScreen");
    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  async function getFollowing(userId) {
    const snapshot = await firestore
      .collection("following")
      .doc(userId)
      .collection("userFollowing")
      .get();
    !snapshot.docs.length && setHasTimeline(false);
  }
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

  async function listenForPushNotificationActions() {
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const chatData = JSON.parse(
          response.notification.request.trigger.remoteMessage.data.body
        );
        if (chatData.chatId) {
          dispatch(
            setCurrentChannel({
              id: chatData.chatId,
              name: chatData.name,
            })
          );
          dispatch(setPrivateChannel(true));
          navigation.navigate("ChatRoom", {
            name: chatData.name,
            id: chatData.id,
            username: chatData.username,
            profile_pic: chatData.profile_pic,
          });
          return;
        }
        navigation.navigate(
          `${response.notification.request.trigger.channelId}`
        );
      }
    );
  }
  async function listenForPushNotifications() {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        // console.log(notification);
      }
    );
    return () => subscription.remove();
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
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  // Notifications.getBadgeCountAsync().then((badge) => {
  //   console.log("====================================");
  //   console.log(badge);
  //   console.log("====================================");
  // });

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

  const togglePanel = () => {
    dispatch(toggleShowBottomNavbar(true));
    setIsPanelActive(true);
  };
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={
            () => togglePanel()
            // user.isBusinessAccount
            //   ? togglePanel()
            //   : user.isTvActivated
            //   ? togglePanel()
            //   : navigation.navigate("CameraScreen")
          }
        >
          <Feather name="video" size={26} color="#444444" />
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
        <View style={styles.storiesSection}>
          {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="amp-stories"
              size={22}
              color="#444444"
              style={{ marginBottom: 10, marginLeft: 10 }}
            />
            <Text style={styles.sectionTitle}>Stories</Text>
          </View> */}
          {/* <StoriesPreviewContainer /> */}
          <StoriesViewModal />
        </View>
        {!hasTimeline && (
          <View style={styles.trendSection}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather
                name="trending-up"
                size={22}
                color="#444444"
                style={{ marginBottom: 10, marginLeft: 10 }}
              />
              <Text style={styles.sectionTitle}>Reels</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingLeft: 11 }}
            >
              {/* <TrendingReelPreview />
              <TrendingReelPreview /> */}
            </ScrollView>
          </View>
        )}
        <View style={styles.recentSection}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="timeline-outline"
              size={22}
              color="#444444"
              style={{ marginBottom: 10, marginLeft: 10 }}
            />
            <Text style={styles.sectionTitle}>Feed</Text>
          </View>
          <FeedContainer reels={reels} loading={loading} />
        </View>
      </ScrollView>
      <SwipeablePanel
        fullWidth={true}
        onlySmall={true}
        onClose={() => {
          dispatch(toggleShowBottomNavbar(false));
          setIsPanelActive(false);
        }}
        onPressCloseButton={() => {
          dispatch(toggleShowBottomNavbar(false));
          setIsPanelActive(false);
        }}
        isActive={isPanelActive}
        style={{ backgroundColor: "#ecf2fa" }}
        closeOnTouchOutside={true}
      >
        <SwipeablePanelContent
          setModalVisible={setModalVisible}
          setIsPanelActive={setIsPanelActive}
        />
      </SwipeablePanel>
      <AddProductModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
});

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
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "700",
    color: "#444444",
    paddingLeft: 10,
    // transform: "RotateX",
  },
  trendSection: {
    marginTop: 20,
  },
  recentSection: { marginVertical: 20, paddingHorizontal: 0 },
});
