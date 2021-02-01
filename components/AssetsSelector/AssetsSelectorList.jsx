import React, { memo } from "react";
import {
  Image,
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";

const Item = ({
  id,
  screen,
  cols,
  selectedIndex,
  image,
  mediaType,
  onClick,
  margin,
  selectedIcon,
  videoIcon,
}) => {
  const handleClick = () => {
    onClick(id);
  };

  const { Component, color, iconName, size, bg } = selectedIcon;

  const {
    Component: VideoIndicator,
    color: VideoIndicatorColor,
    iconName: VideoIndicatorName,
    size: VideoIndicatorSize,
  } = videoIcon;

  return (
    <TouchableOpacity
      style={{
        width: Dimensions.get("screen").width / cols,
        height: Dimensions.get("screen").height / cols / 1.5,
        padding: margin,
      }}
      onPress={handleClick}
    >
      {mediaType === "video" && (
        <View
          style={{
            width: "25%",
            justifyContent: "center",
            alignItems: "center",
            height: "25%",
            position: "absolute",
            zIndex: 11,
            margin,
          }}
        >
          {VideoIndicator && VideoIndicatorName && (
            <VideoIndicator
              name={VideoIndicatorName}
              size={VideoIndicatorSize}
              color={VideoIndicatorColor}
            />
          )}
        </View>
      )}
      {selectedIndex >= 0 && (
        <View
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            zIndex: 10,
            backgroundColor: "#00000011",
            margin,
          }}
        >
          {Component && (
            <Component
              name={iconName}
              size={size}
              color={color}
              index={selectedIndex}
            />
          )}
        </View>
      )}
      <Image
        style={{ width: "100%", height: "100%" }}
        source={{ uri: image }}
      />
    </TouchableOpacity>
  );
};

const MemoizedAssetItem = memo(Item);

export const AssetsSelectorList = ({
  margin,
  data,
  selectedItems,
  onClick,
  getMoreAssets,
  cols,
  screen,
  selectedIcon,
  videoIcon,
  noAssets,
}) => {
  const _renderItem = ({ item }) => (
    <MemoizedAssetItem
      id={item.id}
      image={item.uri}
      mediaType={item.mediaType}
      selectedIndex={selectedItems.indexOf(item.id)}
      onClick={onClick}
      cols={cols}
      screen={screen}
      margin={margin}
      selectedIcon={selectedIcon}
      videoIcon={videoIcon}
    />
  );

  const _getItemLayout = (data, index) => {
    let length = screen / cols;
    return { length, offset: length * index, index };
  };

  const noAssetsComponent = () => <noAssets.Component />;

  return (
    <FlatList
      data={data}
      numColumns={cols}
      initialNumToRender={50}
      getItemLayout={_getItemLayout}
      renderItem={_renderItem}
      keyExtractor={(item) => item.id}
      extraData={selectedItems}
      onEndReached={() => getMoreAssets()}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={noAssetsComponent}
      style={{ backgroundColor: "#ecf2fa" }}
    />
  );
};
