import { AntDesign, Feather } from "@expo/vector-icons";
import CustomInput from "../CustomInput/CustomInput";
import React from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";

const ChatRoomUtils = ({
  helper: {
    scrollToBottom,
    showMore,
    searching,
    setShowMore,
    setSearching,
    searchLoading,
    query,
    setQuery,
    setSearchLoading,
    handleSearchMessages,
  },
}) => {
  return (
    <>
      {scrollToBottom ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              onScrollToBottom();
            }}
          >
            <View style={styles.button}>
              <Feather name="chevrons-down" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
      {showMore ? (
        <TouchableWithoutFeedback
          onPress={() => {
            setShowMore(false);
          }}
        >
          <View style={{ ...styles.moreModalContainer, bottom: 0 }}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.modalTextButton}
                onPress={() => {
                  setSearching(true);
                  setShowMore(false);
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Feather
                    name="search"
                    size={18}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.modalText}>Search</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      ) : null}
      {searching ? (
        <View
          style={{
            ...styles.moreModalContainer,
            alignItems: "flex-start",
            backgroundColor: "transparent",
            paddingTop: 35,
            flexDirection: "row",
            paddingRight: 20,
          }}
        >
          <CustomInput
            onChange={(e) => {
              setQuery(e);
              setSearchLoading(true);
              handleSearchMessages();
            }}
            value={query}
            placeholder={"Search message"}
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

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 20,
    zIndex: 1,
    minHeight: 80,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 80,
    right: 15,
    // zIndex: 99,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#006eff",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    width: 35,
    borderRadius: 20,
  },
  moreModalContainer: {
    position: "absolute",
    zIndex: 5,
    top: 0,
    right: 0,
    left: 0,
    alignItems: "flex-end",
    backgroundColor: "transparent",
    paddingTop: 85,
  },
  modalContainer: {
    alignItems: "center",
    minHeight: 20,
    minWidth: 150,
    maxWidth: 150,
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  modalTextButton: {
    flexDirection: "row",
    marginVertical: 3,
    paddingVertical: 5,
  },
  modalText: {
    color: "#111111",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ChatRoomUtils;
