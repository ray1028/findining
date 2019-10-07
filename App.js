import React, { Component } from "react";
import { Text, TouchableOpacity, View, AsyncStorage } from "react-native";

import { connect } from "react-redux";
import Login from "./src/components/Login";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { createAppContainer, withNavigationFocus } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createStackNavigator } from "react-navigation-stack";
import Signup from "./src/components/Signup";
import Home from "./src/components/Home";
import TextCamera from "./src/components/TextCamera";
import MapScreen from "./src/components/MapScreen";
import Icon from "react-native-vector-icons/MaterialIcons";
import Profile from "./src/components/Profile";
import axios from "axios";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import MenuScreen from "./src/components/MenuScreen";
import UserScreen from "./src/components/UserScreen";
import EventDetailScreen from "./src/components/EventDetailScreen";
import StatusFooter from "./src/components/StatusFooter";
import { Menu } from "react-native-paper";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { SERVER_URI } from "./const";
import { request, setSessionsToken } from "./src/helper/helper";

import NavigationService from "./NavigationService";

// bottom tab routes here may wanna moduliza later
const MainNavigator = createBottomTabNavigator(
  {
    Map: {
      screen: MapScreen
    },
    Camera: {
      screen: withNavigationFocus(TextCamera)
    },
    Setting: {
      screen: Profile
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Icon;
        let iconName = "";

        switch (routeName) {
          case "Map":
            iconName = "map";
            break;
          case "Camera":
            iconName = "linked-camera";
            break;
          case "Setting":
            iconName = "person-outline";
            break;
          default:
            return;
        }
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "lightgrey"
    },
    initialRouteName: "Map",
    order: ["Map", "Camera", "Setting"]
  }
);

// routing here for now maybe modulize later

const AuthStack = createStackNavigator(
  {
    SignIn: { screen: Login },
    Signup: { screen: Signup },
    Profile: { screen: Profile },
    EventDetail: { screen: EventDetailScreen },
    UserScreen: { screen: UserScreen },
    MainNavigator: {
      screen: MainNavigator,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "SignIn",
    defaultNavigationOptions: { header: null, headerVisible: false }
  }
);

const askPermissionAsync = async permissionType => {
  const { status: existingStatus } = await Permissions.getAsync(permissionType);
  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(permissionType);
    if (status !== "granted")
      throw new Error("No permissions for push notification");
  }
};

const sendPushToken = async ({ id: userId }) => {
  await askPermissionAsync(Permissions.NOTIFICATIONS);
  const prevExpoPushToken = await AsyncStorage.getItem("ExpoPushToken");
  const expoPushToken =
    prevExpoPushToken || (await Notifications.getExpoPushTokenAsync());
  if (!prevExpoPushToken) {
    await AsyncStorage.setItem("ExpoPushToken", expoPushToken);
  }
  const resp = await request({
    method: "post",
    url: `${SERVER_URI}/users/${userId}/token`,
    data: { user_id: userId, expo_push_token: expoPushToken }
  });

  if (resp.status !== 200) throw new Error("Failed to send token to server");
};

const notificationSub = Notifications.addListener(notification => {
  if (notification.origin === "received") {
    const { type } = notification.data;
    if (type === "Event") {
      const { event } = notification.data;
      store.dispatch({ type: "RECEIVE_EVENT", event });
    }
  }
});

const loginStateReducer = (state, action) => {
  if (state === undefined) return { currentUser: "" };
  switch (action.type) {
    case "SET_LOGIN_CREDENTIALS":
      return { ...state, currentUser: action.value };
    case "ACTION_LOGIN_CREDENTIALS":
      (async () => {
        try {
          const resp = await axios({
            method: "post",
            url: `${SERVER_URI}/login`,
            data: {
              user: action.value
            }
          });
          if (resp.status == 200) {
            await setSessionsToken(resp.data.session_token);
            const userEmail = resp.data.user.email;
            const userId = resp.data.user.id;

            if (userEmail) {
              store.dispatch({
                type: "SET_LOGIN_CREDENTIALS",
                value: {
                  id: userId,
                  email: userEmail
                }
              });
              NavigationService.navigate("MainNavigator");
            }
          }

          // else {
          //   store.dispatch({
          //     type: "SET_LOGIN_ERROR",
          //     value: "User or Password Incorrect"
          //   });
          // }
        } catch (error) {
          console.log("Login Error");
        }
      })();

    // set error by itself ?
    // case "SET_LOGIN_ERROR":
    //   return { ...state, errorMsg: action.value };

    default:
      return state;
  }
};

const signupStateReducer = (state, action) => {
  if (state === undefined) return { currentUser: null };
  switch (action.type) {
    case "ACTION_SIGNUP_CREDENTIALS":
      (async () => {
        try {
          const resp = await axios({
            method: "post",
            url: `${SERVER_URI}/users`,
            data: { user: action.value }
          });
          if (resp.status != 200) {
            throw new Error("Error while signing up");
          }
          await setSessionsToken(resp.data.session_token);
          return { ...state, currentUser: action.value };
        } catch (err) {
          console.log("Error while signing up + " + err);
        }
      })();
      NavigationService.navigate("Profile");
      return state;
    case "SET_NEW_USER":
      return { ...state, currentUser: action.value };

    default:
      return state;
  }
};

const userCurrentlocationStateReducer = (state, action) => {
  if (state === undefined)
    return { userCurrentLocation: null, currentUserInterests: null };
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, userCurrentLocation: action.location };
    default:
      return state;
  }
};

const userProfileStateReducer = (state, action) => {
  if (state === undefined)
    return { userInterests: [], genderChecked: null, allInterests: [] };

  switch (action.type) {
    case "ACTION_FETCH_INTERESTS":
      (async () => {
        const interestsResp = await request({
          method: "get",
          url: `${SERVER_URI}/interests`
        });
        if (interestsResp.status !== 200) {
          throw new Error("Error while fetching interests data");
        }
        const interests = interestsResp.data;
        if (interests.length > 0) {
          store.dispatch({ type: "SET_ALL_INTERESTS", value: interests });
        } else {
          throw new Error("Error - Check database");
        }
      })();
      return state;

    case "SET_ALL_INTERESTS":
      return { ...state, allInterests: action.value };

    case "SET_GENDER_CHECKED":
      return { ...state, genderChecked: action.check };
    case "SET_USERNAME":
      return { ...state, username: action.name };
    case "SET_INTEREST":
      return {
        ...state,
        userInterests: [...state.userInterests, action.interest]
      };
    case "REMOVE_INTEREST":
      return {
        ...state,
        userInterests: state.userInterests.filter(
          interest => interest !== action.interest
        )
      };

    // userInterests = {
    //   id: currentUser.id,
    //   name: userName,
    //   gender: checked,
    //   interests: userInterests
    // };
    case "SET_NEW_USER_INTERESTS":
      //new
      (async () => {
        const newUserInterestsResp = await request({
          method: "post",
          url: `${SERVER_URI}/user_interests`,
          data: {
            user_interests: {
              user_id: action.value.id,
              username: action.value.name,
              user_gender: action.value.gender,
              interests: action.value.interests
            }
          }
        });
        if (newUserInterestsResp.status !== 200) {
          throw new Error("Error while posting user_interests");
        }

        store.dispatch({
          type: "SET_CURRENT_USER_INTERESTS",
          value: newUserInterestsResp.data
        });

        console.log("finish posting user_inerests happy");
      })();
      return state;

    // probally dont have to do this cuz we have user interests above already
    case "SET_CURRENT_USER_INTERESTS":
      return { ...state, currentUserAndInterests: action.value };

    // NEW CHANGES START HERE
    // case "SET_NEW_USER_INTERESTS":
    //   // retrieve current user interests
    //   (async () => {
    //     const currentUserInterestsResp = await request({
    //       method: "get",
    //       url: `${SERVER_URI}/users/${action.value}`
    //     });

    //     console.log("profile user object is " + action.value);

    //     if (currentUserInterestsResp.status !== 200) {
    //       throw new Error("error while fetching user interests");
    //     } else {
    //       const userInterests = currentUserInterestsResp.data;
    //       store.dispatch({ type: "SET_USER_INTEREST", action: userInterests });
    //     }
    //   })();
    // case "SET_USER_INTEREST":
    //   return { ...state, currentUserInterests: action.value };
    // OLDN CHANGES START HERE
    // case "UPDATE_USER_INTERESTS":
    //   Promise.all([
    //     Promise.resolve(
    //       request({
    //         method: "PATCH",
    //         url: `${SERVER_URI}/users/${action.value.id}`,
    //         data: action.value
    //       })
    //     ),
    //     // intrests
    //     Promise.resolve(
    //       request({
    //         method: "PATCH",
    //         url: `${SERVER_URI}/user_interests/${action.value.id}`,
    //         data: action.value
    //       })
    //     )
    //   ]);
    default:
      return state;
  }
};

const cameraStateReducer = (state, action) => {
  if (state === undefined)
    return {
      hasCameraPermission: null,
      bounds: [{ width: "10%", height: "10%", left: "40%", top: "40%" }]
    };
  switch (action.type) {
    case "SET_CAMERA":
      return { ...state, camera: action.value };
    case "SET_CAMERA_STATUS":
      return { ...state, hasCameraPermission: action.value };
    case "SET_IMAGE_BOUNDS":
      return { ...state, bounds: action.value };
    case "ACTION_IMAGE_AWS":
      state.camera.pausePreview();
      (async () => {
        const resp = await request({
          method: "post",
          url: `${SERVER_URI}/images`,
          data: action.value
        });
        const bounds = resp.data.map(detection => {
          const bound = detection.geometry.boundingBox;
          return {
            height: `${bound.height * 100}%`,
            width: `${bound.width * 100}%`,
            left: `${bound.left * 100}%`,
            top: `${bound.top * 100}%`
          };
        });
        store.dispatch({
          type: "SET_IMAGE_BOUNDS",
          value: bounds
        });
      })();
      return state;
    case "RESET_CAMERA":
      if (state.camera) {
        state.camera.resumePreview();
      }
      return { ...state, bounds: [] };
    default:
      return state;
  }
};

const eventDetailReducer = (state, action) => {
  if (state === undefined) return { selectedScreen: "User" };

  switch (action.type) {
    case "SET_EVENT_SCREEN":
      return { ...state, selectedScreen: action.screen };
    default:
      return state;
  }
};

const userStateReducer = (state, action) => {
  if (state === undefined) return { status: "WAITING", id: null };

  switch (action.type) {
    case "SET_USER_ID":
      sendPushToken({ id: action.uid });
      return { ...state, id: action.uid };
    case "SET_USER_STATUS":
      return { ...state, status: action.status };
    default:
      return state;
  }
};

const eventsReducer = (state, action) => {
  if (state === undefined) return { visible: [] };
  switch (action.type) {
    case "RECEIVE_EVENT":
      return { ...state, visible: [...visible, action.event] };
    default:
      return state;
  }
};

const restaurantMenuReducer = (state, action) => {
  if (state === undefined)
    return { currentMenuItems: [], currentRestaurant: {} };
  switch (action.type) {
    case "ACTION_RESTAURANT":
      (async () => {
        const restaurantResp = await request({
          method: "get",
          url: `${SERVER_URI}/restaurants/${action.value}`
        });

        if (restaurantResp.status !== 200) {
          throw new Error("Error occurs while fetching restaurant data");
        }
        const restaurant = restaurantResp.data;
        if (restaurant) {
          store.dispatch({
            type: "SET_RESTAURANT",
            value: restaurant
          });
        }
      })();

      return state;
    case "SET_RESTAURANT":
      return { ...state, currentRestaurant: action.value };

    case "ACTION_MENU_ITEMS":
      (async () => {
        const menuItemsResp = await request({
          method: "get",
          url: `${SERVER_URI}/restaurants/${action.value}/items`
        });

        if (menuItemsResp.status !== 200) {
          throw new Error("Error occurs while fetching restaurant data");
        }
        // duno why
        const menuItems = menuItemsResp.data;
        console.log("Menu FROM SERVER is " + JSON.stringify(menuItems));
        if (menuItems.length > 0) {
          store.dispatch({
            type: "SET_MENU_ITEMS",
            value: menuItems
          });
        }
      })();

      return state;
    case "SET_MENU_ITEMS":
      console.log("action value is currently " + action.value);
      return { ...state, currentMenuItems: action.value };
    default:
      return state;
  }
};

const reducer = combineReducers({
  loginCredentials: loginStateReducer,
  signupNewUser: signupStateReducer,
  cameraView: cameraStateReducer,
  userProfile: userProfileStateReducer,
  eventDetail: eventDetailReducer,
  events: eventsReducer,
  user: userStateReducer,
  findUserCurrentLocation: userCurrentlocationStateReducer,
  restaurantMenu: restaurantMenuReducer
  // userInterests: userInterestsReducer
});

const store = createStore(reducer);

const AppNavigator = createAppContainer(AuthStack);

const withProvider = AppComponent => {
  return () => (
    <Provider store={store}>
      <AppComponent />
    </Provider>
  );
};

const App = () => {
  return (
    <View style={{ height: "100%", background: "black" }}>
      <AppNavigator
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
      <StatusFooter />
    </View>
  );
};

export default withProvider(App);
