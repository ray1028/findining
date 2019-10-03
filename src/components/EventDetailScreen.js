import React from 'react';
import { connect } from "react-redux";
import { Text, View, FlatList } from 'react-native';
import { Image, Icon } from 'react-native-elements';
import { createSwitchNavigator, NavigationActions } from 'react-navigation';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import UserScreen from "./UserScreen";
import MenuScreen from "./MenuScreen";
import withAcceptReject from "./withAcceptReject";

const PanelNavigator = createSwitchNavigator({
  User: UserScreen,
  Menu: MenuScreen
},
  {
    initialRouteName: 'User',
    backBehavior: 'none',
    defaultNavigationOptions: {
      header: null
    }
  });

const mapStateToProps = ({ eventDetail }) => eventDetail;

const mapDispatchToProps = (dispatch) => ({
  navigatePaginate: (navigation, screen) => {
    navigation.navigate(screen);
    dispatch({ type: 'SET_EVENT_SCREEN', screen });
  }
})

const OverlayEventGestureNavigator = connect(mapStateToProps, mapDispatchToProps)
  (withAcceptReject(({ navigation, selectedScreen, navigatePaginate }) => {
    const config = {
      velocityThreshold: 0.1,
      directionalOffsetThreshold: 60
    };
    return (
      <GestureRecognizer
        onSwipeRight={() => navigatePaginate(navigation, 'User')}
        onSwipeLeft={() => navigatePaginate(navigation, 'Menu')}
        config={config}
        style={{
          flex: 1,
          backgroundColor: 'transparent'
        }}
      >
        <PanelNavigator navigation={navigation} />
        <View style={{ zIndex: 1, position: 'absolute', left: 0, bottom: 0, width: '100%', height: 40, flexDirection: 'row', justifyContent: 'center' }}>
          <Icon size={22} style={{ color: 'red', paddingRight: 5 }} type="font-awesome" name={'User' === selectedScreen ? "circle" : "circle-o"} />
          <Icon size={22} style={{ color: 'red' }} type="font-awesome" name={'Menu' === selectedScreen ? "circle" : "circle-o"} />
        </View>
      </GestureRecognizer>
    )
  }));

OverlayEventGestureNavigator.router = PanelNavigator.router;

const OverlayMenuScreen = withAcceptReject(MenuScreen)

const EventWrapper = ({ navigation }) => {
  const user = navigation.getParam('user', null);
  const menuList = navigation.getParam('menuList', null);
  if (user) {
    return (
      <OverlayEventGestureNavigator
        navigation={navigation}
        onAccept={() => navigation.navigate('MainNavigator')}
        onReject={() => navigation.navigate('MainNavigator')}
      />
    );
  } else {
    return (
      <OverlayMenuScreen
        navigation={navigation}
        onAccept={() => navigation.navigate('MainNavigator', {}, NavigationActions.navigate({ routeName: 'Map' }))}
        onReject={() => navigation.navigate('MainNavigator', {}, NavigationActions.navigate({ routeName: 'Map' }))}
      />
    )
  }
}

EventWrapper.router = OverlayEventGestureNavigator.router;

export default EventWrapper;
