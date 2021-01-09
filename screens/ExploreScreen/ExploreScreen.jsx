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
  const [searching, setSearching] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const findUser = async (e) => {
    query.trim() === "" ? setFoundUsers([]) : null;
    if (query.trim() === "") {
      return;
    }
    setSearching(true);
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
      .orderBy("username", "asc");
    // .startAt(query.toLowerCase())
    // .endAt(query.toLowerCase() + "\uf8ff");
    const usersArr = [];
    (await usersRef.get()).docs.forEach((doc) => {
      setSearching(false);
      if (doc.data().username.toLowerCase().includes(query)) {
        usersArr.push(doc.data());
      }
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
          onPress={() => navigation.navigate("XStoreProductsScreen")}
        >
          <AntDesign name="isv" size={24} color="gray" />
        </TouchableOpacity>
        <CustomInput
          onChange={(e) => {
            setSearching(false);
            findUser(e);
            setQuery(e);
          }}
          value={query}
          placeholder={"Search users"}
          icon={<Feather name="search" size={20} color="black" />}
          otherIcon={
            searching ? (
              <Image
                style={{ marginRight: 10, width: 18, height: 18 }}
                source={require("../../assets/loader.gif")}
              />
            ) : query ? (
              <TouchableOpacity
                onPress={() => {
                  findUser(query);
                }}
              >
                <Feather
                  name="arrow-right"
                  size={20}
                  color="black"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
            ) : null
          }
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
        <View
          style={{
            height: 50,
            backgroundColor: "#ecf2fa",
            justifyContent: "center",
          }}
        >
          {filterButtons(active, setActive)}
        </View>

        <FlatList
          data={foundUsers}
          renderItem={({ item }) => foundUserPreview(item, user, navigation)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </>
  );
}

function foundUserPreview(item, user, navigation) {
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
            <Text
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={styles.highlight}
            >
              {item.name} {item.headline && "|"} {item.headline}
            </Text>
          </View>
          <View style={{ marginLeft: "auto" }}>
            {item.isTvActivated && (
              <TouchableOpacity
                onPress={() => {
                  item.id === user.id
                    ? navigation.navigate("TvProfileScreen")
                    : navigation.navigate("UserTvProfileScreen", {
                        userTvId: item.id,
                      });
                }}
              >
                <View style={styles.button}>
                  <Feather name="tv" size={14} color="white" />
                </View>
              </TouchableOpacity>
            )}
            {item.isBusinessAccount && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("UserStoreScreen", { storeId: item.id })
                }
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
      showsHorizontalScrollIndicator={false}
      style={{ paddingHorizontal: 5, height: 65, paddingVertical: 10 }}
    >
      <FilterButton title={"All"} value={"all"} />
      <FilterButton title={"People"} value={"people"} />
      <FilterButton title={"Giveaways"} value={"giveaways"} />
      <FilterButton title={"Tags"} value={"tags"} />
    </ScrollView>
  );
}
