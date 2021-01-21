import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { firestore } from "../../firebase/firebase.utils";

const FollowersImagePreview = ({ userId }) => {
  const [friend, setFriend] = useState({});
  useEffect;
  useEffect(() => {
    getUser();
  }, []);
  async function getUser() {
    console.log("====================================");
    console.log(userId);
    console.log("====================================");
    const userRef = firestore.collection("users").doc(userId);
    const userSnapshot = await userRef.get();
    if (userSnapshot.e) {
      setFriend(userSnapshot.data());
    }
  }
  return (
    <View>
      <Image source={{ uri: friend.profile_pic }} />
      <Text>{friend.username}</Text>
    </View>
  );
};

export default FollowersImagePreview;
