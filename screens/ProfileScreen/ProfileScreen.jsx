import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { auth, firestore } from "../../firebase/firebase.utils";
import { useNavigation } from "@react-navigation/native";
import {
  setCurrentUser,
  setCurrentUserTvProfile,
  setCurrentUserXStore,
} from "../../redux/user/actions";
import { setMyReels } from "../../redux/reel/actions";
import ReelPreview from "../../components/ReelPreview/ReelPreview";
import { setShoppingBagSize } from "../../redux/shopping/actions";
import { styles } from "./styles";
import FollowersImagePreview from "../../components/FollowersImagePreview/FollowersImagePreview";
import Dialog from "react-native-popup-dialog";
import HelperDialog from "../../components/HelperDialog/HelperDialog";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default function ProfileScreen() {
  const user = useSelector((state) => state.user.currentUser);
  const reels = useSelector((state) => state.reel.myReels);
  const savedReels = useSelector((state) => state.save.posts);
  const [followerCount, setFollowerCount] = useState(0);
  const [lastVisible, setLastVisible] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [friendIds, setFriendIds] = useState([]);
  const [followingCount, setFollowingCount] = useState(0);
  const [focused, setFocused] = useState("reels");
  const [loading, setLoading] = useState(false);
  const [loadingReels, setLoadingReels] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    getFollowers(user.id);
    getFollowerIds(user.id);
    getFollowing(user.id);
    getUserReels(user.id);
  }, []);
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
      // setReels(reelsArr);
      dispatch(setMyReels(reelsArr));
      setLoadingReels(false);
    });
  }
  async function getFollowers(userId) {
    setLoading(true);
    const snapshot = await firestore
      .collection("followers")
      .doc(userId)
      .collection("userFollowers")
      .get();
    !snapshot.empty
      ? setFollowerCount(snapshot.docs.length - 1)
      : setFollowerCount(0);
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
  async function getFollowing(userId) {
    const snapshot = await firestore
      .collection("following")
      .doc(userId)
      .collection("userFollowing")
      .get();
    setFollowingCount(snapshot.docs.length);
    setLoading(false);
  }
  const onClick = () => {
    navigation.goBack();
  };
  const handleSignout = () => {
    setDialogVisible(false);
    wait(2000).then(() => {
      auth.signOut();
      dispatch(setCurrentUser(null));
      dispatch(setCurrentUserTvProfile(null));
      dispatch(setCurrentUserXStore(null));
      dispatch(setShoppingBagSize(0));
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
        <Text style={styles.title}>Profile</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: 60,
          }}
        >
          <TouchableOpacity
            style={styles.circle}
            onPress={() => setDialogVisible(true)}
          >
            <Feather name="more-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
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
      ) : (
        <View style={styles.container}>
          <HelperDialog
            visible={dialogVisible}
            setDialogVisible={setDialogVisible}
            title={user.username}
          >
            <TouchableOpacity
              style={[styles.modalTextButton]}
              onPress={handleSignout}
            >
              <Feather
                name="log-out"
                size={20}
                color="red"
                style={{ marginRight: 20 }}
              />
              <Text style={[styles.modalText, { color: "red" }]}>Logout</Text>
            </TouchableOpacity>
          </HelperDialog>
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
              <Text style={[styles.title, { fontSize: 14 }]}>
                {followingCount} Following
              </Text>

              {!loading && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("EditProfileScreen")}
                  >
                    <View
                      style={[
                        styles.fufBtn,
                        {
                          backgroundColor: "#ffffff",
                        },
                      ]}
                    >
                      <Text style={styles.fufBtnText}>Edit profile</Text>
                    </View>
                  </TouchableOpacity>

                  {/* <View style={[styles.circle, { backgroundColor: "#006eff" }]}>
                    <MaterialCommunityIcons
                      name="rotate-3d-variant"
                      size={20}
                      color="#ffffff"
                    />
                  </View> */}
                </View>
              )}
            </View>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <Text
              style={{ color: "#42414C", fontSize: 14, fontWeight: "bold" }}
            >
              {user.name || ""}
            </Text>
            <Text style={{ color: "#42414C", fontSize: 14, fontWeight: "500" }}>
              {user.bio || ""}
            </Text>
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
                  // console.log(item, userId);
                  return item !== user.id;
                })
                .map((item, index) => (
                  <FollowersImagePreview key={index} userId={item} />
                ))}
            </ScrollView>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              paddingHorizontal: 20,
              backgroundColor: "#ffffff",
              marginTop: 20,
              elevation: 1,
              paddingVertical: 10,
            }}
          >
            <View style={{ alignItems: "center", width: 100 }}>
              <TouchableOpacity onPress={() => setFocused("reels")}>
                {focused === "reels" ? (
                  <>
                    <AntDesign name="appstore1" size={25} color="#006eff" />
                  </>
                ) : (
                  <AntDesign name="appstore-o" size={25} color="#b3b4b6" />
                )}
              </TouchableOpacity>
              {focused === "reels" ? (
                <Text style={styles.focusedText}>Posts</Text>
              ) : null}
            </View>
            <View style={{ alignItems: "center", width: 100 }}>
              <TouchableOpacity onPress={() => setFocused("saves")}>
                {focused === "saves" ? (
                  <>
                    <MaterialCommunityIcons
                      name="bookmark-multiple"
                      size={25}
                      color="#006eff"
                    />
                  </>
                ) : (
                  <MaterialCommunityIcons
                    name="bookmark-multiple-outline"
                    size={25}
                    color="#b3b4b6"
                  />
                )}
              </TouchableOpacity>
              {focused === "saves" ? (
                <Text style={styles.focusedText}>Saved</Text>
              ) : null}
            </View>
          </View>

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
                    <Text style={styles.title}>You have no post yet</Text>
                  </View>
                ) : null}
                {reels.length
                  ? reels.map((item, index) => (
                      <ReelPreview
                        key={index}
                        data={{ ...item, index }}
                        reels={reels}
                      />
                    ))
                  : null}
              </View>
            )}
            {focused === "saves" && (
              <View style={styles.listReels}>
                {savedReels.map((item, index) => (
                  <ReelPreview
                    key={index}
                    data={{ ...item, index }}
                    reels={savedReels}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      )}
      <View style={{ ...styles.buttonContainer }}>
        {user.isTvActivated && (
          <TouchableOpacity
            onPress={() => navigation.navigate("TvProfileScreen")}
          >
            <View style={styles.button}>
              <Feather name="tv" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
        <View style={{ marginVertical: 5 }}></View>
        {user.isBusinessAccount && (
          <TouchableOpacity onPress={() => navigation.navigate("XStoreScreen")}>
            <View style={styles.button}>
              <AntDesign name="isv" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
