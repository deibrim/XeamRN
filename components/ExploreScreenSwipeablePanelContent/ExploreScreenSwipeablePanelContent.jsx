import { Ionicons, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image } from "react-native";
import PanelLinkItem from "../PanelLinkItem/PanelLinkItem";
import { toggleShowBottomNavbar } from "../../redux/settings/actions";
import { styles } from "./styles";
const ExploreScreenSwipeablePanelContent = ({
  setModalVisible,
  setQrCodeScannerModalVisible,
  setIsPanelActive,
  activeQrCode,
  setActiveQrCode,
}) => {
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
          Share / Scan
        </Text>
      </View>
      <View style={{ padding: 20 }}>
        <PanelLinkItem
          onPress={() => {
            dispatch(toggleShowBottomNavbar(false));
            setIsPanelActive(false);
            navigation.navigate("ProfileScreen");
          }}
          icon={
            <View style={styles.imageContainer}>
              <Image
                style={styles.profilePic}
                source={{
                  uri: user.profile_pic,
                }}
              />
            </View>
          }
          title={"Profile"}
        />
        <PanelLinkItem
          onPress={() => {
            dispatch(toggleShowBottomNavbar(false));
            setIsPanelActive(false);
            setQrCodeScannerModalVisible(true);
          }}
          icon={
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={22}
              color="black"
              style={{ paddingBottom: 15 }}
            />
          }
          title={"Scan Qrcode"}
        />
        <PanelLinkItem
          onPress={() => {
            dispatch(toggleShowBottomNavbar(false));
            setIsPanelActive(false);
            setActiveQrCode("myqr");
            setModalVisible(true);
          }}
          icon={
            <Fontisto
              name="qrcode"
              size={22}
              color="black"
              style={{ paddingBottom: 15 }}
            />
          }
          title={"Share My Qrcode"}
        />

        {user.isTvActivated ? (
          <PanelLinkItem
            onPress={() => {
              dispatch(toggleShowBottomNavbar(false));
              setIsPanelActive(false);
              setActiveQrCode("tvqr");
              setModalVisible(true);
            }}
            icon={
              <Fontisto
                name="qrcode"
                size={22}
                color="black"
                style={{ paddingBottom: 15 }}
              />
            }
            title={"Share Tv Qrcode"}
          />
        ) : null}

        {user.isBusinessAccount ? (
          <PanelLinkItem
            onPress={() => {
              dispatch(toggleShowBottomNavbar(false));
              setIsPanelActive(false);
              setActiveQrCode("storeqr");
              setModalVisible(true);
            }}
            icon={
              <Fontisto
                name="qrcode"
                size={22}
                color="black"
                style={{ paddingBottom: 15 }}
              />
            }
            title={"Share Store Qrcode"}
            noBorder={true}
          />
        ) : null}
      </View>
    </>
  );
};

export default ExploreScreenSwipeablePanelContent;
