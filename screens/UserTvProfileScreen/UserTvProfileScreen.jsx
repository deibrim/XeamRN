import {
  AntDesign,
  Ionicons,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { firestore, auth } from "../../firebase/firebase.utils";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { setCurrentUser } from "../../redux/user/actions";
import { setTvReels } from "../../redux/reel/actions";
import ReelPreview from "../../components/ReelPreview/ReelPreview";
import { styles } from "./styles";
export default function UserTvProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.currentUser);
  const [userTvId] = useState(route.params.userTvId);
  // const tvProfile = useSelector((state) => state.user.currentUserTvProfile);
  const [tvProfile, setTvProfile] = useState({});
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [focused, setFocused] = useState("reels");
  const [loading, setLoading] = useState(false);
  const [loadingReels, setLoadingReels] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // getFollowers(tvProfile.id);
    getUserTvData();
    // getTvReels(tvProfile.id);
  }, []);
  async function getUserTvData() {
    setLoading(true);
    const userRef = firestore.doc(`xeamTvs/${userTvId}`);
    const snapShot = await userRef.get();
    setTvProfile(snapShot.data());
  }

  function getTvReels(tvProfileId) {
    setLoadingReels(true);
    const reelRef = firestore
      .collection("tvReels")
      .doc(`${tvProfileId}`)
      .collection("myReels");
    reelRef.onSnapshot((snapshot) => {
      if (snapshot.empty) {
        setLoadingReels(false);
      }
      const reelsArr = [];
      snapshot.docs.forEach((doc) => {
        reelsArr.push(doc.data());
      });
      dispatch(setTvReels(reelsArr));
      setLoadingReels(false);
    });
  }
  async function getFollowers(tvProfileId) {
    setLoading(true);
    const snapshot = await firestore
      .collection("tvFollowers")
      .doc(tvProfileId)
      .collection("followers")
      .get();

    !snapshot.empty
      ? setFollowerCount(snapshot.docs.length)
      : setFollowerCount(0);
    setLoading(false);
  }
  const handleToggleFollow = () => {
    /* handleFollow and unFollow */

    if (isFollowing) {
      setIsFollowing(false);
      // handleUnfollowTv(userId, currentUser.id);
      setFollowerCount(followerCount - 1);
    } else {
      setIsFollowing(true);
      // handleFollowTv(userId, currentUser, user);
      setFollowerCount(followerCount + 1);
    }
  };
  const onClick = () => {
    navigation.goBack();
  };

  return (
    <>
      <View style={{ backgroundColor: "#ecf2fa", flex: 1 }}>
        <ImageBackground
          style={{ flex: 0.7, minHeight: 150 }}
          source={{ uri: `${tvProfile && tvProfile.logo}` }}
          resizeMode={"cover"}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.6)",
              // justifyContent: "flex-end",
            }}
          >
            <View style={styles.header}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    height: 30,
                    borderRadius: 20,
                    elevation: 2,
                    backgroundColor: "#ffffff",
                  }}
                  onPress={onClick}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="ios-arrow-back" size={24} color="#444444" />
                    <Text style={styles.title}>Back</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.userPreview}>
              <View
                style={{
                  width: "30%",
                  padding: 10,
                  borderTopRightRadius: 100,
                  borderBottomRightRadius: 100,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginVertical: 5,
                  marginRight: 10,
                }}
              >
                <Image
                  style={{
                    width: 70,
                    height: 70,
                    resizeMode: "cover",
                    borderRadius: 50,
                    borderWidth: 3,
                    borderColor: "#ffffff",
                  }}
                  source={{ uri: `${tvProfile.logo}` }}
                />
              </View>
              <View style={styles.userInfo}>
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 20,
                    fontWeight: "500",
                    fontWeight: "bold",
                  }}
                >
                  {tvProfile.tvHandle}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginVertical: 5,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#999999",
                      marginRight: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {followerCount} followers
                  </Text>
                </View>
              </View>
              <View style={{ marginLeft: "auto", marginRight: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginBottom: 10,
                    marginRight: 5,
                  }}
                >
                  <TouchableOpacity onPress={() => {}}>
                    <Fontisto name="star" size={15} color="#006eff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {}}>
                    <Fontisto name="star" size={15} color="#006eff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {}}>
                    <Fontisto name="star" size={15} color="#006eff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {}}>
                    <Fontisto name="star" size={15} color="#999999" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {}}>
                    <Fontisto name="star" size={15} color="#999999" />
                  </TouchableOpacity>
                </View>
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
                    <MaterialIcons
                      name={isFollowing ? "tv-off" : "tv"}
                      size={18}
                      color={isFollowing ? "#006aff" : "white"}
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={
                        isFollowing ? { color: "#006aff" } : { color: "white" }
                      }
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 20,
            elevation: 1,
          }}
        >
          <View style={{ alignItems: "center", width: 100 }}>
            <Text style={{}}>Posts</Text>
          </View>
          <View style={{ alignItems: "center", width: 100 }}>
            <Text style={{}}>Polls</Text>
          </View>
          <View style={{ alignItems: "center", width: 100 }}>
            <Text style={{}}>About</Text>
          </View>
        </View>
        {/* <View style={styles.listReels}> */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 11 }}
        >
          {/* {focused === "reels" &&
            reels.map((item, index) => (
              <ReelPreview
                key={index}
                data={{ ...item, index }}
                reels={reels}
              />
            )
            )} */}
        </ScrollView>
      </View>
    </>
  );
}
