import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import CustomInput from "../../components/CustomInput/CustomInput";
import { firestore } from "../../firebase/firebase.utils";
import AppButton from "../../components/AppButton/AppButton";
import FoundUserPreview from "../../components/FoundUserPreview/FoundUserPreview";
import FoundTagPreview from "../../components/FoundTagPreview/FoundTagPreview";
import ExploreFeed from "../../components/ExploreFeed/ExploreFeed";
import { toggleShowBottomNavbar } from "../../redux/settings/actions";
import { SwipeablePanel } from "rn-swipeable-panel";
import { styles } from "./styles";
import ExploreScreenSwipeablePanelContent from "../../components/ExploreScreenSwipeablePanelContent/ExploreScreenSwipeablePanelContent";
import QrCodeModal from "../../components/QrCodeModal/QrCodeModal";
import QrCodeScannerModal from "../../components/QrCodeScannerModal/QrCodeScannerModal";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default function ExploreScreen() {
  const [query, setQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [foundTags, setFoundTags] = useState([]);
  const [active, setActive] = useState("all");
  const [activeQrCode, setActiveQrCode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [qrCodeScannerModalVisible, setQrCodeScannerModalVisible] = useState(
    false
  );
  const user = useSelector((state) => state.user.currentUser);
  const [searching, setSearching] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const dispatch = useDispatch();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    navigation.navigate("ExploreScreen");
    query.trim() === "" ? setFoundUsers([]) : findUser(query);
  }, [query]);
  const findUser = async (e) => {
    if (active === "all") {
      setActive("people");
    }
    query.trim() === "" ? setFoundUsers([]) : null;
    if (query.trim() === "") {
      return;
    }
    setSearching(true);
    const usersRef = firestore
      .collection("users")
      .where("username", ">=", `${query.toLowerCase()}`)
      .orderBy("username", "asc");
    const usersArr = [];
    (await usersRef.get()).docs.forEach((doc) => {
      setSearching(false);
      if (doc.data().username.toLowerCase().includes(query)) {
        usersArr.push(doc.data());
      }
      setFoundUsers(usersArr);
    });
  };
  const findTag = async (e) => {
    query.trim() === "" ? setFoundTags([]) : null;
    if (query.trim() === "") {
      return;
    }
    setSearching(true);
    const tagsRef = firestore
      .collection("tags")
      .where("id", ">=", `#${query.toLowerCase()}`)
      .orderBy("id", "asc");
    const tagsArr = [];
    (await tagsRef.get()).docs.forEach((doc) => {
      setSearching(false);
      if (doc.data().id.toLowerCase().includes(query)) {
        tagsArr.push(doc.data());
      }
      setFoundTags(tagsArr);
    });
  };
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("XStoreProductsScreen")}
        >
          <AntDesign name="isv" size={24} color="gray" />
        </TouchableOpacity>
        <CustomInput
          onChange={(e) => {
            setSearching(false);
            if (active === "people") {
              findUser(e);
            } else if (active === "tags") {
              findTag(e);
            }
            setQuery(e);
          }}
          value={query}
          placeholder={"What's on your mind?"}
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
                  if (active === "people") {
                    findUser(e);
                  } else if (active === "tags") {
                    findTag(e);
                  }
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
            onPress={() => {
              dispatch(toggleShowBottomNavbar(true));
              setIsPanelActive(true);
            }}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="gray" />
          </TouchableOpacity>
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
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

        {active === "all" ? (
          <ExploreFeed />
        ) : active === "people" ? (
          <FlatList
            data={foundUsers}
            keyboardShouldPersistTaps={"handled"}
            renderItem={({ item }) => <FoundUserPreview item={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <FlatList
            data={foundTags}
            keyboardShouldPersistTaps={"handled"}
            renderItem={({ item }) => <FoundTagPreview item={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
      <SwipeablePanel
        fullWidth={true}
        onlySmall={false}
        onClose={() => {
          dispatch(toggleShowBottomNavbar(false));
          setIsPanelActive(false);
        }}
        onPressCloseButton={() => {
          dispatch(toggleShowBottomNavbar(false));
          setIsPanelActive(false);
        }}
        isActive={isPanelActive}
        style={{ backgroundColor: "#ecf2fa", height: 420 }}
        closeOnTouchOutside={true}
      >
        <ExploreScreenSwipeablePanelContent
          setModalVisible={setModalVisible}
          setQrCodeScannerModalVisible={setQrCodeScannerModalVisible}
          setIsPanelActive={setIsPanelActive}
          activeQrCode={activeQrCode}
          setActiveQrCode={setActiveQrCode}
        />
      </SwipeablePanel>
      <QrCodeModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        activeQrCode={activeQrCode}
      />
      <QrCodeScannerModal
        qrCodeScannerModalVisible={qrCodeScannerModalVisible}
        setQrCodeScannerModalVisible={setQrCodeScannerModalVisible}
      />
    </>
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
      <FilterButton title={"Explore"} value={"all"} />
      <FilterButton title={"People"} value={"people"} />
      <FilterButton title={"Giveaways"} value={"giveaways"} />
      <FilterButton title={"Tags"} value={"tags"} />
    </ScrollView>
  );
}
