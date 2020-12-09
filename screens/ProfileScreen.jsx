import {
  AntDesign,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Text, View } from "../components/Themed";
import { firestore } from "../firebase/firebase.utils";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase/firebase.utils";
import { setCurrentUser } from "../redux/user/actions";
import { setMyReels } from "../redux/reel/actions";
import ReelPreview from "../components/ReelPreview/ReelPreview";

export default function ProfileScreen() {
  const user = useSelector((state) => state.user.currentUser);
  const reels = useSelector((state) => state.reel.myReels);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [focused, setFocused] = useState("reels");
  const [loading, setLoading] = useState(false);
  const [loadingReels, setLoadingReels] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    getFollowers(user.id);
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
    auth.signOut();
    dispatch(setCurrentUser(null));
  };
  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={onClick}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="ios-arrow-back" size={24} color="black" />
              <Text style={styles.title}>Profile</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: 70,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfileScreen")}
          >
            <AntDesign name="edit" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignout}>
            <AntDesign name="logout" size={20} color="red" />
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
            source={require("../assets/loader.gif")}
          />
        </View>
      ) : (
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
              <Text
                style={{ color: "#42414C", fontSize: 16, fontWeight: "500" }}
              >
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
                      source={require("../assets/loader.gif")}
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
      )}
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
    paddingHorizontal: 20,
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
