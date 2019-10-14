import React, { Component, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  Alert
} from "react-native";

import { connect } from "react-redux";
import SignInScreen from "./src/components/Login";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import SignUpScreen from "./src/components/Signup";
import TextCamera from "./src/components/TextCamera";
import MapScreen from "./src/components/MapScreen";
import Icon from "react-native-vector-icons/MaterialIcons";
import ProfileScreen from "./src/components/Profile";
import axios from "axios";
import * as Permissions from "expo-permissions";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createBottomTabNavigator } from "react-navigation-tabs";
import {
  createAppContainer,
  withNavigationFocus,
  NavigationActions
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Notifications } from "expo";
import EventDetailScreen from "./src/components/EventDetailScreen";
import MatchRequest from "./src/components/MatchRequest";
import StatusFooter from "./src/components/StatusFooter";
import DiningScreen from "./src/components/DiningScreen";
import { SERVER_URI } from "./const";
import { request, setSessionsToken, isSessionValid } from "./src/helper/helper";

import NavigationService from "./NavigationService";

// import { fromLeft, fromRight } from "react-navigation-transitions";

// bottom tab routes here may wanna moduliza later
// const MainNavigator = createBottomTabNavigator(
//   {
//     Map: {
//       screen: MapScreen
//     },
//     Camera: {
//       screen: withNavigationFocus(TextCamera)
//     },
//     Setting: {
//       screen: Profile
//     }
//   },
//   {
//     defaultNavigationOptions: ({ navigation }) => ({
//       tabBarIcon: ({ focused, horizontal, tintColor }) => {
//         const { routeName } = navigation.state;
//         let IconComponent = Icon;
//         let iconName = "";

//         switch (routeName) {
//           case "Map":
//             iconName = "map";
//             break;
//           case "Camera":
//             iconName = "linked-camera";
//             break;
//           case "Setting":
//             iconName = "person-outline";
//             break;
//           default:
//             return;
//         }
//         return <IconComponent name={iconName} size={25} color={tintColor} />;
//       }
//     }),
//     tabBarOptions: {
//       activeTintColor: "tomato",
//       inactiveTintColor: "lightgrey"
//     },
//     initialRouteName: "Map",
//     order: ["Map", "Camera", "Setting"]
//   }
// );

// routing here for now maybe modulize later

// const AuthStack = createStackNavigator(
//   {
//     SignIn: { screen: Login },
//     Signup: { screen: Signup },
//     Profile: { screen: Profile },
//     EventDetail: { screen: EventDetailScreen },
//     UserScreen: { screen: UserScreen },
//     MainNavigator: {
//       screen: MainNavigator,
//       navigationOptions: {
//         header: null
//       }
//     }
//   },
//   {
//     initialRouteName: "SignIn",
//     defaultNavigationOptions: { header: null, headerVisible: false }
//   }
// );

const askPermissionAsync = async permissionType => {
  const { status: existingStatus } = await Permissions.getAsync(permissionType);
  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(permissionType);
    if (status !== "granted")
      throw new Error("No permissions for push notification");
  }
};

const sendPushToken = async ({ uid }) => {
  await askPermissionAsync(Permissions.NOTIFICATIONS);
  const prevExpoPushToken = await AsyncStorage.getItem("ExpoPushToken");
  const expoPushToken =
    prevExpoPushToken || (await Notifications.getExpoPushTokenAsync());
  if (!prevExpoPushToken) {
    await AsyncStorage.setItem("ExpoPushToken", expoPushToken);
  }
  const resp = await request({
    method: "post",
    url: `${SERVER_URI}/users/${uid}/token`,
    data: { user_id: uid, expo_push_token: expoPushToken }
  });

  if (resp.status !== 200) throw new Error("Failed to send token to server");
};

const notificationSub = Notifications.addListener(notification => {
  try {
    if (notification.origin === "received") {
      if (["CREATE_EVENT", "DELETE_EVENT"].includes(notification.data.type)) {
        Notifications.dismissNotificationAsync(notification.notificationId);
      }
      console.log("NOTIFICATION DISPATCH", notification.data);
      store.dispatch({
        ...notification.data,
        type: `REMOTE_${notification.data.type}`
      });
      store.dispatch({
        ...notification.data,
        type: `REMOTE_${notification.data.type}`
      });
    }
  } catch (err) {
    console.log("Notification Dispatch Error", err);
  }
});

const fetchRestaurantDetail = async ({ restaurantId, restaurantName }) => {
  try {
    const restaurantResp = await request({
      method: "GET",
      url:
        `${SERVER_URI}/restaurants/` +
        (restaurantId
          ? `${restaurantId}/`
          : `?name=${encodeURIComponent(restaurantName)}`)
    });
    if (restaurantResp.status !== 200) throw new Error(resp.data.error);
    const menuResp = await request({
      method: "GET",
      url: `${SERVER_URI}/restaurants/${restaurantResp.data.id}/items`
    });
    if (menuResp.status !== 200) throw new Error(resp.data.error);
    store.dispatch({
      type: "SET_EVENT_DETAIL_DATA_MENU",
      restaurant: { ...restaurantResp.data, menuItems: menuResp.data }
    });
  } catch (err) {
    console.log("Fetch Restaurant Detail error", err);
  }
};

const fetchUserDetail = async userId => {
  try {
    const resp = await request({
      method: "GET",
      url: `${SERVER_URI}/users/${userId}`
    });
    if (resp.status !== 200) throw new Error(resp.data.error);
    store.dispatch({ type: "SET_EVENT_DETAIL_DATA_USER", user: resp.data });
  } catch (err) {
    console.log("Fetch User Detail error", err);
  }
};

const loginStateReducer = (state, action) => {
  if (state === undefined) return { currentUser: null };
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
            if (!userEmail) throw new Error("Email missing from User Object");
            store.dispatch({ type: "FETCH_EVENTS" });
            store.dispatch({
              type: "ACTION_FETCH_USER_PROFILE",
              value: userId
            });
            store.dispatch({ type: "ACTION_FETCH_INTERESTS" });
            store.dispatch({
              type: "SET_LOGIN_CREDENTIALS",
              value: { id: userId, email: userEmail }
            });
            store.dispatch({ type: "SET_USER_ID", uid: userId });
            NavigationService.navigate(
              "MainNavigator",
              {},
              NavigationActions.navigate({ routeName: "Map" })
            );
          }

          // else {
          //   store.dispatch({
          //     type: "SET_LOGIN_ERROR",
          //     value: "User or Password Incorrect"
          //   });
          // }
        } catch (error) {
          console.log(SERVER_URI);
          console.log("Login Error ", error);
        }
      })();
      return state;

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
          store.dispatch({ type: "FETCH_EVENTS" });
          store.dispatch({
            type: "ACTION_FETCH_USER_PROFILE",
            value: resp.data.user.id
          });
          store.dispatch({ type: "ACTION_FETCH_INTERESTS" });
          store.dispatch({ type: "SET_USER_ID", uid: resp.data.user.id });
          store.dispatch({ type: "SET_NEW_USER", value: action.value });
          NavigationService.navigate("Profile");
        } catch (err) {
          console.log("Error while signing up + " + err);
        }
      })();
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
    return {
      userInterests: [],
      genderChecked: null,
      // allInterests: [],
      username: null,
      genderChecked: null,
      uid: null,
      id: null,
      userImage: null,
      userImageBase64: null
    };

  switch (action.type) {
    case "SET_USER_IMAGE_URI":
      return { ...state, userImage: action.value };

    case "SET_USER_IMAGE_BASE_64":
      return { ...state, userImageBase64: action.value };

    case "ACTION_FETCH_USER_PROFILE":
      (async () => {
        const userResp = await request({
          method: "get",
          url: `${SERVER_URI}/users/${action.value}`
        });
        if (userResp.status !== 200) {
          throw new Error("Error while fetching user profile data");
        }

        const userProfile = userResp.data;
        store.dispatch({
          type: "SET_INTEREST",
          interests: userProfile.interests.map(interest => interest.id)
        });
        store.dispatch({
          type: "SET_USERNAME",
          name: userProfile.name
        });
        store.dispatch({
          type: "SET_GENDER_CHECKED",
          check: userProfile.gender
        });
        store.dispatch({
          type: "SET_USER_IMAGE_URI",
          value: userProfile.profile_uri
        });
      })();
      return { ...state, id: action.value };

    case "SET_CURRENT_USER_PROFILE":
      return { ...state, interestProfile: action.value };

    //
    // case "ACTION_FETCH_INTERESTS":
    //   (async () => {
    //     const interestsResp = await request({
    //       method: "get",
    //       url: `${SERVER_URI}/interests`
    //     });
    //     if (interestsResp.status !== 200) {
    //       throw new Error("Error while fetching interests data");
    //     }
    //     const interests = interestsResp.data;
    //     if (interests.length > 0) {
    //       store.dispatch({ type: "SET_ALL_INTERESTS", value: interests });
    //     } else {
    //       throw new Error("Error - Check database");
    //     }
    //   })();
    //   return state;

    // case "SET_ALL_INTERESTS":
    //   return { ...state, allInterests: action.value };

    case "SET_GENDER_CHECKED":
      return { ...state, genderChecked: action.check };
    case "SET_USERNAME":
      return { ...state, username: action.name };
    case "SET_INTEREST":
      return { ...state, userInterests: action.interests };
    case "ADD_INTEREST":
      return {
        ...state,
        userInterests: Array.from(
          new Set([...state.userInterests, action.interest])
        )
      };
    case "REMOVE_INTEREST":
      return {
        ...state,
        userInterests: state.userInterests.filter(
          interest => interest !== action.interest
        )
      };
    case "SAVE_PROFILE":
      (async () => {
        try {
          const newUserInterestsResp = await request({
            method: "post",
            url: `${SERVER_URI}/user_interests`,
            data: {
              user_interests: {
                user_id: state.uid,
                interests: state.userInterests
              }
            }
          });
          if (newUserInterestsResp.status !== 200) {
            throw new Error("Error while posting user_interests");
          }

          if (state.username || state.genderChecked) {
            (async () => {
              const newUserProfileResp = await request({
                method: "PATCH",
                url: `${SERVER_URI}/users/${state.uid || state.id}`,
                data: {
                  user_profile: {
                    id: state.uid || state.id,
                    username: state.username,
                    user_gender: state.genderChecked,
                    profile_uri: state.userImageBase64
                    // profile_uri:
                    //   "https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png"
                  }
                }
              });
              if (newUserProfileResp.status !== 200) {
                throw new Error("Error while posting data to user profile");
              }
            })();
            NavigationService.navigate(
              "MainNavigator",
              {},
              NavigationActions.navigate({ routeName: "Map" })
            );
          }
        } catch (err) {
          console.log("Save Profile Error", err);
        }
      })();
      return state;

    default:
      return state;
  }
};

const cameraStateReducer = (state, action) => {
  const defaultState = {
    hasCameraPermission: null,
    bounds: [
      // { text: "KFC", top: "0%", left: "0%", width: "10%", height: "10%" }
    ]
  };
  if (state === undefined) return defaultState;
  switch (action.type) {
    // case "SET_SPINNER":
    //   return { ...state, spinner: action.value };
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
            text: detection.detectedText,
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
      return { ...state, bounds: defaultState.bounds };
    default:
      return state;
  }
};

const eventDetailReducer = (state, action) => {
  const defaultState = {
    selectedScreen: "User",
    user: null,
    restaurant: null,
    rating: null
  };
  if (state === undefined) return defaultState;

  switch (action.type) {
    case "SET_EVENT_DETAIL_DATA_MENU":
      return { ...state, restaurant: action.restaurant };
    case "SET_EVENT_DETAIL_DATA_USER":
      return { ...state, user: action.user };
    case "SET_EVENT_DETAIL_SCREEN":
      return { ...state, selectedScreen: action.screen };
    case "FINISH_DININING":
      return { state, user: null, restaurant: null, rating: null };
    case "RESET_CAMERA":
      return { state, user: null, restaurant: null, rating: null };
    case "SEND_RATING":
      return { ...state, rating: action.rating };
    case "CREATE_EVENT":
      (async () => {
        const resp = await request({
          method: "post",
          url: `${SERVER_URI}/events`,
          data: { event: { restaurant: { id: state.restaurant.id } } }
        });
        if (resp.status !== 200) throw new Error(resp.data.error);
        store.dispatch({ type: "SET_HOSTED_EVENT_ID", eventId: resp.data.id });
      })();
      return { ...state, user: null, rating: null };
    case "CLOSE_EVENT_DETAIL_SCREEN":
      return { ...state, ...defaultState };
    case "REMOTE_JOIN_EVENT":
      fetchUserDetail(action.event.guest.id);
      fetchRestaurantDetail({ restaurantId: action.event.restaurant.id });
      NavigationService.navigate("MatchRequest");
      return { ...state, user: action.event.guest };
    default:
      return state;
  }
};

const eventsReducer = (state, action) => {
  try {
    if (state === undefined)
      return {
        visible: [],
        openEventId: null,
        status: null,
        message: null,
        uid: null
      };
    switch (action.type) {
      case "SET_EVENTS":
        for (let event of action.events) {
          if (state.uid === event.host.id)
            return {
              ...state,
              openEventId: event.id,
              status: "WAITING_FOR_GUEST",
              message: "Waiting for Guest Diner..."
            };
        }
        console.log("SET_EVENTS", action.events);
        return { ...state, visible: action.events };
      case "SET_USER_ID":
        sendPushToken({ uid: action.uid });
        return { ...state, uid: action.uid };
      case "CANCEL_USER_STATUS":
        if (
          state.status === "WAITING_FOR_GUEST" ||
          state.status === "WAITING_FOR_HOST_REPLY"
        ) {
          (async () => {
            const resp = await request({
              method: "POST",
              url: `${SERVER_URI}/events/${state.openEventId}/cancel`
            });
            if (resp.status !== 200) throw new Error(resp.data.error);
          })();
        }
        return {
          ...state,
          openEventId: null,
          status: null,
          message: null,
          visible: state.visible.filter(event => event.host.id !== state.uid)
        };
      case "REMOTE_CANCEL_JOIN_EVENT":
        NavigationService.navigate(
          "MainNavigator",
          {},
          NavigationActions.navigate({ routeName: "Map" })
        );
        return {
          ...state,
          status: "WAITING_FOR_GUEST",
          message: "Waiting for Guest Dinner..."
        };
      case "REMOTE_CANCEL_EVENT":
        if (state.openEventId === action.event.id) {
          Alert.alert("Event has been Canceled");
          NavigationService.navigate(
            "MainNavigator",
            {},
            NavigationActions.navigate({ routeName: "Map" })
          );
          return {
            ...state,
            visible: state.visible.filter(
              event => event.id !== action.event.id
            ),
            openEventId: null
          };
        }
        return {
          ...state,
          visible: state.visible.filter(event => event.id !== action.event.id)
        };
      case "REMOTE_FINISH_EVENT":
        return {
          ...state,
          visible: state.visible.filter(event => event.id !== action.event.id)
        };
      case "REMOTE_JOIN_RESPONSE":
        if (action.accept) {
          Alert.alert("Your dining request has been accepted!");
          NavigationService.navigate("Dining");
          fetchRestaurantDetail({ restaurantId: action.event.restaurant.id });
          return { ...state, status: "DINING", message: null };
        } else {
          Alert.alert("Your dining request has been rejected :(");
          return { ...state, openEventId: null, status: null, message: null };
        }
      case "CREATE_EVENT":
        return {
          ...state,
          status: "WAITING_FOR_GUEST",
          message: "Waiting for Guest Dinner..."
        };
      case "FETCH_EVENTS":
        (async () => {
          const resp = await request({
            method: "GET",
            url: `${SERVER_URI}/events/`
          });
          if (resp.status !== 200) throw new Error(resp.data.error);
          store.dispatch({ type: "SET_EVENTS", events: resp.data });
        })();
        return state;
      case "REMOTE_CREATE_EVENT":
        return { ...state, visible: [...state.visible, action.event] };
      case "REMOTE_JOIN_EVENT":
        return { ...state, openEventId: action.event.id, message: null };
      case "SET_OPEN_EVENT":
        fetchUserDetail(action.event.host.id);
        fetchRestaurantDetail({ restaurantId: action.event.restaurant.id });
        return { ...state, openEventId: action.event.id };
      case "SET_HOSTED_EVENT_ID":
        return { ...state, openEventId: action.eventId };
      case "ACCEPT_MATCH_REQUEST":
        console.log("ACCEPT MATCH REQUEST", state);
        (async () => {
          try {
            const resp = await request({
              method: "POST",
              url: `${SERVER_URI}/events/${state.openEventId}/accept`
            });
            NavigationService.navigate("Dining");
            if (resp.status !== 200) throw new Error(resp.data.error);
          } catch (err) {
            console.log("event/accept error", err);
          }
        })();
        return state;
      case "REJECT_MATCH_REQUEST":
        console.log("REJECT MATCH REQUEST", state);
        (async () => {
          try {
            const resp = await request({
              method: "POST",
              url: `${SERVER_URI}/events/${state.openEventId}/reject`
            });
            NavigationService.navigate(
              "MainNavigator",
              {},
              NavigationActions.navigate({ routeName: "Map" })
            );
            if (resp.status !== 200) throw new Error(resp.data.error);
          } catch (err) {
            console.log("event/reject error", err);
          }
        })();
        return {
          ...state,
          status: "WAITING_FOR_GUEST",
          message: "Waiting for Guest Dinner..."
        };
      case "SET_OPEN_RESTAURANT_NAME":
        fetchRestaurantDetail({ restaurantName: action.restaurantName });
        return state;
      case "JOIN_EVENT":
        console.log(">>> JOIN EVENT", state.openEventId);
        (async () => {
          try {
            const resp = await request({
              method: "POST",
              url: `${SERVER_URI}/events/${state.openEventId}/join`
            });
            if (resp.status !== 200) throw new Error(resp.data.error);
          } catch (err) {
            console.log("Error while joining event", err);
          }
        })();
        return {
          ...state,
          status: "WAITING_FOR_HOST_REPLY",
          message: "Your Dinning Request has been sent!"
        };
      case "CLOSE_EVENT_DETAIL_SCREEN":
        return { ...state, openEventId: null };
      default:
        return state;
    }
  } catch (err) {
    console.log("Event Reducer Error", err);
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
  findUserCurrentLocation: userCurrentlocationStateReducer,
  restaurantMenu: restaurantMenuReducer
  // userInterests: userInterestsReducer
});

// bottom tab routes here may wanna moduliza later
const MainNavigator = createBottomTabNavigator(
  {
    Map: { screen: MapScreen },
    Camera: { screen: withNavigationFocus(TextCamera) },
    Setting: { screen: ProfileScreen }
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
      style: {
        backgroundColor: "#58B09C"
      },
      activeTintColor: "#7a42f4",
      inactiveTintColor: "#fff"
    },
    initialRouteName: "Map",
    order: ["Map", "Camera", "Setting"]
  }
);

// routing here for now maybe modulize later

const AuthStack = createStackNavigator(
  {
    SignIn: { screen: SignInScreen },
    Signup: { screen: SignUpScreen },

    Profile: { screen: ProfileScreen },
    EventDetail: { screen: EventDetailScreen },
    MatchRequest: { screen: MatchRequest },
    Dining: { screen: DiningScreen },
    MainNavigator: {
      screen: MainNavigator,
      navigationOptions: {
        header: null
      }
    }
    //  trying
    // UserScreen: { screen: UserScreen },
    // MenuScreen: { screen: MenuScreen }
    //
  },
  {
    // transitionConfig: () => fromLeft(1000),

    initialRouteName: "SignIn",
    defaultNavigationOptions: { header: null, headerVisible: false }
  }
);

const store = createStore(reducer);

const AppNavigator = createAppContainer(AuthStack);

const withProvider = AppComponent => {
  return () => (
    <Provider store={store}>
      <AppComponent />
    </Provider>
  );
};

const mapStateToProps = ({ events }) => ({ ...events });

const mapDispatchToProps = dispatch => ({
  fetchEvents: () => dispatch({ type: "FETCH_EVENTS" })
});

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ fetchEvents }) => {
  useEffect(() => {
    (async () => {
      if (await isSessionValid()) fetchEvents();
    })();
  }, []);
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
});

export default withProvider(App);
