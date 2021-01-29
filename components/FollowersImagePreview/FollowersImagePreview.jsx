import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableWithoutFeedback, View } from "react-native";
import { useSelector } from "react-redux";
import { firestore } from "../../firebase/firebase.utils";
import { styles } from "./styles";

const FollowersImagePreview = ({ userId }) => {
  const [friend, setFriend] = useState({});
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  useEffect;
  useEffect(() => {
    getUser();
  }, []);
  async function getUser() {
    const userRef = firestore.collection("users").doc(userId);
    const userSnapshot = await userRef.get();
    if (userSnapshot.exists) {
      setFriend(userSnapshot.data());
    }
  }
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        friend.id === user.id
          ? navigation.navigate("ProfileScreen")
          : navigation.navigate("UserProfileScreen", {
              userId: friend.id,
            });
      }}
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: friend.profile_pic }} />
        </View>
        <Text numberOfLines={1} style={styles.username}>
          {friend.username ? friend.username.substring(0, 6) : null}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FollowersImagePreview;
