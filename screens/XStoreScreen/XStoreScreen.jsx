import { AntDesign, Ionicons, Fontisto } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { firestore, auth } from "../../firebase/firebase.utils";
import { useNavigation } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";
import { setTvReels } from "../../redux/reel/actions";
import ReelPreview from "../../components/ReelPreview/ReelPreview";
import { styles } from "./styles";
import AppButton from "../../components/AppButton/AppButton";
import Graph from "../../components/Graph/Graph";

export default function XStoreScreen() {
  const user = useSelector((state) => state.user.currentUser);
  const xStore = useSelector((state) => state.user.currentUserXStore);
  const reels = useSelector((state) => state.reel.tvReels);
  const [followerCount, setFollowerCount] = useState(0);
  const [focused, setFocused] = useState("reels");
  const [filter, setFilter] = useState("thisWeek");
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
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("EditXStoreScreen")}
          >
            <AntDesign name="edit" size={20} color="black" />
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
                width: "30%",
                // backgroundColor: "#006aff",
                padding: 10,
                borderTopRightRadius: 100,
                borderBottomRightRadius: 100,
                flexDirection: "row",
                justifyContent: "flex-end",
                marginVertical: 20,
                marginRight: 10,
              }}
            >
              <Image
                style={{
                  width: 80,
                  height: 80,
                  resizeMode: "cover",
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: "#006eff",
                }}
                source={{ uri: `${xStore.logo}` }}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={{ color: "#42414C", fontSize: 14 }}>
                TOTAL REVENUE
              </Text>
              <Text
                style={{
                  color: "#006eff",
                  fontSize: 25,
                  fontWeight: "500",
                  fontWeight: "bold",
                }}
              >
                $2,050
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
                    fontSize: 12,
                    color: "gray",
                    marginRight: 10,
                    fontWeight: "bold",
                  }}
                >
                  10,010 orders
                </Text>
                <Text
                  style={{ fontSize: 12, color: "gray", fontWeight: "bold" }}
                >
                  1010 products
                </Text>
              </View>
            </View>
          </View>

          <ScrollView>
            <Graph
              Dimensions={Dimensions}
              filter={filter}
              setFilter={setFilter}
            />
            {/* {graph(Dimensions, filter, setFilter)} */}
            <View style={styles.section}>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.sectionTitle}>Top Selling</Text>
                {filterButtons(filter, setFilter, {
                  flexDirection: "row",
                })}
              </View>
            </View>
          </ScrollView>
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
          onPress={() => navigation.navigate("MyProductScreen")}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#444444", fontSize: 16 }}>My Products</Text>
            <Text
              style={{
                color: "#444444",
                fontSize: 18,
                marginLeft: 5,
                fontWeight: "bold",
              }}
            >
              {"10"}
            </Text>
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

function graph(Dimensions, filter, setFilter) {
  return (
    <View style={{ alignItems: "center", width: "100%" }}>
      <View
        style={{
          backgroundColor: "#609FF3",
          borderRadius: 16,
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: "#609FF3",
            borderRadius: 16,
            padding: 20,
            paddingBottom: 0,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Product Sold
            </Text>
            <View
              style={{
                backgroundColor: "green",
                borderRadius: 10,
                paddingHorizontal: 5,
                paddingVertical: 2,
                marginLeft: 5,
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              >
                {" + 20% "}
              </Text>
            </View>
          </View>
          {filterButtons(filter, setFilter, {
            flexDirection: "row",
            height: 65,
            paddingVertical: 10,
          })}
        </View>
        <LineChart
          data={{
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [
              {
                data: [100, 0, 0, 0, 0, 0, 0],
              },
            ],
          }}
          width={Dimensions.get("screen").width - 20}
          height={200}
          chartConfig={{
            backgroundColor: "#006eff",
            backgroundGradientFrom: "#227FFB",
            backgroundGradientTo: "#609FF3",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );
}

function filterButtons(filter, setFilter, styl) {
  return (
    <View style={styl}>
      <AppButton
        title={"This Week"}
        customStyle={
          filter === "thisWeek"
            ? { ...styles.btn, backgroundColor: "#ffffff", marginRight: 10 }
            : {
                ...styles.btn,
                backgroundColor: "#ecf2fa",
                elvation: 5,
                marginRight: 10,
              }
        }
        textStyle={{ fontSize: 12, color: "#006eff" }}
        onPress={() => {
          setFilter("thisWeek");
        }}
      />
      <AppButton
        title={"This Month"}
        customStyle={
          filter === "thisMonth"
            ? { ...styles.btn, backgroundColor: "#ffffff" }
            : { ...styles.btn, backgroundColor: "#ecf2fa", elvation: 5 }
        }
        textStyle={{ fontSize: 12, color: "#006eff" }}
        onPress={() => {
          setFilter("thisMonth");
        }}
      />
    </View>
  );
}
