import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { firestore } from "../../firebase/firebase.utils";
import { styles } from "./styles";

const FollowersImagePreview = ({ userId }) => {
  const [friend, setFriend] = useState({});
  useEffect;
  useEffect(() => {
    getUser();
  }, []);
  async function getUser() {
    const userRef = firestore.collection("users").doc(userId);
    const userSnapshot = await userRef.get();
    if (userSnapshot.exists) {
      console.log(
        userSnapshot.data().profile_pic,
        userSnapshot.data().username,
        userSnapshot.data().id
      );
      setFriend(userSnapshot.data());
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: friend.profile_pic }} />
      </View>
      <Text numberOfLines={1} style={styles.username}>
        {friend.username ? friend.username.substring(0, 6) : null}
      </Text>
    </View>
  );
};

export default FollowersImagePreview;
