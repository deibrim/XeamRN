import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

const UserStoreScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="ios-arrow-back"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.title}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.container}>
        <Text>Products</Text>
      </ScrollView>
    </>
  );
};

export default UserStoreScreen;
