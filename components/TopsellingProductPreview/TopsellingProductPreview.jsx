import { Fontisto } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Image, Text, TouchableWithoutFeedback } from "react-native";
import { styles } from "./styles";
const TopSellingProductPreview = (props) => {
  const { images, name, price } = props.data;
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("ProductDetailScreen", {
          productData: props.data,
        });
      }}
    >
      <View style={styles.productCard}>
        <Image
          source={{
            uri: images[0],
          }}
          style={styles.productCardImage}
          resizeMode={"cover"}
        />
        <View style={styles.productCardFooter}>
          <View
            style={{
              backgroundColor: "#00000095",
              minHeight: 40,
              borderBottomRightRadius: 12,
              borderBottomLeftRadius: 12,
              justifyContent: "center",
              padding: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: 10,
              }}
            >
              <Text
                style={[
                  styles.productCardFooterText,
                  {
                    fontSize: 13,
                    fontWeight: "bold",
                    marginLeft: 10,
                    marginTop: 5,
                  },
                ]}
              >
                ${price}
              </Text>
              <Text
                numberOfLines={2}
                ellipsizeMode={"tail"}
                style={styles.productCardFooterText}
              >
                {" ***Top Selling***"}
                {/* {name} */}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  opacity: 0.7,
                }}
              >
                <Fontisto name="star" size={15} color="yellow" />
                <Text
                  style={{
                    ...styles.productCardFooterText,
                    color: "#f8f8f8",
                    marginTop: 2,
                    marginLeft: 5,
                  }}
                >
                  {4.9}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TopSellingProductPreview;
