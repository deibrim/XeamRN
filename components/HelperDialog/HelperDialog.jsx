import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

const HelperDialog = ({ visible, setDialogVisible, children, title }) => {
  return (
    <Modal
      animationType="fade"
      statusBarTranslucent={true}
      transparent={true}
      visible={visible}
      style={styles.modal}
      position="bottom"
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setDialogVisible(false);
        }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#00000056",
        }}
      >
        <View
          style={{
            paddingVertical: 5,
            paddingHorizontal: 10,
            backgroundColor: "#ffffff",
            width: "90%",
            borderRadius: 10,
            // elevation: 4,
          }}
        >
          <View style={{ minHeight: 100 }}>
            <View style={styles.customDialogTitle}>
              <Text
                style={[
                  styles.username,
                  { textAlign: "center", fontSize: 16, fontWeight: "bold" },
                ]}
              >
                {title}
              </Text>
            </View>
            {children}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default HelperDialog;
