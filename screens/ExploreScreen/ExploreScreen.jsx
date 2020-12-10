import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import CustomInput from "../../components/CustomInput/CustomInput";
import { styles } from "./styles";
import { firestore } from "../../firebase/firebase.utils";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function ExploreScreen() {
  const [query, setQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const findUser = async (e) => {
    const usersRef = firestore
      .collection("users")
      .where("username", ">=", `${query.toLowerCase()}`)
      .orderBy("username", "desc");
    usersRef.onSnapshot((snapshot) => {
      const usersArr = [];
      snapshot.docs.forEach((doc) => {
        usersArr.push(doc.data());
        setFoundUsers(usersArr);
      });
    });
  };
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ScanCameraScreen")}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="gray" />
        </TouchableOpacity>
        <CustomInput
          onChange={(e) => {
            setQuery(e);
            findUser(e);
          }}
          value={query}
          placeholder={"Search users"}
          icon={<Feather name="search" size={20} color="black" />}
          iStyle={{ padding: 0, height: 40, paddingLeft: 10 }}
          cStyle={{ paddingLeft: 10, margin: 0, flex: 1 }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <View style={styles.imageContainer}>
              <Image
                style={styles.profilePic}
                source={{
                  uri: user.profile_pic,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <FlatList
          data={foundUsers}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                item.id === user.id
                  ? navigation.navigate("ProfileScreen")
                  : navigation.navigate("UserProfileScreen", {
                      userId: item.id,
                    });
              }}
            >
              <View style={styles.userContainer}>
                <View style={styles.lefContainer}>
                  <View style={{ position: "relative" }}>
                    <Image
                      source={{ uri: item.profile_pic }}
                      style={styles.avatar}
                    />
                  </View>
                  <View style={styles.midContainer}>
                    <Text style={styles.username}>
                      {item.username.split("")[0].toUpperCase() +
                        item.username.substring(1)}
                    </Text>
                    <Text numberOfLines={2} style={styles.highlight}>
                      {item.name} | {item.headline}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </>
  );
}
