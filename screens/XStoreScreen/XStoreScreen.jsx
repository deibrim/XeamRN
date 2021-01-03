import { AntDesign, Ionicons, Fontisto } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { firestore, auth } from "../../firebase/firebase.utils";
import { useNavigation } from "@react-navigation/native";
// import { setCurrentUser } from "../../redux/user/actions";
import { setTvReels } from "../../redux/reel/actions";
import ReelPreview from "../../components/ReelPreview/ReelPreview";

export default function XStoreScreen() {
  const user = useSelector((state) => state.user.currentUser);
  const xStore = useSelector((state) => state.user.currentUserXStore);
  const reels = useSelector((state) => state.reel.tvReels);
  const [followerCount, setFollowerCount] = useState(0);
  const [focused, setFocused] = useState("reels");
  const [loading, setLoading] = useState(false);
  const [loadingReels, setLoadingReels] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    // getFollowers(xStore.id);
    // getTvReels(xStore.id);
  }, []);
  function getTvReels(xStoreId) {
    setLoadingReels(true);
    const reelRef = firestore
      .collection("tvReels")
      .doc(`${xStoreId}`)
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
  async function getFollowers(xStoreId) {
    setLoading(true);
    const snapshot = await firestore
      .collection("tvFollowers")
      .doc(xStoreId)
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
  //   const handleSignout = () => {
  //     auth.signOut();
  //     dispatch(setCurrentUser(null));
  //   };
  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={onClick}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="ios-arrow-back" size={24} color="black" />
              <Text style={styles.title}>{xStore.storeHandle}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            // width: 70,
            justifyContent: "flex-end",
          }}
        >
          {/* <TouchableOpacity
            onPress={() => navigation.navigate("EditProfileScreen")}
          >
            <AntDesign name="edit" size={20} color="black" />
          </TouchableOpacity> */}
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
          <View style={styles.userPreview}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
              }}
            >
              <View>
                <Text
                  style={{ textAlign: "center", marginTop: 5, fontSize: 16 }}
                >
                  Products
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  0
                </Text>
              </View>
              <View
                style={{
                  width: "30%",
                  // backgroundColor: "#006aff",
                  padding: 10,
                  borderBottomLeftRadius: 100,
                  borderBottomRightRadius: 100,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{
                    width: 90,
                    height: 90,
                    resizeMode: "cover",
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: "#fff",
                  }}
                  source={{ uri: `${xStore.logo}` }}
                />
              </View>
              <View>
                <Text
                  style={{ textAlign: "center", marginTop: 5, fontSize: 16 }}
                >
                  Stocks
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  0
                </Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text
                style={{
                  color: "#42414C",
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                @{xStore.storeHandle}
              </Text>
              <Text
                style={{
                  color: "#42414C",
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                {xStore.location}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          ></View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              paddingHorizontal: 20,
              marginTop: 20,
              height: 60,
              paddingVertical: 15,
              elevation: 2,
            }}
          ></View>

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
      )}
      {/* <View style={{ ...styles.buttonContainer }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditXStoreScreen")}
        >
          <View style={styles.button}>
            <AntDesign name="edit" size={20} color="white" />
          </View>
        </TouchableOpacity>
        <View style={{ marginVertical: 5 }}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate("TvInsightScreen")}
        >
          <View style={styles.button}>
            <Ionicons name="ios-stats" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View> */}
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
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 30,
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
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#006eff",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  buttonText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    marginRight: 5,
  },
});
