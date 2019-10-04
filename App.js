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
import * as Permissions from 'expo-permissions';
import MenuScreen from "./src/components/MenuScreen";
import UserScreen from "./src/components/UserScreen";
import EventDetailScreen from "./src/components/EventDetailScreen";
import StatusFooter from "./src/components/StatusFooter";
import { Menu } from "react-native-paper";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { SERVER_URI } from "./const";

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
  if (notification.origin === "received") {
    const { type } = notification.data;
    if (type === 'Event') {
      const { event } = notification.data;
      store.dispatch({ type: "RECEIVE_EVENT", event });
    }
  }
});

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
  if (state === undefined) return { hasCameraPermission: null, bounds: [{ width: '10%', height: '10%', left: '40%', top: '40%' }] };
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
          console.log(JSON.stringify(detection));
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
  if (state === undefined) return { selectedScreen: 'User' };

  switch (action.type) {
    case "SET_EVENT_SCREEN":
      return { ...state, selectedScreen: action.screen };
    default:
      return state;
  }
};

const userStateReducer = (state, action) => {
  if (state === undefined) return { status: 'WAITING', id: null };

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
  if (state === undefined) return { visible: [], resturantName: null, eventId: null };
  switch (action.type) {
    case "FETCH_EVENTS":
      (async () => {
        const resp = await axios({
          method: 'post',
          url: `${SERVER_URI}/events/`
        });
        if (resp.status !== 200) throw new Error(resp.data.error);
        store.dispatch({ type: "SET_EVENTS", events: resp.data });
      })();
      return state;
    case "SET_EVENTS":
      return { ...state, visible: action.events };
    case "SET_OPEN_EVENT":
      return { ...state, eventId: action.eventId };
    case "SET_OPEN_RESTAURANT":
      return { ...state, resturantName: action.resturantName };
    case "RECEIVE_EVENT":
      return { ...state, visible: [...visible, action.event] };
    case "CREATE_EVENT":
      (async () => {
        const resp = await axios({
          method: 'post',
          url: `${SERVER_URI}/events`,
          data: { 'resturant_name': resturantName }
        });
        if (resp.status !== 200) throw new Error(resp.data.error);
      })();
      return state;
    case "JOIN_EVENT":
      (async () => {
        const resp = await axios({
          method: 'post',
          url: `${SERVER_URI}/events/${eventId}/join`
        });
        if (resp.status !== 200) throw new Error(resp.data.error);
      })();
      return state;
    case "UNSET_OPEN_EVENT_RESTAURANT":
      return { ...state, resturantName: null, eventId: null };
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
  (() => {
    return (
      <View style={{ height: "100%", background: "black" }}>
        <AppNavigator />
        <StatusFooter />
      </View>
    );
  });

export default withProvider(App);
