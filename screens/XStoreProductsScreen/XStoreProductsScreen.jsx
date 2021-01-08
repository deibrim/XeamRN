import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import AppButton from "../../components/AppButton/AppButton";
import CustomInput from "../../components/CustomInput/CustomInput";
import ProductPreview from "../../components/ProductPreview/ProductPreview";
import TopsellingProductPreview from "../../components/TopsellingProductPreview/TopsellingProductPreview";
import { firestore } from "../../firebase/firebase.utils";
import { styles } from "./styles";

const XStoreProductsScreen = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const [active, setActive] = useState("home");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [newProducts, setNewProducts] = useState([
    {
      name: 'Nike Adapt BB 2.0 "Tie-Dye" Basketball Shoe',
      price: 350,
      uri:
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-9cfea66d-b519-4b29-8e43-ce4164e8c558/adapt-bb-2-tie-dye-basketball-shoe-vdFwKS.jpg",
    },
    {
      name: "Nike Joyride",
      price: 400,
      uri:
        "https://static.nike.com/a/images/w_1536,c_limit/9de44154-c8c3-4f77-b47e-d992b7b96379/image.jpg",
    },
  ]);
  useEffect(() => {
    getStoreTimeline();
  }, []);
  async function getStoreTimeline() {
    setLoading(true);
    const userRef = firestore.doc(`xeamStoreTimeline/${currentUser.id}`);
    const snapShot = await userRef.get();
    // setXStore(snapShot.data());
  }
  return (
    <>
      <View
        style={searching ? styles.header : { ...styles.header, elevation: 4 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="ios-arrow-back" size={24} color="black" />
            <Text
              style={{
                color: "#42414C",
                fontSize: 16,
                marginLeft: 10,
                marginBottom: 1,
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => setSearching(true)}>
            <Feather
              name="search"
              size={18}
              color="black"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 60, backgroundColor: "#ecf2fa" }}>
        {filterButtons(active, setActive)}
      </View>
      <ScrollView style={styles.container}>
        <FlatList
          contentContainerStyle={{}}
          style={{}}
          snapToInterval={Dimensions.get("screen").width}
          snapToAlignment={"start"}
          decelerationRate={"fast"}
          showsHorizontalScrollIndicator={true}
          horizontal
          data={newProducts}
          initialScrollIndex={0}
          initialNumToRender={3}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => <TopsellingProductPreview data={item.item} />}
        />
        <View style={styles.newProductSection}>
          <Text style={styles.sectionTitle}>New Products</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 10 }}
          >
            {newProducts.map((item, index) => (
              <ProductPreview key={index} data={item} />
            ))}
            <View style={{ width: 10 }}></View>
          </ScrollView>
        </View>
        <View style={styles.newProductSection}>
          <Text style={styles.sectionTitle}>Sales</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 10 }}
          >
            {newProducts.map((item, index) => (
              <ProductPreview key={index} data={item} />
            ))}
            <View style={{ width: 10 }}></View>
          </ScrollView>
        </View>
      </ScrollView>
      <View style={{ ...styles.buttonContainer }}></View>
      {searching ? (
        <View
          style={{
            ...styles.moreModalContainer,
            alignItems: "flex-start",
            backgroundColor: "transparent",
            paddingTop: 35,
            flexDirection: "row",
            paddingRight: 30,
          }}
        >
          <CustomInput
            onChange={(e) => {
              setQuery(e);
              setSearchLoading(true);
            }}
            value={query}
            placeholder={"Search product"}
            icon={
              searchLoading ? (
                <Image
                  style={{ marginLeft: 5, width: 18, height: 18 }}
                  source={require("../../assets/loader.gif")}
                />
              ) : (
                <Feather name="search" size={18} color="black" />
              )
            }
            iStyle={{ padding: 0, height: 40, paddingLeft: 10 }}
            cStyle={{ paddingLeft: 10, height: 40, margin: 0, flex: 1 }}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 25,
                height: 25,
                borderRadius: 20,
                elevation: 2,
                marginTop: 10,
                backgroundColor: "#ff4747",
              }}
              onPress={() => {
                setQuery("");
                setSearching(false);
              }}
            >
              <AntDesign name="close" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default XStoreProductsScreen;
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
      contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
      showsHorizontalScrollIndicator={false}
      style={{ height: 60 }}
    >
      <FilterButton title={"Home"} value={"home"} />
      <FilterButton title={"On Sale"} value={"all"} />
      <FilterButton title={"Recomendation"} value={"about"} />
    </ScrollView>
  );
}