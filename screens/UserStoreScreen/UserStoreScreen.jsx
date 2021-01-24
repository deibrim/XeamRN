import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import AppButton from "../../components/AppButton/AppButton";
import ProductPreview from "../../components/ProductPreview/ProductPreview";
import TopSellingProductPreview from "../../components/TopSellingProductPreview/TopSellingProductPreview";
import { firestore } from "../../firebase/firebase.utils";
import {
  handleFollowStore,
  handleUnfollowStore,
} from "../../firebase/storeFunctions";
import { styles } from "./styles";

const UserStoreScreen = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const route = useRoute();
  const storeId = route.params.storeId;
  const [xStore, setXStore] = useState({});
  const [token, setToken] = useState("");
  const [active, setActive] = useState("home");
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [newProducts, setNewProducts] = useState([
    {
      name: 'Nike Adapt BB 2.0 "Tie-Dye" Basketball Shoe',
      price: 350,
      images: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-9cfea66d-b519-4b29-8e43-ce4164e8c558/adapt-bb-2-tie-dye-basketball-shoe-vdFwKS.jpg",
      ],
    },
    {
      name: "Nike Joyride",
      price: 400,
      images: [
        "https://static.nike.com/a/images/w_1536,c_limit/9de44154-c8c3-4f77-b47e-d992b7b96379/image.jpg",
      ],
    },
  ]);

  useEffect(() => {
    getStoreData(storeId);
    getFollowers(storeId);
    checkIfFollowing(storeId);
  }, []);
  async function getStoreData(storeId) {
    setLoading(true);
    const storeRef = firestore.doc(`xeamStores/${storeId}`);
    const userRef = firestore.doc(`users/${storeId}`);
    const snapShot = await userRef.get();
    setToken(snapShot.data().push_token.data);
    const storeSnapShot = await storeRef.get();
    setXStore(storeSnapShot.data());
  }
  async function getFollowers(storeId) {
    const snapshot = await firestore
      .collection("storeFollowers")
      .doc(storeId)
      .collection("followers")
      .get();
    setFollowerCount(snapshot.docs.length - 1);
  }
  async function checkIfFollowing(storeId) {
    const doc = await firestore
      .collection("storeFollowers")
      .doc(storeId)
      .collection("followers")
      .doc(currentUser.id)
      .get();
    setIsFollowing(doc.exists);
    setLoading(false);
  }
  const handleToggleFollow = () => {
    /* handleFollow and unFollow */

    if (isFollowing) {
      setIsFollowing(false);
      handleUnfollowStore(storeId, currentUser.id);
      setFollowerCount(followerCount - 1);
    } else {
      setIsFollowing(true);
      handleFollowStore(storeId, currentUser, token);
      setFollowerCount(followerCount + 1);
    }
  };
  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="ios-arrow-back"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.title}>{xStore && xStore.storeHandle}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.imageContainer, { marginLeft: "auto" }]}>
          <Image
            style={styles.profilePic}
            source={{
              uri: xStore.logo,
            }}
          />
        </View>
      </View>
      <View style={{ height: 60, backgroundColor: "#ecf2fa", paddingLeft: 10 }}>
        {filterButtons(active, setActive)}
      </View>
      <ScrollView style={styles.container}>
        <FlatList
          contentContainerStyle={{}}
          style={{}}
          snapToInterval={Dimensions.get("screen").width}
          snapToAlignment={"start"}
          decelerationRate={"fast"}
          showsHorizontalScrollIndicator={true}
          horizontal
          data={newProducts}
          initialScrollIndex={0}
          initialNumToRender={3}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => <TopSellingProductPreview data={item.item} />}
        />
        <View style={styles.newProductSection}>
          <Text style={[styles.sectionTitle, { fontSize: 14 }]}>
            NEW PRODUCTS
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 10 }}
          >
            {newProducts.map((item, index) => (
              <ProductPreview key={index} data={item} />
            ))}
            <View style={{ width: 10 }}></View>
          </ScrollView>
        </View>
        <View style={styles.newProductSection}>
          <Text style={[styles.sectionTitle, { fontSize: 14 }]}>SALES</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 10 }}
          >
            {newProducts.map((item, index) => (
              <ProductPreview key={index} data={item} />
            ))}
            <View style={{ width: 10 }}></View>
          </ScrollView>
        </View>
      </ScrollView>
      <View style={{ ...styles.buttonContainer }}>
        <TouchableOpacity onPress={() => handleToggleFollow()}>
          <View
            style={{
              ...styles.button,
              backgroundColor: "white",
            }}
          >
            {/* <Feather name="tv" size={20} color="white" /> */}
            <Text style={{ color: "#006aff" }}>
              {isFollowing ? "Unfollow Store" : "Follow Store"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default UserStoreScreen;
function filterButtons(active, setActive) {
  function FilterButton({ title, value }) {
    return (
      <AppButton
        title={title}
        customStyle={
          active === value
            ? { ...styles.btn }
            : { ...styles.btn, backgroundColor: "#ecf2fa", elvation: 5 }
        }
        textStyle={
          active === value
            ? { fontSize: 12 }
            : { fontSize: 12, color: "#555555" }
        }
        onPress={() => {
          setActive(value);
        }}
      />
    );
  }
  return (
    <ScrollView
      horizontal
      contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
      showsHorizontalScrollIndicator={false}
      style={{ height: 60 }}
    >
      <FilterButton title={"Home"} value={"home"} />
      <FilterButton title={"All Products"} value={"all"} />
      <FilterButton title={"About"} value={"about"} />
      <FilterButton title={"Reviews"} value={"reviews"} />
    </ScrollView>
  );
}
