import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  // Dimensions,
  // FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import AppButton from "../../components/AppButton/AppButton";
import CustomInput from "../../components/CustomInput/CustomInput";
// import ProductPreview from "../../components/ProductPreview/ProductPreview";
// import TopSellingProductPreview from "../../components/TopSellingProductPreview/TopSellingProductPreview";
import XStoreNewProducts from "../../components/XStoreNewProducts/XStoreNewProducts";
import XStoreProductsOnSale from "../../components/XStoreProductsOnSale/XStoreProductsOnSale";
import XStoreProductsTopSelling from "../../components/XStoreProductsTopSelling/XStoreProductsTopSelling";
import XStoreRecommendedStore from "../../components/XStoreRecommendedStore/XStoreRecommendedStore";
import { firestore } from "../../firebase/firebase.utils";
import { styles } from "./styles";

const XStoreProductsScreen = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const bagSize = useSelector((state) => state.shopping.bagSize);
  const navigation = useNavigation();
  const [active, setActive] = useState("home");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loadingTopSelling, setLoadingTopSelling] = useState(true);
  const [topSellingAvailable, setTopSellingAvailable] = useState(true);
  const [loadingNewProduct, setLoadingNewProduct] = useState(true);
  const [newProductAvailable, setNewProductAvailable] = useState(false);
  const [loadingOnSaleProduct, setLoadingOnSaleProduct] = useState(true);
  const [onSaleProductAvailable, setOnSaleProductAvailable] = useState(false);
  const [isTimelineEmpty, setIsTimelineEmpty] = useState(false);
  const [topSelling, setTopSelling] = useState([]);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [newProducts, setNewProducts] = useState([
    {
      name: 'Nike Adapt BB 2.0 "Tie-Dye" Basketball Shoe',
      price: 350,
      images: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-9cfea66d-b519-4b29-8e43-ce4164e8c558/adapt-bb-2-tie-dye-basketball-shoe-vdFwKS.jpg",
      ],
    },
    {
      name: "Nike Joyride",
      price: 400,
      images: [
        "https://static.nike.com/a/images/w_1536,c_limit/9de44154-c8c3-4f77-b47e-d992b7b96379/image.jpg",
      ],
    },
  ]);
  const productRefs = firestore
    .collection("productTimeline")
    .doc(currentUser.id)
    .collection("products");
  useEffect(() => {
    getStoreTimeline();
    getTopSelling();
  }, []);
  async function getStoreTimeline() {
    setLoading(true);
    const userRef = firestore
      .collection("productTimeline")
      .doc(currentUser.id)
      .collection("products");
    const snapShot = await userRef.get();
    if (snapShot.size > 0) {
    } else {
      setIsTimelineEmpty(true);
      setActive("recommend");
      // TODO: Fetch Suggested Stores to follow
    }
    // setXStore(snapShot.data());
  }
  async function getTopSelling() {
    productRefs.orderBy("orders", "desc").limit(3);
    const snapshot = await productRefs.get();
    const productsArr = [];
    snapshot.docs.forEach((doc) => {
      productsArr.push(doc.data());
    });
    setTopSelling(productsArr);
    setLoadingTopSelling(false);
  }
  async function getNewProducts() {
    productRefs.orderBy("timestamp", "desc").limit(3);
    const snapshot = await productRefs.get();
    const productsArr = [];
    snapshot.docs.forEach((doc) => {
      productsArr.push(doc.data());
    });
    setNewProducts(productsArr);
    setLoadingNewProduct(false);
  }
  async function getSales() {
    productRefs.orderBy("oPrice", "desc").limit(3);
    const snapshot = await productRefs.get();
    const productsArr = [];
    snapshot.docs.forEach((doc) => {
      productsArr.push(doc.data());
    });
    setSales(productsArr);
    setLoadingSales(false);
  }
  return (
    <>
      <View
        style={
          searching
            ? styles.header
            : { ...styles.header, elevation: 4, paddingBottom: 10 }
        }
        // style={styles.header}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {}}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            {/* <Ionicons name="ios-arrow-back" size={24} color="black" /> */}
            <Text
              style={{
                color: "#42414C",
                fontSize: 16,
                // marginLeft: 10,
                marginBottom: 1,
              }}
            >
              XStore
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {!isTimelineEmpty && (
            <TouchableOpacity onPress={() => setSearching(true)}>
              <Feather
                name="search"
                size={20}
                color="black"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.topButton]} onPress={() => {}}>
            <Feather name="shopping-bag" size={18} color="black" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 14,
                letterSpacing: 1,
                fontWeight: "bold",
              }}
            >
              {bagSize}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 60, backgroundColor: "#ecf2fa", paddingLeft: 10 }}>
        {filterButtons(
          active,
          setActive,
          onSaleProductAvailable,
          isTimelineEmpty
        )}
      </View>
      {isTimelineEmpty ? (
        <NoProduct />
      ) : (
        <ScrollView style={styles.container}>
          <XStoreProductsTopSelling
            user={currentUser}
            setLoadingTopSelling={setLoadingTopSelling}
            setTopSellingAvailable={setTopSellingAvailable}
          />
          {/* <FlatList
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
          renderItem={(item) => <TopSellingProductPreview data={item.item} />}
        /> */}
          <View style={styles.newProductSection}>
            {newProductAvailable ? (
              <Text style={[styles.sectionTitle, { fontSize: 14 }]}>
                NEWLY ADDED
              </Text>
            ) : null}
            <XStoreNewProducts
              user={currentUser}
              setLoadingNewProduct={setLoadingNewProduct}
              setNewProductAvailable={setNewProductAvailable}
            />
            {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 10 }}
          >
            {newProducts.map((item, index) => (
              <ProductPreview key={index} data={item} />
            ))}
            <View style={{ width: 10 }}></View>
          </ScrollView> */}
          </View>
          <View style={styles.newProductSection}>
            {onSaleProductAvailable ? (
              <Text style={[styles.sectionTitle, { fontSize: 14 }]}>SALES</Text>
            ) : null}
            <XStoreProductsOnSale
              user={currentUser}
              setLoadingOnSaleProduct={setLoadingOnSaleProduct}
              setOnSaleProductAvailable={setOnSaleProductAvailable}
            />
            {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 10 }}
          >
            {newProducts.map((item, index) => (
              <ProductPreview key={index} data={item} />
            ))}
            <View style={{ width: 10 }}></View>
          </ScrollView> */}
          </View>
        </ScrollView>
      )}

      {searching ? (
        <View
          style={{
            ...styles.moreModalContainer,
            alignItems: "flex-start",
            backgroundColor: "#ffffff",
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
      <View style={{ ...styles.buttonContainer }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ExploreScreen");
          }}
        >
          <View
            style={[
              styles.button,
              {
                backgroundColor: "#006eff",
                height: 30,
                width: "auto",
                borderRadius: 25,
                paddingHorizontal: 10,
              },
            ]}
          >
            <Ionicons name="md-arrow-back" size={20} color="white" />
            <Text style={{ color: "#ffffff", marginLeft: 5 }}>Explore</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default XStoreProductsScreen;
function filterButtons(
  active,
  setActive,
  onSaleProductAvailable,
  isTimelineEmpty
) {
  function FilterButton({ title, value }) {
    return (
      <AppButton
        title={title}
        customStyle={
          active === value
            ? { ...styles.btn }
            : { ...styles.btn, backgroundColor: "#ecf2fa", elevation: 5 }
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
      {!isTimelineEmpty && <FilterButton title={"Home"} value={"home"} />}
      {onSaleProductAvailable && (
        <FilterButton title={"On Sale"} value={"all"} />
      )}
      <FilterButton title={"Recommended"} value={"recommend"} />
    </ScrollView>
  );
}

function NoProduct() {
  const user = useSelector((state) => state.user.currentUser);
  const [loadingRecommendedStores, setLoadingRecommendedStores] = useState(
    true
  );
  return (
    <ScrollView style={styles.container}>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={[styles.trendingIssuesHeadText]}>
          Follow more store to see their products on your timeline
        </Text>
      </View>
      <XStoreRecommendedStore
        user={user}
        setLoadingRecommendedStores={setLoadingRecommendedStores}
      />
    </ScrollView>
  );
}
