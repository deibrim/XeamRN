import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { View, Text } from "react-native";
import PanelLinkItem from "../PanelLinkItem/PanelLinkItem";
import { toggleShowBottomNavbar } from "../../redux/settings/actions";

const SwipeablePanelContent = ({ setModalVisible, setIsPanelActive }) => {
  const user = useSelector((state) => state.user.currentUser);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <>
      <View
        style={{
          width: "100%",
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#77777777",
          marginBottom: 5,
        }}
      >
        <Text
          style={{
            fontWeight: "600",
            fontSize: 16,
            letterSpacing: 2,
            textAlign: "center",
          }}
        >
          Add New
        </Text>
      </View>
      <View style={{ padding: 20 }}>
        <PanelLinkItem
          onPress={() => {
            dispatch(toggleShowBottomNavbar(false));
            setIsPanelActive(false);
            navigation.navigate("CameraScreen", { type: "feedReel" });
          }}
          icon={
            <MaterialCommunityIcons
              name="timeline-outline"
              size={22}
              color="black"
              style={{ paddingBottom: 15 }}
            />
          }
          title={"Feed Reel"}
        />
        {user.isTvActivated ? (
          <PanelLinkItem
            onPress={() => {
              dispatch(toggleShowBottomNavbar(false));
              setIsPanelActive(false);
              navigation.navigate("CameraScreen", { type: "tvReel" });
            }}
            icon={
              <Feather
                name="tv"
                size={22}
                color="black"
                style={{ paddingBottom: 15 }}
              />
            }
            title={"Tv Reel"}
          />
        ) : null}
        {user.isBusinessAccount ? (
          <PanelLinkItem
            onPress={() => {
              dispatch(toggleShowBottomNavbar(false));
              setIsPanelActive(false);
              navigation.navigate("CameraScreen", { type: "reveiw" });
            }}
            icon={
              <Feather
                name="video"
                size={22}
                color="black"
                style={{ paddingBottom: 15 }}
              />
            }
            title={"Product Review / Unbox"}
          />
        ) : null}
        {user.isBusinessAccount ? (
          <PanelLinkItem
            onPress={() => {
              dispatch(toggleShowBottomNavbar(false));
              setIsPanelActive(false);
              setModalVisible(true);
            }}
            icon={
              <AntDesign
                name="isv"
                size={22}
                color="black"
                style={{ paddingBottom: 15 }}
              />
            }
            title={"Store Product"}
            noBorder={true}
          />
        ) : null}
      </View>
    </>
  );
};

export default SwipeablePanelContent;
