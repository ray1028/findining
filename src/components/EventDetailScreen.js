import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import GestureRecognizer from "react-native-swipe-gestures";
import { createSwitchNavigator, NavigationActions } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { connect } from "react-redux";
import MenuScreen from "./MenuScreen";
import UserScreen from "./UserScreen";
import withAcceptReject from "./withAcceptReject";

import { fromRight } from "react-navigation-transitions";

const PanelNavigator = createStackNavigator(
  {
    User: UserScreen,
    Menu: MenuScreen
  },
  {
    transitionConfig: () => fromRight(300),
    initialRouteName: "User",
    backBehavior: "none",
    defaultNavigationOptions: {
      header: null
    }
  }
);

const mapStateToProps = ({ eventDetail }) => eventDetail;

const mapDispatchToProps = dispatch => ({
  paginate: screen => {
    dispatch({ type: "SET_EVENT_DETAIL_SCREEN", screen });
  },
  guestJoinEvent: () => {
    dispatch({ type: "JOIN_EVENT" });
  },
  hostCreateEvent: () => {
    dispatch({ type: "CREATE_EVENT" });
  },
  cancelEventSelection: () => {
    dispatch({ type: "CLOSE_EVENT_DETAIL_SCREEN" });
  }
});

const OverlayEventGestureNavigator = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withAcceptReject(({ navigation, selectedScreen, paginate }) => {
    const config = {
      velocityThreshold: 0.1,
      directionalOffsetThreshold: 60
    };
    return (
      <GestureRecognizer
        onSwipeRight={() => {
          paginate("User");
          navigation.navigate("User");
        }}
        onSwipeLeft={() => {
          paginate("Menu");
          navigation.navigate("Menu");
        }}
        config={config}
        style={{
          flex: 1,
          backgroundColor: "transparent"
        }}
      >
        <PanelNavigator navigation={navigation} />
        <View
          style={{
            zIndex: 1,
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 40,
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <Icon
            size={22}
            style={{ color: "red", paddingRight: 5 }}
            type="font-awesome"
            name={"User" === selectedScreen ? "circle" : "circle-o"}
          />
          <Icon
            size={22}
            style={{ color: "red" }}
            type="font-awesome"
            name={"Menu" === selectedScreen ? "circle" : "circle-o"}
          />
        </View>
      </GestureRecognizer>
    );
  })
);

OverlayEventGestureNavigator.router = PanelNavigator.router;

const OverlayMenuScreen = withAcceptReject(MenuScreen);

const EventWrapper = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  ({
    navigation,
    user,
    restaurant,
    hostCreateEvent,
    guestJoinEvent,
    cancelEventSelection
  }) => {
    if (user) {
      return (
        <OverlayEventGestureNavigator
          navigation={navigation}
          onAccept={() => {
            guestJoinEvent();
            navigation.navigate("MainNavigator");
          }}
          onReject={() => {
            cancelEventSelection();
            navigation.navigate("MainNavigator");
          }}
        />
      );
    } else {
      return (
        <OverlayMenuScreen
          navigation={navigation}
          onAccept={() => {
            hostCreateEvent();
            navigation.navigate(
              "MainNavigator",
              {},
              NavigationActions.navigate({ routeName: "Map" })
            );
          }}
          onReject={() => {
            cancelEventSelection();
            navigation.navigate(
              "MainNavigator",
              {},
              NavigationActions.navigate({ routeName: "Map" })
            );
          }}
        />
      );
    }
  }
);

EventWrapper.router = OverlayEventGestureNavigator.router;

export default EventWrapper;
