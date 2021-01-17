import {
  AntDesign,
  Ionicons,
  Feather,
  Entypo,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Text, View } from "../../components/Themed";
import {
  firestore,
  handleFollowUser,
  handleUnfollowUser,
} from "../../firebase/firebase.utils";
import Dialog, { DialogContent } from "react-native-popup-dialog";
import { setCurrentChannel, setPrivateChannel } from "../../redux/chat/actions";
import { setUserReels } from "../../redux/reel/actions";
import ReelPreview from "../../components/ReelPreview/ReelPreview";
import UserProfileMoreModal from "../../components/UserProfileMoreModal/UserProfileMoreModal";
import { styles } from "./styles";
import AfterReporting from "../../components/AfterReporting/AfterReporting";
export default function UserProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const currentUser = useSelector((state) => state.user.currentUser);
  const reels = useSelector((state) => state.reel.userReels);
  const [userId] = useState(route.params.userId);
  const [focused, setFocused] = useState("reels");
  const [isFollowing, setIsFollowing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reported, setReported] = useState(false);
  const [loadingReels, setLoadingReels] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    getUserData(userId);
    getFollowers(userId);
    getFollowing(userId);
    checkIfFollowing(userId);
    getUserReels(userId);
  }, []);
  async function getUserData(userId) {
    setLoading(true);
    const userRef = firestore.doc(`users/${userId}`);
    const snapShot = await userRef.get();
    setUser(snapShot.data());
  }

  function getUserReels(userId) {
    setLoadingReels(true);
    const reelRef = firestore
      .collection("reels")
      .doc(`${userId}`)
      .collection("userReels");
    reelRef.onSnapshot((snapshot) => {
      const reelsArr = [];
      snapshot.docs.forEach((doc) => {
        reelsArr.push(doc.data());
      });
      dispatch(setUserReels(reelsArr));
      setLoadingReels(false);
    });
  }
  async function getFollowers(userId) {
    const snapshot = await firestore
      .collection("followers")
      .doc(userId)
      .collection("userFollowers")
      .get();
    setFollowerCount(snapshot.docs.length - 1);
  }
  async function getFollowing(userId) {
    const snapshot = await firestore
      .collection("following")
      .doc(userId)
      .collection("userFollowing")
      .get();
    setFollowingCount(snapshot.docs.length);
  }
  async function checkIfFollowing(userId) {
    const doc = await firestore
      .collection("followers")
      .doc(userId)
      .collection("userFollowers")
      .doc(currentUser.id)
      .get();
    setIsFollowing(doc.exists);
    setLoading(false);
  }
  const handleToggleFollow = () => {
    /* handleFollow and unFollow */
    if (isFollowing) {
      setIsFollowing(false);
      handleUnfollowUser(userId, currentUser.id);
      setFollowerCount(followerCount - 1);
      setDialogVisible(false);
    } else {
      setIsFollowing(true);
      handleFollowUser(userId, currentUser, user.push_token.data);
      setFollowerCount(followerCount + 1);
    }
  };
  const onClick = () => {
    navigation.goBack();
  };
  function getChannelId() {
    const currentUserId = currentUser.id;

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  }
  const changeChannel = () => {
    const channelId = getChannelId();
    const channelData = {
      id: channelId,
      name: user.name,
      username: user.username,
    };
    dispatch(setCurrentChannel(channelData));
    dispatch(setPrivateChannel(true));
    navigation.navigate("ChatRoom", {
      name: user.name,
      id: user.id,
      username: user.username,
      profile_pic: user.profile_pic,
    });
  };
  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={onClick}>
            <View
              style={{ flexDirection: "row", alignItems: "center", width: 60 }}
            >
              <Ionicons name="ios-arrow-back" size={24} color="black" />
            </View>
          </TouchableOpacity>
          {/* <Text style={styles.title}>{user.name}</Text> */}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {!loading && (
            <TouchableOpacity
              onPress={() =>
                isFollowing
                  ? setDialogVisible(!dialogVisible)
                  : handleToggleFollow()
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderWidth: 1.5,
                  borderRadius: 20,
                  borderColor: "#006aff",
                  backgroundColor: isFollowing ? "transparent" : "#006aff",
                }}
              >
                <Text
                  style={
                    isFollowing ? { color: "#006aff" } : { color: "white" }
                  }
                >
                  {isFollowing ? "following" : "Follow"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 20,
              marginLeft: 5,
              elevation: 2,
              backgroundColor: "#ffffff",
            }}
            onPress={() => setShowMore(!showMore)}
          >
            <Feather name="more-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {reported ? (
        <View
          style={{
            ...styles.centerContainer,
            backgroundColor: "#ffffff",
            zIndex: 15,
            paddingHorizontal: "20%",
          }}
        >
          <AfterReporting setReported={setReported} customText={"profile"} />
        </View>
      ) : null}
      {/* {loading ? (
        <View
          style={{
            flex: 1,
            minHeight: 200,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Image
            style={{ marginLeft: 5, width: 30, height: 30 }}
            source={require("../../assets/loader.gif")}
          />
        </View>
      ) : ( */}
      <View style={styles.container}>
        <Dialog
          visible={showMore}
          onTouchOutside={() => {
            setShowMore(false);
          }}
          width={0.8}
        >
          <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
            <View
              style={{
                minHeight: 100,
              }}
            >
              <View style={styles.customDialogTitle}>
                <Text
                  style={[
                    styles.username,
                    { textAlign: "center", fontSize: 16, fontWeight: "bold" },
                  ]}
                >
                  More
                </Text>
              </View>
              <UserProfileMoreModal
                userId={user.id}
                userData={user}
                setShowMore={setShowMore}
                reported={reported}
                setReported={setReported}
                currentUser={currentUser}
              />
            </View>
          </View>
        </Dialog>
        <Dialog
          visible={dialogVisible}
          onTouchOutside={() => {
            setDialogVisible(false);
          }}
          width={0.8}
        >
          <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
            <View style={{ minHeight: 100 }}>
              <View style={styles.customDialogTitle}>
                <Text
                  style={[
                    styles.username,
                    { textAlign: "center", fontSize: 16, fontWeight: "bold" },
                  ]}
                >
                  {user.username}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalTextButton}
                onPress={() => {
                  // onBlacklistUser();
                }}
              >
                <MaterialCommunityIcons
                  name="block-helper"
                  size={20}
                  color="black"
                  style={{ marginRight: 20 }}
                />
                <Text style={styles.modalText}>Block User</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalTextButton}
                onPress={() => {}}
              >
                <Feather
                  name="bell"
                  size={20}
                  color="black"
                  style={{ marginRight: 20 }}
                />
                <Text style={styles.modalText}>Turn on post notification</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalTextButton]}
                onPress={handleToggleFollow}
              >
                <SimpleLineIcons
                  name="user-unfollow"
                  size={20}
                  color="red"
                  style={{ marginRight: 20 }}
                />
                <Text style={[styles.modalText, { color: "red" }]}>
                  Unfollow
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Dialog>
        <View style={styles.userPreview}>
          <View
            style={{
              width: "40%",
              backgroundColor: "#006aff",
              padding: 10,
              borderTopRightRadius: 100,
              borderBottomRightRadius: 100,
              flexDirection: "row",
              justifyContent: "flex-end",
              marginVertical: 40,
            }}
          >
            <Image
              style={{
                width: 80,
                height: 80,
                resizeMode: "cover",
                borderRadius: 50,
                borderWidth: 2,
                borderColor: "#fff",
              }}
              source={{ uri: `${user.profile_pic}` }}
            />
          </View>
          <View style={{ marginLeft: 20 }}>
            <Text style={styles.username}>@ {user.username || ""}</Text>
            <Text style={{ color: "#42414C", fontSize: 14, fontWeight: "500" }}>
              {user.headline || ""}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 5,
                alignItems: "center",
              }}
            >
              <Entypo
                name="location-pin"
                size={18}
                color="gray"
                style={{ marginLeft: -4, marginRight: 3 }}
              />
              <Text style={{ fontSize: 14, color: "gray" }}>
                {user.location || "Washington DC"}
              </Text>
            </View>
          </View>
        </View>
        {/* <View style={{ paddingHorizontal: "10%" }}>
            <TouchableOpacity
              onPress={changeChannel}
              style={{ marginTop: -20 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderWidth: 1.5,
                  borderRadius: 20,
                  borderColor: "#006aff",
                  backgroundColor: "#006aff",
                }}
              >
                <Ionicons
                  name="md-chatboxes"
                  size={24}
                  color="white"
                  style={{ marginRight: 10 }}
                />
                <Text style={{ color: "white" }}>Send Message</Text>
              </View>
            </TouchableOpacity>
          </View> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            paddingHorizontal: 20,
            marginTop: 10,
          }}
        >
          <View style={{ alignItems: "center", width: 100 }}>
            <Text style={{}}>FOLLOWERS</Text>
            <Text style={{}}>{followerCount}</Text>
          </View>
          <View
            style={{ height: 50, width: 2, backgroundColor: "#006eff" }}
          ></View>
          <View style={{ alignItems: "center", width: 100 }}>
            <Text style={{}}>FOLLOWING</Text>
            <Text style={{}}>{followingCount}</Text>
          </View>
        </View>
        {/* <View
          style={{
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <Text style={{}}>REELS</Text>
          <Text style={{}}>{reels.length}</Text>
        </View> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            paddingHorizontal: 20,
            marginTop: 20,
            elevation: 2,
            paddingVertical: 15,
          }}
        >
          <View style={{ alignItems: "center", width: 100 }}>
            <TouchableOpacity onPress={() => setFocused("reels")}>
              {focused === "reels" ? (
                <AntDesign name="appstore1" size={25} color="#006eff" />
              ) : (
                <AntDesign name="appstore-o" size={25} color="#b3b4b6" />
              )}
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center", width: 100 }}>
            <TouchableOpacity onPress={() => setFocused("saves")}>
              {focused === "saves" ? (
                <MaterialCommunityIcons
                  name="bookmark-multiple"
                  size={25}
                  color="#006eff"
                />
              ) : (
                <MaterialCommunityIcons
                  name="bookmark-multiple-outline"
                  size={25}
                  color="#b3b4b6"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          {focused === "reels" && (
            <View style={styles.listReels}>
              {loadingReels && (
                <View
                  style={{
                    flex: 1,
                    minHeight: 150,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <Image
                    style={{ marginLeft: 5, width: 30, height: 30 }}
                    source={require("../../assets/loader.gif")}
                  />
                </View>
              )}
              {reels.map((item, index) => (
                <ReelPreview
                  key={index}
                  data={{ ...item, index }}
                  reels={reels}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
      <View style={{ ...styles.buttonContainer }}>
        {user.isTvActivated && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("UserTvProfileScreen", {
                userTvId: user.id,
              });
            }}
          >
            <View style={styles.button}>
              <Feather name="tv" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
        <View style={{ marginVertical: 5 }}></View>
        {user.isBusinessAccount && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("UserStoreScreen", { storeId: user.id })
            }
          >
            <View style={styles.button}>
              <AntDesign name="isv" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
