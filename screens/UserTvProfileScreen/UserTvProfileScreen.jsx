import {
  AntDesign,
  Ionicons,
  Feather,
  Entypo,
  MaterialCommunityIcons,
  SimpleLineIcons,
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
import Dialog, { DialogContent } from "react-native-popup-dialog";
import {
  firestore,
  handleFollowTv,
  handleUnfollowTv,
} from "../../firebase/firebase.utils";
import { useNavigation, useRoute } from "@react-navigation/native";
import { setTvReels } from "../../redux/reel/actions";
import ReelPreview from "../../components/ReelPreview/ReelPreview";
import { styles } from "./styles";
import UserProfileMoreModal from "../../components/UserProfileMoreModal/UserProfileMoreModal";
import AfterReporting from "../../components/AfterReporting/AfterReporting";
export default function UserTvProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.currentUser);
  const [userTvId] = useState(route.params.userTvId);
  const [tvProfile, setTvProfile] = useState({});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [focused, setFocused] = useState("reels");
  const [token, setToken] = useState("");
  const [reported, setReported] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingReels, setLoadingReels] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getUserTvData();
    // getTvReels(tvProfile.id);
  }, []);
  async function getUserTvData() {
    setLoading(true);
    const tvRef = firestore.doc(`xeamTvs/${userTvId}`);
    const userRef = firestore.doc(`users/${userTvId}`);
    const tvSnapShot = await tvRef.get();
    const snapShot = await userRef.get();
    setTvProfile(tvSnapShot.data());
    setToken(snapShot.data().push_token.data);

    getFollowers(userTvId);
    checkIfFollowing(tvSnapShot.data().id);
  }

  function getTvReels(tvProfileId) {
    setLoadingReels(true);
    const reelRef = firestore
      .collection("tvReels")
      .doc(`${tvProfileId}`)
      .collection("reels");
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
  async function checkIfFollowing(tvId) {
    const doc = await firestore
      .collection("tvFollowers")
      .doc(tvId)
      .collection("followers")
      .doc(user.id)
      .get();
    setIsFollowing(doc.exists);
    setLoading(false);
  }
  async function getFollowers(tvProfileId) {
    setLoading(true);
    const snapshot = await firestore
      .collection("tvFollowers")
      .doc(tvProfileId)
      .collection("followers")
      .get();
    !snapshot.empty
      ? setFollowerCount(snapshot.docs.length - 1)
      : setFollowerCount(0);
    setLoading(false);
  }
  const handleToggleFollow = () => {
    /* handleFollow and unFollow */

    if (isFollowing) {
      setIsFollowing(false);
      handleUnfollowTv(tvProfile.id, user.id);
      setFollowerCount(followerCount - 1);
    } else {
      setIsFollowing(true);
      handleFollowTv(tvProfile.id, user, token);
      // handleFollowTv(userId, currentUser, user);
      setFollowerCount(followerCount + 1);
    }
  };
  const onClick = () => {
    navigation.goBack();
  };

  return (
    <>
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
      <Dialog
        visible={showMore}
        onTouchOutside={() => {
          setShowMore(false);
        }}
        width={0.8}
      >
        <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
          <View style={{}}>
            <View style={styles.customDialogTitle}>
              <Text
                style={[
                  styles.username,
                  {
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                  },
                ]}
              >
                More
              </Text>
            </View>
            <UserProfileMoreModal
              userId={tvProfile.id}
              tvData={tvProfile}
              setShowMore={setShowMore}
              reported={reported}
              setReported={setReported}
              currentUser={user}
            />
          </View>
        </View>
      </Dialog>
      <View style={{ backgroundColor: "#ecf2fa", flex: 1 }}>
        <ImageBackground
          style={{ flex: 0.7, minHeight: 150 }}
          source={{ uri: `${tvProfile && tvProfile.logo}` }}
          resizeMode={"cover"}
        >
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
                      styles.tvHandle,
                      // { textAlign: "center", fontSize: 16, fontWeight: "bold" },
                    ]}
                  >
                    {tvProfile.tvHandle}
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
                  <Text style={styles.modalText}>
                    Turn on post notification
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
                <Text style={styles.tvHandle}>{tvProfile.tvHandle}</Text>
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
                    {/* {isFollowing ? (
                      <Ionicons
                        name={"tv"}
                        size={18}
                        color={isFollowing ? "#006aff" : "white"}
                        style={{ marginRight: 10 }}
                      />
                    ) : (
                      <Ionicons
                        name={"tv-outline"}
                        size={18}
                        color={isFollowing ? "#006aff" : "white"}
                        style={{ marginRight: 10 }}
                      />
                    )} */}
                    <Text
                      style={
                        isFollowing ? { color: "#006aff" } : { color: "white" }
                      }
                    >
                      {isFollowing ? "Following Tv" : "Follow Tv"}
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
            <Text style={{}}>Giveaways</Text>
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
