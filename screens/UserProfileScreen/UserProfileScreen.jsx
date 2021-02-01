import {
  AntDesign,
  Ionicons,
  Feather,
  Entypo,
  MaterialCommunityIcons,
  SimpleLineIcons,
  MaterialIcons,
  Octicons,
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
  handleTurnPostNotificationOff,
  handleTurnPostNotificationOn,
  handleUnfollowUser,
} from "../../firebase/firebase.utils";
import Dialog from "react-native-popup-dialog";
import { setCurrentChannel, setPrivateChannel } from "../../redux/chat/actions";
import { setUserReels } from "../../redux/reel/actions";
import ReelPreview from "../../components/ReelPreview/ReelPreview";
import UserProfileMoreModal from "../../components/UserProfileMoreModal/UserProfileMoreModal";
import { styles } from "./styles";
import AfterReporting from "../../components/AfterReporting/AfterReporting";
import FollowersImagePreview from "../../components/FollowersImagePreview/FollowersImagePreview";
export default function UserProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const currentUser = useSelector((state) => state.user.currentUser);
  const reels = useSelector((state) => state.reel.userReels);
  const [userId] = useState(route.params.userId);
  const [focused, setFocused] = useState("reels");
  const [lastVisible, setLastVisible] = useState("");
  const [friendIds, setFriendIds] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPostNotyOn, setIsPostNotyOn] = useState(false);
  const [followingMe, setFollowingMe] = useState(false);
  const [mutual, setMutual] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reported, setReported] = useState(false);
  const [loadingReels, setLoadingReels] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    getUserData(userId);
    getFollowers(userId);
    getFollowerIds(userId);
    // getFollowing(userId);
    getPostNoty(userId);
    checkIfMutual(userId);
    getUserReels(userId);
  }, [userId]);
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
    const followersRef = firestore
      .collection("followers")
      .doc(userId)
      .collection("userFollowers");
    const followersSnapshot = await followersRef.get();
    setFollowerCount(followersSnapshot.docs.length - 1);
  }
  async function getFollowerIds(userId) {
    const followersRef = firestore
      .collection("followers")
      .doc(userId)
      .collection("userFollowers");
    if (lastVisible) {
      const nextFriendArr = [];
      const next = followersRef.startAfter(lastVisible).limit(10);
      const nextFollowersIdSnapshot = await next.get();
      nextFollowersIdSnapshot.docs.forEach((doc) => {
        doc.id !== userId && nextFriendArr.push(doc.id);
        // if (nextFollowersIdSnapshot.docs.length === nextFriendArr.length) {
        setFriendIds([...friendIds, ...nextFriendArr]);
        // }
      });
    } else {
      const firstFriendArr = [];
      const first = followersRef.limit(10);
      const firstFollowersIdSnapshot = await first.get();
      setLastVisible(
        firstFollowersIdSnapshot.docs[firstFollowersIdSnapshot.docs.length - 1]
      );
      firstFollowersIdSnapshot.docs.forEach((doc) => {
        doc.id !== userId && firstFriendArr.push(doc.id);
        // if (firstFollowersIdSnapshot.docs.length === firstFriendArr.length) {
        setFriendIds(firstFriendArr);
        // }
      });
    }
  }
  // async function getFollowing(userId) {
  //   const snapshot = await firestore
  //     .collection("following")
  //     .doc(userId)
  //     .collection("userFollowing")
  //     .get();
  //   setFollowingCount(snapshot.docs.length);
  // }
  async function checkIfMutual(userId) {
    const followingDoc = await firestore
      .collection("followers")
      .doc(userId)
      .collection("userFollowers")
      .doc(currentUser.id)
      .get();
    const followersDoc = await firestore
      .collection("followers")
      .doc(currentUser.id)
      .collection("userFollowers")
      .doc(userId)
      .get();
    setIsFollowing(followingDoc.exists);
    setFollowingMe(followersDoc.exists);
    if (followingDoc.exists) {
      setMutual(followingDoc.exists === followersDoc.exists);
    }
    setLoading(false);
  }
  async function getPostNoty(userId) {
    const postNotyDoc = await firestore
      .collection("postNotifications")
      .doc(userId)
      .collection("users")
      .doc(currentUser.id)
      .get();
    setIsPostNotyOn(postNotyDoc.exists);
    setLoading(false);
  }
  async function togglePostNoty(userId) {
    if (isPostNotyOn) {
      setIsPostNotyOn(false);
      handleTurnPostNotificationOff(userId, currentUser.id);
      setFollowerCount(followerCount - 1);
      setDialogVisible(false);
    } else {
      setIsPostNotyOn(true);
      handleTurnPostNotificationOn(userId, currentUser.id);
      setDialogVisible(false);
    }
    setLoading(false);
  }

  const handleToggleFollow = () => {
    /* handleFollow and unFollow */
    if (isFollowing) {
      setIsFollowing(false);
      handleUnfollowUser(userId, currentUser.id);
      setFollowerCount(followerCount - 1);
      setMutual(false);
      setDialogVisible(false);
    } else {
      setIsFollowing(true);
      handleFollowUser(userId, currentUser, user.push_token.data);
      if (followingMe) {
        setMutual(true);
      }
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
        </View>
        <Text style={styles.title}>{user.name}</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: 60,
          }}
        >
          <TouchableOpacity
            style={styles.circle}
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
                onPress={() => {
                  togglePostNoty(userId);
                }}
              >
                <Feather
                  name={isPostNotyOn ? "bell-off" : "bell"}
                  size={20}
                  color="black"
                  style={{ marginRight: 20 }}
                />
                <Text style={styles.modalText}>
                  Turn {isPostNotyOn ? "off" : "on"} post notification
                </Text>
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
          <View style={styles.userImageContainer}>
            <Image
              style={styles.userImage}
              source={{ uri: `${user.profile_pic}` }}
            />
          </View>
          <View style={{ marginLeft: 20 }}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>@{user.username || ""}</Text>
              <MaterialCommunityIcons
                name="star-four-points"
                size={16}
                color="#006eff"
              />
            </View>
            {!loading && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() =>
                    isFollowing
                      ? setDialogVisible(!dialogVisible)
                      : handleToggleFollow()
                  }
                >
                  <View
                    style={[
                      styles.fufBtn,
                      {
                        backgroundColor: "#ffffff",
                      },
                    ]}
                  >
                    <Text style={styles.fufBtnText}>
                      {isFollowing
                        ? "following"
                        : followingMe && !isFollowing
                        ? "Follow Back"
                        : "Follow"}
                    </Text>
                  </View>
                </TouchableOpacity>
                {mutual ? (
                  <View style={[styles.circle, { backgroundColor: "#006eff" }]}>
                    <MaterialCommunityIcons
                      name="rotate-3d-variant"
                      size={20}
                      color="#ffffff"
                    />
                  </View>
                ) : null}
              </View>
            )}
          </View>
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          {/* <Text style={{ color: "#42414C", fontSize: 14, fontWeight: "bold" }}>
            {user.name || ""}
          </Text> */}
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
              {user.location || "Somewhere on earth"}
            </Text>
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
        <View style={{}}>
          <View
            style={[
              styles.row,
              { width: "100%", paddingVertical: 20, paddingHorizontal: 15 },
            ]}
          >
            <Text style={[styles.title, { fontSize: 12 }]}>
              {followerCount} Followers
            </Text>
            {followerCount > 10 ? (
              <View style={styles.row}>
                <Text style={{ fontSize: 12, marginRight: 5 }}>View all</Text>
                <Ionicons name="ios-arrow-forward" size={16} color="black" />
              </View>
            ) : null}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 10 }}
          >
            {friendIds
              .filter((item, index) => {
                return item !== userId;
              })
              .map((item, index) => (
                <FollowersImagePreview key={index} userId={item} />
              ))}
          </ScrollView>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            setVisible(!visible);
            setFocused("reels");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              paddingHorizontal: 20,
              marginTop: 20,
              elevation: 2,
              paddingVertical: 15,
            }}
          >
            <View>
              {focused === "reels" ? (
                <AntDesign name="appstore1" size={25} color="#006eff" />
              ) : (
                <AntDesign name="appstore-o" size={25} color="#b3b4b6" />
              )}
            </View>
            {focused === "reels" ? (
              <Text style={styles.focusedText}>Posts</Text>
            ) : null}
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color="black"
              style={{
                transform: [
                  {
                    rotate: visible ? "180deg" : "0deg",
                  },
                ],
                marginLeft: "auto",
              }}
            />
          </View>
        </TouchableWithoutFeedback>
        <ScrollView>
          {focused === "reels" && (
            <View style={styles.listReels}>
              {loadingReels ? (
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
              ) : reels.length === 0 ? (
                <View style={styles.noPostContainerWrapper}>
                  <View style={styles.noPostContainer}>
                    <AntDesign
                      name="appstore-o"
                      size={50}
                      color="#b3b4b6"
                      style={styles.noPostNot}
                    />
                  </View>
                  <Text style={styles.title}>No post yet</Text>
                </View>
              ) : null}
              {visible &&
                reels.map((item, index) => (
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
