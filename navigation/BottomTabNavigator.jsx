import { AntDesign, Octicons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/core";
import * as React from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import HomeScreen from "../screens/HomeScreen";
// import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen/EditProfileScreen";
import CameraScreen from "../screens/CameraScreen/CameraScreen";
import StoryViewScreen from "../screens/StoryViewScreen/StoryViewScreen";
import ReelScreen from "../screens/ReelScreen";
import FriendListScreen from "../screens/FriendListScreen";
import ChatRoomScreen from "../screens/ChatRoomScreen/ChatRoomScreen";
import ActivitiesScreen from "../screens/ActivitiesScreen/ActivitiesScreen";
import SettingsScreen from "../screens/SettingsScreen/SettingsScreen";
import EditChatScreen from "../screens/EditChatScreen/EditChatScreen";
import MoreAccountSettingScreen from "../screens/MoreAccountSettingScreen/MoreAccountSettingScreen";
import EditAndPostScreen from "../screens/EditAndPostScreen/EditAndPostScreen";
import ExploreScreen from "../screens/ExploreScreen/ExploreScreen";
import UserProfileScreen from "../screens/UserProfileScreen/UserProfileScreen";
import PostReelScreen from "../screens/PostReelScreen/PostReelScreen";
import ReportBugScreen from "../screens/ReportBugScreen/ReportBugScreen";
import AboutScreen from "../screens/AboutScreen/AboutScreen";
import SuggestFeatureScreen from "../screens/SuggestFeatureScreen/SuggestFeatureScreen";
import TvGetStartedScreen from "../screens/TvGetStartedScreen/TvGetStartedScreen";
import TvProfileScreen from "../screens/TvProfileScreen/TvProfileScreen";
import UserTvProfileScreen from "../screens/UserTvProfileScreen/UserTvProfileScreen";
import TvInsightScreen from "../screens/TvInsightScreen/TvInsightScreen";
import EditTvProfileScreen from "../screens/EditTvProfileScreen/EditTvProfileScreen";
import StoreGetStartedScreen from "../screens/StoreGetStartedScreen/StoreGetStartedScreen";
import XStoreScreen from "../screens/XStoreScreen/XStoreScreen";
import EditXStoreScreen from "../screens/EditXStoreScreen/EditXStoreScreen";
import MyProductScreen from "../screens/MyProductScreen/MyProductScreen";
import UserStoreScreen from "../screens/UserStoreScreen/UserStoreScreen";
import XStoreProductsScreen from "../screens/XStoreProductsScreen/XStoreProductsScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen/ProductDetailScreen";
import CheckoutScreen from "../screens/CheckoutScreen/CheckoutScreen";
import { useSelector } from "react-redux";
import { Text, View } from "react-native";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  // const currentUser = useSelector((state) => state.user.currentUser);
  const hasNoty = useSelector((state) => state.user.hasNoty);
  const isShowBottomNavbar = useSelector(
    (state) => state.setting.isShowBottomNavbar
  );
  const colorScheme = useColorScheme();

  function getTabBarVisible(route) {
    const routeName = getFocusedRouteNameFromRoute(route);
    switch (routeName) {
      case "HomeScreen":
        return isShowBottomNavbar ? false : true;
        break;
      case "ExploreScreen":
        return isShowBottomNavbar ? false : true;
        break;
      case "ChatRoom":
        return false;
        break;
      case "ProfileScreen":
        return false;
        break;
      case "UserProfileScreen":
        return false;
        break;
      case "CameraScreen":
        return false;
        break;
      case "StoryViewScreen":
        return false;
        break;
      case "ReelScreen":
        return false;
        break;
      case "CameraScreenBackup":
        return false;
        break;
      case "EditAndPostScreen":
        return false;
        break;
      case "PostReelScreen":
        return false;
        break;
      case "EditProfileScreen":
        return false;
        break;
      case "ReportBugScreen":
        return false;
        break;
      case "AboutScreen":
        return false;
        break;
      case "SuggestFeatureScreen":
        return false;
        break;
      case "TvGetStartedScreen":
        return false;
        break;
      case "StoreGetStartedScreen":
        return false;
        break;
      case "TvProfileScreen":
        return false;
        break;
      case "UserTvProfileScreen":
        return false;
        break;
      case "EditTvProfileScreen":
        return false;
        break;
      case "TvInsightScreen":
        return false;
        break;
      case "XStoreScreen":
        return false;
        break;
      case "EditXStoreScreen":
        return false;
        break;
      case "MyProductScreen":
        return false;
        break;
      case "UserStoreScreen":
        return false;
        break;
      case "XStoreProductsScreen":
        return true;
        break;
      case "ProductDetailScreen":
        return false;
        break;
      case "CheckoutScreen":
        return false;
        break;
      default:
        return true;
        break;
    }
  }
  return (
    <BottomTab.Navigator
      initialRouteName="HomeScreen"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].tint,
        inactiveTintColor: "#b3b4b6",
        // showLabel: false,
        style: {
          height: 60,
        },
        keyboardHidesTabBar: true,
      }}
    >
      <BottomTab.Screen
        name="HomeScreen"
        component={HomeScreenNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisible(route),
          tabBarLabel: ({ color, focused, position }) =>
            focused && (
              <Text
                position="right"
                style={{
                  color: "#006eff",
                  fontSize: 9,
                  fontWeight: "bold",
                  letterSpacing: 1,
                  marginTop: -10,
                  marginBottom: 5,
                  textTransform: "uppercase",
                }}
              >
                Feed
              </Text>
            ),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <AntDesign name="appstore1" size={22} color={color} />
            ) : (
              <AntDesign name="appstore-o" size={20} color={color} />
            ),
        })}
      />
      <BottomTab.Screen
        name="FriendListScreen"
        component={FriendListScreenNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisible(route),
          tabBarLabel: ({ color, focused, position }) =>
            focused && (
              <Text
                position="right"
                style={{
                  color: "#006eff",
                  fontSize: 9,
                  fontWeight: "bold",
                  letterSpacing: 1,
                  marginTop: -10,
                  marginBottom: 5,
                  textTransform: "uppercase",
                }}
              >
                Chat
              </Text>
            ),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialIcons name="chat-bubble" size={24} color={color} />
            ) : (
              <MaterialIcons
                name="chat-bubble-outline"
                size={20}
                color={color}
              />
            ),
        })}
      />
      <BottomTab.Screen
        name="ExploreScreen"
        component={ExploreScreenNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisible(route),
          tabBarLabel: ({ color, focused, position }) =>
            focused && (
              <Text
                position="right"
                style={{
                  color: "#006eff",
                  fontSize: 9,
                  fontWeight: "bold",
                  letterSpacing: 1,
                  marginTop: -10,
                  marginBottom: 5,
                  textTransform: "uppercase",
                }}
              >
                Explore
              </Text>
            ),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialIcons name="explore" size={33} color={color} />
            ) : (
              <AntDesign name="find" size={22} color={color} />
            ),
        })}
      />
      {/* <BottomTab.Screen
        name="XStoreProductsScreen"
        component={XStoreProductsScreen}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisible(route),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <AntDesign name="isv" size={24} color={color} />
            ) : (
              <AntDesign name="isv" size={24} color={color} />
            ),
        })}
      /> */}
      <BottomTab.Screen
        name="ActivitiesScreen"
        component={ActivitiesScreenNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisible(route),
          unmountOnBlur: true,
          tabBarLabel: ({ color, focused, position }) =>
            focused && (
              <Text
                position="right"
                style={{
                  color: "#006eff",
                  fontSize: 9,
                  fontWeight: "bold",
                  letterSpacing: 1,
                  marginTop: -10,
                  marginBottom: 5,
                  textTransform: "uppercase",
                }}
              >
                Activities
              </Text>
            ),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <View style={{ position: "relative" }}>
                {hasNoty && (
                  <View
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 10,
                      backgroundColor: "red",
                      position: "absolute",
                      zIndex: 2,
                      top: -4,
                      left: -4,
                    }}
                  ></View>
                )}
                <AntDesign name="heart" size={24} color={color} />
              </View>
            ) : (
              <View style={{ position: "relative" }}>
                {hasNoty && (
                  <View
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 10,
                      backgroundColor: "red",
                      position: "absolute",
                      zIndex: 2,
                      top: -4,
                      left: -4,
                    }}
                  ></View>
                )}
                <AntDesign name="hearto" size={20} color={color} />
              </View>
            ),
        })}
      />
      <BottomTab.Screen
        name="SettingsScreen"
        component={SettingsScreenNavigator}
        options={({ route }) => ({
          tabBarVisible: false,
          unmountOnBlur: true,
          tabBarLabel: ({ color, focused, position }) =>
            focused && (
              <Text
                position="right"
                style={{
                  color: "#006eff",
                  fontSize: 9,
                  fontWeight: "bold",
                  letterSpacing: 1,
                  marginTop: -10,
                  marginBottom: 5,
                  textTransform: "uppercase",
                }}
              >
                Settings
              </Text>
            ),
          tabBarIcon: ({ color, focused }) => (
            <Octicons name="settings" size={20} color={color} />
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const HomeScreenStack = createStackNavigator();

function HomeScreenNavigator() {
  return (
    <HomeScreenStack.Navigator>
      <HomeScreenStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeScreenStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="TvProfileScreen"
        component={TvProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="XStoreScreen"
        component={XStoreScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="EditXStoreScreen"
        component={EditXStoreScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="MyProductScreen"
        component={MyProductScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="TvInsightScreen"
        component={TvInsightScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeScreenStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeScreenStack.Screen
        name="EditTvProfileScreen"
        component={EditTvProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeScreenStack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <HomeScreenStack.Screen
        name="StoryViewScreen"
        component={StoryViewScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeScreenStack.Screen
        name="ReelScreen"
        component={ReelScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeScreenStack.Screen
        name="EditAndPostScreen"
        component={EditAndPostScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeScreenStack.Screen
        name="PostReelScreen"
        component={PostReelScreen}
        options={{
          headerShown: false,
        }}
      />
    </HomeScreenStack.Navigator>
  );
}

const FriendListScreenStack = createStackNavigator();

function FriendListScreenNavigator() {
  return (
    <FriendListScreenStack.Navigator>
      <FriendListScreenStack.Screen
        name="FriendListScreen"
        component={FriendListScreen}
        options={{
          headerShown: false,
        }}
      />
      <FriendListScreenStack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{
          headerShown: false,
        }}
      />
    </FriendListScreenStack.Navigator>
  );
}

const ScreenStack = createStackNavigator();

function ExploreScreenNavigator() {
  return (
    <ScreenStack.Navigator>
      <ScreenStack.Screen
        name="ExploreScreen"
        component={ExploreScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="UserStoreScreen"
        component={UserStoreScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="XStoreProductsScreen"
        component={XStoreProductsScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="CheckoutScreen"
        component={CheckoutScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="UserTvProfileScreen"
        component={UserTvProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </ScreenStack.Navigator>
  );
}
// const ScreenStack = createStackNavigator();

function ActivitiesScreenNavigator() {
  return (
    <ScreenStack.Navigator>
      <ScreenStack.Screen
        name="ActivitiesScreen"
        component={ActivitiesScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </ScreenStack.Navigator>
  );
}
function SettingsScreenNavigator() {
  return (
    <ScreenStack.Navigator>
      <ScreenStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="EditChatScreen"
        component={EditChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="ReportBugScreen"
        component={ReportBugScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="SuggestFeatureScreen"
        component={SuggestFeatureScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="TvGetStartedScreen"
        component={TvGetStartedScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="StoreGetStartedScreen"
        component={StoreGetStartedScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="MoreAccountSettingScreen"
        component={MoreAccountSettingScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="XStoreScreen"
        component={XStoreScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="EditXStoreScreen"
        component={EditXStoreScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="MyProductScreen"
        component={MyProductScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="TvProfileScreen"
        component={TvProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="TvInsightScreen"
        component={TvInsightScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeScreenStack.Screen
        name="EditTvProfileScreen"
        component={EditTvProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </ScreenStack.Navigator>
  );
}
