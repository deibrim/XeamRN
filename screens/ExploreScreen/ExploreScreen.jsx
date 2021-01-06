import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import CustomInput from "../../components/CustomInput/CustomInput";
import { styles } from "./styles";
import { firestore } from "../../firebase/firebase.utils";
import AppButton from "../../components/AppButton/AppButton";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function ExploreScreen() {
  const [query, setQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [active, setActive] = useState("all");
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const findUser = async (e) => {
    query.trim() === "" ? setFoundUsers([]) : null;
    // const usersRef = firestore
    //   .collection("users")
    //   .where("username", ">=", `${query.toLowerCase()}`)
    //   .orderBy("username", "desc");
    // .startAt(query.toLowerCase());
    // .endAt(query.toLowerCase() + "\uf8ff");
    // .orderBy("username", "desc");
    const usersRef = firestore
      .collection("users")
      .where("username", ">=", `${query.toLowerCase()}`)
      .orderBy("username", "desc")
      // .startAt(query.toLowerCase())
      .endAt(query.toLowerCase() + "\uf8ff");
    const usersArr = [];
    (await usersRef.get()).docs.forEach((doc) => {
      usersArr.push(doc.data());
      setFoundUsers(usersArr);
    });
  };
  return (
    <>
      <View style={styles.header}>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate("ScanCameraScreen")}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="gray" />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => navigation.navigate("UserStoreScreen")}
        >
          <AntDesign name="isv" size={24} color="gray" />
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
        {filterButtons(active, setActive)}

        <FlatList
          data={foundUsers}
          renderItem={({ item }) => foundUserPreview(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </>
  );
}

function foundUserPreview(item) {
  return (
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
            <Image source={{ uri: item.profile_pic }} style={styles.avatar} />
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
          <View style={{ marginLeft: "auto" }}>
            {item.isTvActivated && (
              <TouchableOpacity
                onPress={() => navigation.navigate("TvProfileScreen")}
              >
                <View style={styles.button}>
                  <Feather name="tv" size={14} color="white" />
                </View>
              </TouchableOpacity>
            )}
            {item.isBusinessAccount && (
              <TouchableOpacity
                onPress={() => navigation.navigate("XStoreScreen")}
              >
                <View style={{ ...styles.button, backgroundColor: "#ffffff" }}>
                  <AntDesign name="isv" size={14} color="#006eff" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function filterButtons(active, setActive) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ paddingHorizontal: 5, height: 65, paddingVertical: 10 }}
    >
      <AppButton
        title={"All"}
        customStyle={
          active === "all"
            ? { ...styles.btn }
            : { ...styles.btn, backgroundColor: "#ecf2fa", elvation: 5 }
        }
        textStyle={
          active === "all"
            ? { fontSize: 12 }
            : { fontSize: 12, color: "#555555" }
        }
        onPress={() => {
          setActive("all");
        }}
      />
      <AppButton
        title={"People"}
        customStyle={
          active === "people"
            ? { ...styles.btn }
            : { ...styles.btn, backgroundColor: "#ecf2fa", elvation: 5 }
        }
        textStyle={
          active === "people"
            ? { fontSize: 12 }
            : { fontSize: 12, color: "#555555" }
        }
        onPress={() => {
          setActive("people");
        }}
      />
      {/* <AppButton
        title={"Tvs"}
        customStyle={
          active === "tv"
            ? { ...styles.btn }
            : { ...styles.btn, backgroundColor: "#ecf2fa", elvation: 5 }
        }
        textStyle={
          active === "tv"
            ? { fontSize: 12 }
            : { fontSize: 12, color: "#555555" }
        }
        onPress={() => {
          setActive("tv");
        }}
      />
      <AppButton
        title={"Stores"}
        customStyle={
          active === "store"
            ? { ...styles.btn }
            : { ...styles.btn, backgroundColor: "#ecf2fa", elvation: 5 }
        }
        textStyle={
          active === "store"
            ? { fontSize: 12 }
            : { fontSize: 12, color: "#555555" }
        }
        onPress={() => {
          setActive("store");
        }}
      /> */}
      <AppButton
        title={"Tags"}
        customStyle={
          active === "tag"
            ? { ...styles.btn }
            : { ...styles.btn, backgroundColor: "#ecf2fa", elvation: 5 }
        }
        textStyle={
          active === "tag"
            ? { fontSize: 12 }
            : { fontSize: 12, color: "#555555" }
        }
        onPress={() => {
          setActive("tag");
        }}
      />
    </ScrollView>
  );
}
