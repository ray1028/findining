import React, { Component, useEffect } from "react";
import { Text, TouchableOpacity, View, AsyncStorage } from "react-native";

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
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createBottomTabNavigator } from "react-navigation-tabs";
import * as Permissions from 'expo-permissions';
import { createAppContainer, withNavigationFocus, NavigationActions } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Notifications } from "expo";
import EventDetailScreen from "./src/components/EventDetailScreen";
import MatchRequest from "./src/components/MatchRequest";
import StatusFooter from "./src/components/StatusFooter";
import { SERVER_URI } from "./const";
import NavigationService from './src/NavigationService.js';


const askPermissionAsync = async (permissionType) => {
  const { status: existingStatus } = await Permissions.getAsync(permissionType);
  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(permissionType);
    if (status !== "granted") throw new Error("No permissions for push notification");
  }
};

const sendPushToken = async ({ id: userId }) => {
  await askPermissionAsync(Permissions.NOTIFICATIONS);
  const prevExpoPushToken = await AsyncStorage.getItem("ExpoPushToken");
  const expoPushToken = prevExpoPushToken || (await Notifications.getExpoPushTokenAsync());
  if (!prevExpoPushToken) {
    await AsyncStorage.setItem("ExpoPushToken", expoPushToken);
  }
  const resp = await axios({
    method: 'post',
    url: `${SERVER_URI}/users/${userId}/token`,
    data: { 'user_id': userId, 'expo_push_token': expoPushToken }
  });
  if (resp.status !== 200) throw new Error("Failed to send token to server");
}

const notificationSub = Notifications.addListener((notification) => {
  try {
    if (notification.origin === "received") {
      store.dispatch({ ...notification.data, type: `REMOTE_${notification.data.type}` });
    }
  } catch (err) {
    console.log("Notification Dispatch Error", err);
  }
});

const fetchRestaurantDetail = async ({ restaurantId, restaurantName }) => {
  try {
    const restaurantResp = await axios({
      method: 'GET',
      url: `${SERVER_URI}/restaurants/` + (restaurantId ? `${restaurantId}/` : `?name=${encodeURIComponent(restaurantName)}`)
    });
    if (restaurantResp.status !== 200) throw new Error(resp.data.error);
    const menuResp = await axios({
      method: 'GET',
      url: `${SERVER_URI}/restaurants/${restaurantResp.data.id}/items`
    });
    if (menuResp.status !== 200) throw new Error(resp.data.error);
    store.dispatch({ type: "SET_EVENT_DETAIL_DATA_MENU", restaurant: { ...restaurantResp.data, menuItems: menuResp.data } });
  } catch (err) {
    console.log(err);
  }
};

const fetchUserDetail = async (userId) => {
  try {
    const resp = await axios({
      method: 'GET',
      url: `${SERVER_URI}/users/${userId}`
    });
    if (resp.status !== 200) throw new Error(resp.data.error);
    store.dispatch({ type: "SET_EVENT_DETAIL_DATA_USER", user: resp.data });
  } catch (err) {
    console.log(err);
  }
};

const loginStateReducer = (state, action) => {
  if (state === undefined) return {};
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, userEmail: action.email };
    case "SET_PASSWORD":
      return { ...state, userPassword: action.password };
    default:
      return state;
  }
};

const signupStateReducer = (state, action) => {
  if (state === undefined) return {};
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, signupNewUser: action.username };
    default:
      return state;
  }
};

const userCurrentlocationStateReducer = (state, action) => {
  if (state === undefined) return { userCurrentLocation: null };
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, userCurrentLocation: action.location };
    default:
      return state;
  }
};

const userProfileStateReducer = (state, action) => {
  if (state === undefined) return { userInterests: [], genderChecked: null };

  switch (action.type) {
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
    default:
      return state;
  }
};

const cameraStateReducer = (state, action) => {
  if (state === undefined) return { hasCameraPermission: null, bounds: [{ width: '10%', height: '10%', left: '40%', top: '40%', text: "KFC" }] };
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
        const resp = await axios({
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
      return { ...state, bounds: [] };
    default:
      return state;
  }
};

const eventDetailReducer = (state, action) => {
  const defaultState = { selectedScreen: 'User', user: null, restaurant: null };
  if (state === undefined) return defaultState;

  switch (action.type) {
    case "SET_EVENT_DETAIL_DATA_MENU":
      return { ...state, restaurant: action.restaurant };
    case "SET_EVENT_DETAIL_DATA_USER":
      return { ...state, user: action.user };
    case "SET_EVENT_DETAIL_SCREEN":
      return { ...state, selectedScreen: action.screen };
    case "CREATE_EVENT":
      (async () => {
        const resp = await axios({
          method: 'post',
          url: `${SERVER_URI}/events`,
          data: { 'event': { 'restaurant': { 'id': state.restaurant.id } } }
        });
        if (resp.status !== 200) throw new Error(resp.data.error);
        store.dispatch({ type: "SET_HOSTED_EVENT_ID", eventId: resp.data.id });
      })();
      return state;
    case "CLOSE_EVENT_DETAIL_SCREEN":
      return { ...state, ...defaultState };
    case "REMOTE_JOIN_EVENT":
      NavigationService.navigate('MatchRequest');
      return { ...state, user: action.guest };
    default:
      return state;
  }
};

const userStateReducer = (state, action) => {
  if (state === undefined) return { status: null, id: null };

  switch (action.type) {
    case "SET_USER_ID":
      sendPushToken({ id: action.uid });
      return { ...state, id: action.uid };
    case "SET_USER_STATUS":
      return { ...state, status: action.status };
    case "CANCEL_USER_STATUS":
      return { ...state, status: null };
    case "REMOTE_CANCEL_JOIN_EVENT":
      NavigationService.navigate('MainNavigator');
      return { ...state, status: "Waiting for Guest Dinner..." };
    case "REMOTE_CANCEL_EVENT":
      if (status !== null) {
        Alert.alert("Event has been cancelled");
        NavigationService.navigate('MainNavigator');
      }
      return { ...state, status: null };
    case "CREATE_EVENT":
      return { ...state, status: "Waiting for Guest Dinner..." };
    case "JOIN_EVENT":
      return { ...state, status: 'Your Dinning Request has been sent!' };
    default:
      return state;
  }
};

const eventsReducer = (state, action) => {
  if (state === undefined) return { visible: [], openEventId: null };
  switch (action.type) {
    case "FETCH_EVENTS":
      (async () => {
        const resp = await axios({
          method: 'GET',
          url: `${SERVER_URI}/events/`
        });
        if (resp.status !== 200) throw new Error(resp.data.error);
        store.dispatch({ type: "SET_EVENTS", events: resp.data });
      })();
      return state;
    case "REMOTE_CREATE_EVENT":
      return { ...state, visible: [...state.visible, action.event] };
    case "SET_EVENTS":
      return { ...state, visible: action.events };
    case "REMOTE_CANCEL_EVENT":
      return { ...state, visible: state.visible.filter(event => event.id !== action.event.id), openEventId: openEventId === action.event.id ? null : openEventId };
    case "SET_OPEN_EVENT":
      fetchUserDetail(action.event.host.id);
      fetchRestaurantDetail({ restaurantId: action.event.restaurant.id });
      return { ...state, openEventId: action.event.id };
    case "SET_HOSTED_EVENT_ID":
      return { ...state, openEventId: action.eventId };
    case "ACCEPT_MATCH_REQUEST":
      (async () => {
        const resp = await axios({
          method: 'POST',
          url: `${SERVER_URI}/events/${openEventId}/accept`
        });
        if (resp.status !== 200) throw new Error(resp.data.error);
      })();
      return state;
    case "SET_OPEN_RESTAURANT_NAME":
      fetchRestaurantDetail({ restaurantName: action.restaurantName });
      return state;
    case "RECEIVE_EVENT":
      return { ...state, visible: [...state.visible, action.event] };
    case "JOIN_EVENT":
      (async () => {
        const resp = await axios({
          method: 'POST',
          url: `${SERVER_URI}/events/${openEventId}/join`
        });
        if (resp.status !== 200) throw new Error(resp.data.error);
      })();
      return state;
    case "CANCEL_USER_STATUS":
      (async () => {
        const resp = await axios({
          method: 'POST',
          url: `${SERVER_URI}/events/${openEventId}/cancel`
        });
        if (resp.status !== 200) throw new Error(resp.data.error);
      })();
      return { ...state, openEventId: null };
    case "CLOSE_EVENT_DETAIL_SCREEN":
      return { ...state, openEventId: null };
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
  findUserCurrentLocation: userCurrentlocationStateReducer
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
    SignIn: { screen: SignInScreen },
    Signup: { screen: SignUpScreen },
    Profile: { screen: ProfileScreen },
    EventDetail: { screen: EventDetailScreen },
    MatchRequest: { screen: MatchRequest },
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

const mapDispatchToProps = (dispatch) => ({
  fetchEvents: () => dispatch({ type: "FETCH_EVENTS" })
})

const App = connect(mapStateToProps, mapDispatchToProps)
  (({ fetchEvents }) => {
    useEffect(() => {
      fetchEvents();
    }, []);
    return (
      <View style={{ height: "100%", background: "black" }}>
        <AppNavigator ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }} />
        <StatusFooter />
      </View>
    );
  });

export default withProvider(App);
