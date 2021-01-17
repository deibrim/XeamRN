import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { styles } from "./styles";

const AboutInfoContaineer = ({ title, value }) => {
  const [visible, setVisible] = useState(false);
  const onTitlePress = () => {
    setVisible(!visible);
  };
  return (
    <View style={styles.infoContainer}>
      <View style={[styles.box, styles.theCompany]}>
        <TouchableWithoutFeedback onPress={onTitlePress}>
          <View style={styles.boxHead}>
            <Text style={styles.boxTitle}>{title}</Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color="black"
              style={{
                transform: [
                  {
                    rotate: visible ? "180deg" : "0deg",
                  },
                ],
              }}
            />
          </View>
        </TouchableWithoutFeedback>
        {visible ? (
          <View style={styles.infoContainerContent}>
            <Text>Shut the fuck up</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default AboutInfoContaineer;
