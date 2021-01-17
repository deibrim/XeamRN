import { AntDesign, Ionicons, Fontisto } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { firestore, auth } from "../../firebase/firebase.utils";
import Graph from "../../components/Graph/Graph";
import { useNavigation } from "@react-navigation/native";
// import { setCurrentUser } from "../../redux/user/actions";
import { setTvReels } from "../../redux/reel/actions";
import ReelPreview from "../../components/ReelPreview/ReelPreview";
import { styles } from "./styles";
export default function TvProfileScreen() {
  const user = useSelector((state) => state.user.currentUser);
  const tvProfile = useSelector((state) => state.user.currentUserTvProfile);
  const reels = useSelector((state) => state.reel.tvReels);
  const [followerCount, setFollowerCount] = useState(0);
  const [focused, setFocused] = useState("reels");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("thisWeek");
  const [loadingReels, setLoadingReels] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    getFollowers(tvProfile.id);
    getTvReels(tvProfile.id);
  }, []);
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
  const onClick = () => {
    navigation.goBack();
  };

  return (
    <>
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
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
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons
                        name="ios-arrow-back"
                        size={24}
                        color="#444444"
                      />
                      <Text style={styles.title}>Back</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{ marginLeft: "auto" }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("EditTvProfileScreen")}
                    >
                      <View style={{}}>
                        <AntDesign name="edit" size={20} color="white" />
                      </View>
                    </TouchableOpacity>
                  </View>
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
                <View style={{ marginLeft: "auto", marginRight: 10 }}></View>
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
              <Text style={{}}>Givaways</Text>
            </View>
            <View style={{ alignItems: "center", width: 100 }}>
              <Text style={{}}>About</Text>
            </View>
          </View>
          <ScrollView></ScrollView>
        </View>
      )}

      <View
        style={{
          height: 80,
          width: "100%",
          position: "absolute",
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            height: 50,
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#ffffff",
            elevation: 5,
            borderRadius: 25,
            paddingHorizontal: 20,
          }}
          onPress={() => navigation.navigate("TvInsightScreen")}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#444444", fontSize: 16 }}>Tv Insight</Text>
          </View>
          <View
            style={{
              height: 25,
              width: 25,
              backgroundColor: "#006eff",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 15,
            }}
          >
            <Ionicons name="ios-arrow-forward" size={20} color="#ffffff" />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}
