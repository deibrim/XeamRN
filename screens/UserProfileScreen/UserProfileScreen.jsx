import {
  AntDesign,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Text, View } from "../../components/Themed";
import {
  firestore,
  handleFollowUser,
  handleUnfollowUser,
} from "../../firebase/firebase.utils";
import { auth } from "../../firebase/firebase.utils";
import { setCurrentUser } from "../../redux/user/actions";
import { setUserReels } from "../../redux/reel/actions";
import ReelPreview from "../../components/ReelPreview/ReelPreview";

export default function UserProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const currentUser = useSelector((state) => state.user.currentUser);
  const reels = useSelector((state) => state.reel.userReels);
  const [userId] = useState(route.params.userId);
  const [focused, setFocused] = useState("reels");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    getUserData(userId);
    getUserReels(userId);
    getFollowers(userId);
    getFollowing(userId);
    checkIfFollowing(userId);
  }, []);
  async function getUserData(userId) {
    const userRef = firestore.doc(`users/${userId}`);
    const snapShot = await userRef.get();
    setUser(snapShot.data());
  }

  function getUserReels(userId) {
    const reelRef = firestore
      .collection("reels")
      .where("user_id", "==", `${userId}`);
    reelRef.onSnapshot((snapshot) => {
      const reelsArr = [];
      snapshot.docs.forEach((doc) => {
        reelsArr.push(doc.data());
      });
      dispatch(setUserReels(reelsArr));
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
  }
  const handleToggleFollow = () => {
    /* handleFollow and unFollow */

    if (isFollowing) {
      setIsFollowing(false);
      handleUnfollowUser(userId, currentUser.id);
    } else {
      setIsFollowing(true);
      handleFollowUser(userId, currentUser);
    }
  };
  const onClick = () => {
    navigation.goBack();
  };
  const handleSignout = () => {
    auth.signOut();
    dispatch(setCurrentUser(null));
  };
  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={onClick}>
            <Ionicons name="ios-arrow-back" size={24} color="black" />
          </TouchableOpacity>
          {/* <Text style={styles.title}>{user.name}</Text> */}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={handleToggleFollow}>
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
              <SimpleLineIcons
                name={isFollowing ? "user-following" : "user-follow"}
                size={18}
                color={isFollowing ? "#006aff" : "white"}
                style={{ marginRight: 10 }}
              />
              <Text
                style={isFollowing ? { color: "#006aff" } : { color: "white" }}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
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
          <View style={styles.userInfo}>
            <Text
              style={{ color: "#42414C", fontSize: 22, fontWeight: "bold" }}
            >
              {user.username || "John Doe"}
            </Text>
            <Text style={{ color: "#42414C", fontSize: 16, fontWeight: "500" }}>
              {user.headline || "Software Engineer"}
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
                style={{ marginRight: 5 }}
              />
              <Text style={{ fontSize: 14, color: "gray" }}>
                {user.location || "Washington DC"}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            paddingHorizontal: 20,
            marginTop: -10,
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
              {reels ? (
                reels.map((item, index) => (
                  <ReelPreview
                    key={index}
                    data={{ ...item, index }}
                    reels={reels}
                  />
                ))
              ) : (
                <Text>Loadiing...</Text>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 10,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    elevation: 4,
  },
  userPreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 50,
  },
  title: {
    color: "#42414C",
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 1,
  },
  listReels: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 20,
  },
});
