import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Button, Text, Modal, StyleSheet } from "react-native";
import Login from "./src/components/Login";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createStackNavigator } from "react-navigation-stack";
import Signup from "./src/components/Signup";
import Home from "./src/components/Home";
import TextCamera from "./src/components/TextCamera";
import MainScreen from "./src/components/MainScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import UserModal from "./src/components/User";
import MenuView from "./src/components/MenuView";
import { Menu } from "react-native-paper";
import withAcceptReject from "./src/components/withAcceptReject";
import withPanelNavigation from "./src/components/withPanelNavigation";

// bottom tab routes here may wanna moduliza later
const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: MainScreen,
      navigationOption: {
        tabBarLabel: "Home",
        tabBarIcon: ({ focused }) => (
          <View>
            <Icon name="user" size={35} color="white" />
          </View>
        )
      }
    },
    Camera: {
      screen: TextCamera,
      navigationOption: {
        tabBarLabel: "Camera",
        tabBarIcon: ({ focused }) => (
          <View>
            <Icon name="user" size={35} />
          </View>
        )
      }
    },
    Setting: {
      screen: Home,
      navigationOption: {
        tabBarLabel: "Setting",
        tabBarIcon: ({ focused }) => (
          <View>
            <Icon name="user" size={35} />
          </View>
        )
      }
    }
  },
  {
    initialRouteName: "Home",
    order: ["Home", "Camera", "Setting"]
  }
);

// routing here for now maybe modulize later

const AuthStack = createStackNavigator(
  {
    // Splash: { screen: Splash },
    SignIn: { screen: Login },
    Signup: { screen: Signup },
    TabNavigator: {
      screen: TabNavigator,
      navigationOptions: {
        header: null
      }
    }
  },
  { initialRouteName: "SignIn" }
);

// MainNavigator

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
      return { ...state, userName: action.username };
    default:
      return state;
  }
};

const userCurrentlocationStateReducer = (state, action) => {
  if (state === undefined) return {};
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, userCurrentLocation: action.location };
    default:
      return state;
  }
};

const cameraStateReducer = (state, action) => {
  if (state === undefined) return { hasCameraPermission: null };
  switch (action.type) {
    case "SET_CAMERA":
      return { ...state, camera: action.value };
    case "SET_CAMERA_STATUS":
      return { ...state, hasCameraPermission: action.value };
    default:
      return state;
  };
};

const MenuViewAR = withAcceptReject(MenuView);

const ModalStateReducer = (state, action) => {
  if (state === undefined) return { current: null, data: null };
  switch (action.type) {
    case "SHOW_MODAL_USER":
      return { ...state, current: UserModal, data: action.data };
    case "SHOW_MODAL_MENU":
      return { ...state, current: MenuViewAR, data: action.data };
    case "CLOSE_MODAL":
      return { ...state, current: null, data: null };
    default:
      return state;
  }
};

const reducer = combineReducers({
  loginCredentials: loginStateReducer,
  signupNewUser: signupStateReducer,
  findUserCurrentLocation: userCurrentlocationStateReducer,
  camera: cameraStateReducer,
  modals: ModalStateReducer
});

const store = createStore(reducer);

const AppNavigator = createAppContainer(AuthStack);

const DetailsView = withPanelNavigation(UserModal, MenuView);

function App({ modals, dispatch }) {
  const styles = StyleSheet.create({
    btn: {
      borderWidth: 5
    },
    main: {
      paddingTop: 60,
      display: 'flex',
      height: '100%',
      borderWidth: 5
    }
  });

  const CurrentModalComponent = modals.current;
  if (CurrentModalComponent) {
    return (<Modal animationType="slide" transparent={false}><CurrentModalComponent /></Modal>);
  }

  return (
    <View style={{ paddingTop: 60, height: '100%', background: 'black' }} >
      {/* <AppNavigator /> */}
      {/* <TextCamera /> */}
      {/* <Button title={"SHOW"} style={styles.btn} onPress={() => { */}
        {/* dispatch({ type: "SHOW_MODAL_MENU", data: "TEST" }); */}
      {/* }} /> */}
    </View>
  );
}

const withProvider = (AppComponent) => {
  return () => (<Provider store={store}><AppComponent /></Provider>);
}

const mapStateToProps = ({ modals }) => ({ modals });
const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch
});

export default withProvider(connect(mapStateToProps, mapDispatchToProps)(App));
