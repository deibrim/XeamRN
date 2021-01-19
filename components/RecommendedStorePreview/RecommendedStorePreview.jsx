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
import AppButton from "../AppButton/AppButton";
import { styles } from "./styles";

const RecommendedStorePreview = ({ data }) => {
  const user = useSelector((state) => state.user.currentUser);
  const [productCount, setCount] = useState(Number("0"));
  const [followerCount, setFollowerCount] = useState(Number("0"));
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    GetProductCount();
    getFollowers(data.id);
    checkIfFollowing(data.id);
  }, []);
  async function GetProductCount() {
    const countRef = firestore
      .collection("products")
      .doc(data.id)
      .collection("my_products");
    const snapshot = await countRef.get();
    setCount(Number(snapshot.size));
  }
  async function getFollowers(storeId) {
    const snapshot = await firestore
      .collection("xStoreFollowers")
      .doc(storeId)
      .collection("storeFollowers")
      .get();
    setFollowerCount(snapshot.docs.length - 1);
  }
  async function checkIfFollowing(storeId) {
    const doc = await firestore
      .collection("xStoreFollowers")
      .doc(storeId)
      .collection("storeFollowers")
      .doc(user.id)
      .get();
    setIsFollowing(doc.exists);
    setLoading(false);
  }
  const handleToggleFollow = () => {
    /* handleFollow and unFollow */

    if (isFollowing) {
      setIsFollowing(false);
      // handleUnfollowUser(storeId, currentUser.id);
      setFollowerCount(followerCount - 1);
    } else {
      setIsFollowing(true);
      // handleFollowUser(storeId, currentUser, user);
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
                    handleToggleFollow();
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
