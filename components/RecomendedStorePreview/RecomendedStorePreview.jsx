import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { firestore } from "../../firebase/firebase.utils";
import AppButton from "../AppButton/AppButton";
import { styles } from "./styles";

const RecomendedStorePreview = ({ data }) => {
  const user = useSelector((state) => state.user.currentUser);
  const [productCount, setCount] = useState(Number("0"));
  const navigation = useNavigation();
  useEffect(() => {
    GetProductCount();
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
      .doc(currentUser.id)
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
        <View style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              //   resizeMode={""}
              source={{ uri: data.logo }}
            />
          </View>
          <View>
            <Text style={styles.handle}>{data.storeHandle}</Text>
            <Text style={styles.count}>{productCount} Products</Text>
          </View>

          <View style={{ marginTop: "auto", paddingBottom: 20 }}>
            <AppButton
              title={"Follow"}
              customStyle={{
                height: 30,
                // width: "100%",
                paddingHorizontal: 30,
              }}
              textStyle={{ fontSize: 12, textAlign: "center" }}
            />
          </View>
          {/* <View>
          <Text style={styles.heading}>About store</Text>
          <Text style={styles.paragraph}>About store</Text>
        </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecomendedStorePreview;
