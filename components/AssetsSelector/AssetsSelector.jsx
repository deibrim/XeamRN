import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { getAssetsAsync } from "expo-media-library";
import { AssetsSelectorList } from "./AssetsSelectorList";
import { DefaultTopNavigator } from "./DefaultTopNavigator";

const defaultOptions = {
  assetsType: ["video", "photo"],
  maxSelections: 5,
  margin: 2,
  portraitCols: 4,
  landscapeCols: 6,
  widgetWidth: 100,
  widgetBgColor: "white",
  videoIcon: {
    Component: null,
    iconName: "",
    color: "white",
    size: 20,
  },
  selectedIcon: {
    Component: null,
    iconName: "ios-checkmark-circle-outline",
    color: "white",
    bg: "#ffffff50",
    size: 28,
  },
  CustomTopNavigator: {
    Component: null,
    props: {},
  },
  noAssets: {
    Component: () => <View />,
  },
  onError: () => {},
};

const AssetsSelector = ({ options = defaultOptions }) => {
  const {
    assetsType,
    maxSelections,
    margin,
    portraitCols,
    landscapeCols,
    videoIcon,
    selectedIcon,
    defaultTopNavigator,
    CustomTopNavigator,
    noAssets,
    onError,
  } = options;
  const [loading, setLoading] = useState(false);
  const getScreen = () => Dimensions.get("screen");

  const { width, height } = useMemo(() => getScreen(), []);

  const COLUMNS = height >= width ? portraitCols : landscapeCols;

  const [selectedItems, setSelectedItems] = useState([]);

  const [permissions, setPermissions] = useState({
    hasCameraPermission: false,
    hasCameraRollPermission: false,
  });

  const [availableOptions, setAvailableOptions] = useState({
    first: 500,
    totalCount: 0,
    after: "",
    endCursor: "",
    hasNextPage: true,
  });

  const [assetItems, setItems] = useState([]);

  const loadAssets = useCallback(
    (params) => {
      // Loading to true
      setLoading(true);
      getAssetsAsync(params)
        .then(({ endCursor, assets, hasNextPage }) => {
          if (availableOptions.after === endCursor) return;
          const newAssets = assets;
          setAvailableOptions({
            ...availableOptions,
            after: endCursor,
            hasNextPage: hasNextPage,
          });
          // Loading to false
          setLoading(false);
          return setItems([...assetItems, ...newAssets]);
        })
        .catch((err) => onError && onError(err));
    },
    [assetItems, permissions.hasCameraPermission]
  );

  const getCameraPermissions = useCallback(async () => {
    // const { status: CAMERA }: any = await Permissions.askAsync(
    //     Permissions.CAMERA
    // )

    // const { status: CAMERA_ROLL }: any = await Permissions.askAsync(
    //     Permissions.MEDIA_LIBRARY
    // )

    setPermissions({
      hasCameraPermission: true,
      hasCameraRollPermission: true,
    });
  }, []);

  const onClickUseCallBack = useCallback((id) => {
    setSelectedItems((selectedItems) => {
      // const alreadySelected = selectedItems.indexOf(id) >= 0;
      // if (selectedItems.length >= maxSelections && !alreadySelected)
      //   return selectedItems;

      // if (alreadySelected) return selectedItems.filter((item) => item !== id);
      // else return [...selectedItems, id];
      return [...selectedItems, id];
    });
  }, []);

  useEffect(() => {
    getAssets();
    if (selectedItems.length) {
      defaultTopNavigator.doneFunction(prepareResponse());
      setSelectedItems([]);
    }
  }, [
    assetsType,
    permissions.hasCameraPermission,
    permissions.hasCameraRollPermission,
    selectedItems,
  ]);

  const getAssets = () => {
    if (availableOptions.hasNextPage) {
      const params = {
        first: 200,
        mediaType: assetsType,
        sortBy: ["creationTime"],
      };
      if (availableOptions.after) params["after"] = availableOptions.after;
      if (!availableOptions.hasNextPage) return;

      return permissions.hasCameraRollPermission
        ? loadAssets(params)
        : getCameraPermissions();
    }
  };

  const prepareResponse = useCallback(
    () =>
      assetItems
        .filter((asset) => selectedItems.indexOf(asset.id) !== -1)
        .sort(
          (a, b) => selectedItems.indexOf(a.id) - selectedItems.indexOf(b.id)
        ),
    [selectedItems]
  );

  return (
    <View
      style={{
        backgroundColor: "#ecf2fa",
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      {CustomTopNavigator && CustomTopNavigator.Component && (
        <CustomTopNavigator.Component
          {...CustomTopNavigator.props}
          onFinish={() =>
            CustomTopNavigator?.props.doneFunction(prepareResponse())
          }
        />
      )}
      {defaultTopNavigator && (
        <DefaultTopNavigator
          textStyle={defaultTopNavigator.textStyle}
          buttonStyle={defaultTopNavigator.buttonStyle}
          backText={defaultTopNavigator.goBackText}
          finishText={defaultTopNavigator.continueText}
          selected={selectedItems.length}
          backFunction={() => defaultTopNavigator.backFunction()}
          onFinish={() => defaultTopNavigator.doneFunction(prepareResponse())}
          loading={loading}
        />
      )}
      <View
        style={{
          marginVertical: 0,
          marginHorizontal: "auto",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          width: "100%",
          flex: 1,
        }}
      >
        <AssetsSelectorList
          cols={COLUMNS}
          margin={margin}
          data={assetItems}
          getMoreAssets={getAssets}
          onClick={onClickUseCallBack}
          selectedItems={selectedItems}
          screen={width / 100}
          selectedIcon={selectedIcon}
          videoIcon={videoIcon}
          noAssets={noAssets}
        />
      </View>
    </View>
  );
};

export default AssetsSelector;
