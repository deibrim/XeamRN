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
import { firestore } from "../../firebase/firebase.utils";
import { useNavigation } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";
import { setTvReels } from "../../redux/reel/actions";
import { styles } from "./styles";
import AppButton from "../../components/AppButton/AppButton";
import Graph from "../../components/Graph/Graph";

export default function XStoreScreen() {
  const user = useSelector((state) => state.user.currentUser);
  const xStore = useSelector((state) => state.user.currentUserXStore);
  const [followerCount, setFollowerCount] = useState(0);
  const [focused, setFocused] = useState("reels");
  const [filter, setFilter] = useState("thisWeek");
  const [loading, setLoading] = useState(false);
  const [loadingTopSelling, setLoadingTopSelling] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [topSelling, setTopSelling] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    getFollowers(xStore.id);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(Date.now());

    switch (days[date.getDay()]) {
      case "Sun":
        let tFrom = timeFrom(1);
        let tStr = tFrom[tFrom.length - 1];
        console.log(tStr);
        break;
      case "Mon":
        tFrom = timeFrom(2);
        tStr = tFrom[tFrom.length - 1];
        console.log(tStr);
        break;
      case "Tue":
        tFrom = timeFrom(3);
        tStr = tFrom[tFrom.length - 1];
        console.log(tStr);
        break;
      case "Wed":
        tFrom = timeFrom(4);
        tStr = tFrom[tFrom.length - 1];
        console.log(tStr);
        break;
      case "Thu":
        tFrom = timeFrom(5);
        tStr = tFrom[tFrom.length - 1];
        console.log(tStr);
        break;
      case "Fri":
        tFrom = timeFrom(6);
        tStr = tFrom[tFrom.length - 1];
        console.log(tStr);
        break;
      case "Sat":
        tFrom = timeFrom(7);
        tStr = tFrom[tFrom.length - 1];
        console.log(tStr);
        break;
      default:
        break;
    }
    function timeFrom(val) {
      const dates = [];
      for (let I = 0; I < Math.abs(val); I++) {
        dates.push(
          Date.parse(
            new Date(
              new Date().getTime() -
                (val >= 0 ? I : I - I - I) * 24 * 60 * 60 * 1000
            ).toLocaleString()
          )
        );
      }
      return dates;
    }
    console.log(timeFrom(3));
    getProductCount();
    getOrderCount();
    getTopSelling();
  }, []);
  async function getProductCount() {
    const snapshot = await firestore
      .collection("products")
      .doc(xStore.id)
      .collection("my_products")
      .get();
    setProductCount(snapshot.size);
  }
  async function getOrderCount() {
    const snapshot = await firestore
      .collection("orders")
      .doc(xStore.id)
      .collection("my_orders")
      .get();
    setOrderCount(snapshot.size);
  }
  async function getTopSelling() {
    setLoadingTopSelling(true);
    const productRefs = await firestore
      .collection("products")
      .doc(xStore.id)
      .collection("my_products")
      .orderBy("orders")
      .limitToLast(3);
    const snapshot = await productRefs.get();
    const productsArr = [];
    snapshot.docs.forEach((doc) => {
      console.log(doc.data());
      productsArr.push(doc.data());
    });
    setTopSelling(productsArr);
    setLoadingTopSelling(false);
  }
  async function getFollowers(xStoreId) {
    // setLoading(true);
    const snapshot = await firestore
      .collection("xeamStoreFollowers")
      .doc(xStoreId)
      .collection("followers")
      .get();

    !snapshot.empty
      ? setFollowerCount(snapshot.docs.length)
      : setFollowerCount(0);
    // setLoading(false);
  }
  const onClick = () => {
    navigation.goBack();
  };

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
                  {orderCount} orders
                </Text>
                <Text
                  style={{ fontSize: 12, color: "gray", fontWeight: "bold" }}
                >
                  {productCount} products
                </Text>
              </View>
            </View>
            <View
              style={{
                marginLeft: "auto",
                alignItems: "center",
                paddingRight: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "gray",
                  marginRight: 10,
                  fontWeight: "500",
                }}
              >
                Followers
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "gray",
                  marginRight: 10,
                  fontWeight: "bold",
                }}
              >
                {followerCount}
              </Text>
            </View>
          </View>

          <ScrollView>
            <Graph
              Dimensions={Dimensions}
              filter={filter}
              setFilter={setFilter}
              title="Orders"
            />
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
              <ScrollView>
                {topSelling.map((item, index) => (
                  <TopSellingPreview key={index} data={item} />
                ))}
              </ScrollView>
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
              {productCount}
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

function TopSellingPreview({ data }) {
  const { images, name, price, orders } = data;
  return (
    <View
      style={{
        flex: 1,
        width: Dimensions.get("screen").width - 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
      }}
    >
      <Image
        source={{ uri: images[0] }}
        style={{ height: 45, width: 45, borderRadius: 10 }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: 20,
        }}
      >
        <View>
          <Text>{name}</Text>
          <Text>${price}</Text>
        </View>
        <Text>{orders}</Text>
        <Text>${price * 5}</Text>
      </View>
    </View>
  );
}
