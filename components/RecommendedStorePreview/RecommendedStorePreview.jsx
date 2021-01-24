import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { firestore } from "../../firebase/firebase.utils";
import {
  handleFollowStore,
  handleUnfollowStore,
} from "../../firebase/storeFunctions";
import AppButton from "../AppButton/AppButton";
import { styles } from "./styles";

const RecommendedStorePreview = ({ data }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [token, setToken] = useState("");
  const [productCount, setCount] = useState(Number("0"));
  const [followerCount, setFollowerCount] = useState(Number("0"));
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    getStoreData(data.id);
    GetProductCount(data.id);
    // getFollowers(data.id);
    checkIfFollowing(data.id);
  }, []);
  async function getStoreData(storeId) {
    const userRef = firestore.doc(`users/${storeId}`);
    const snapShot = await userRef.get();
    setToken(snapShot.data().push_token.data);
  }
  async function GetProductCount(storeId) {
    const countRef = firestore
      .collection("products")
      .doc(storeId)
      .collection("my_products");
    const snapshot = await countRef.get();
    setCount(Number(snapshot.size));
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
    console.log(doc.exists);
    setIsFollowing(doc.exists);
    setLoading(false);
  }
  const handleToggleFollow = (storeId) => {
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
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("UserStoreScreen", { storeId: data.id });
      }}
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <ImageBackground style={styles.background} source={{ uri: data.logo }}>
          <View style={styles.overlay}>
            <View style={styles.innerContainer}>
              <View style={styles.logoContainer}>
                <Image
                  style={styles.logo}
                  //   resizeMode={""}
                  source={{ uri: data.logo }}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.handle}>{data.storeHandle}</Text>
                <Text style={styles.count}>
                  {productCount} Product{productCount > 0 && "s"}
                </Text>
                {/* <Text style={styles.count}>
              {followerCount} Follower{followerCount > 0 && "s"}
            </Text> */}
              </View>

              <View style={{ marginTop: "auto", paddingBottom: 30 }}>
                <AppButton
                  title={isFollowing ? "UnFollow" : "Follow"}
                  onPress={() => {
                    handleToggleFollow(data.id);
                  }}
                  customStyle={{
                    height: 30,
                    paddingHorizontal: 30,
                  }}
                  textStyle={{ fontSize: 12, textAlign: "center" }}
                />
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

export default RecommendedStorePreview;
