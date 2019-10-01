import React from 'react';
import { connect } from "react-redux";
import { Modal, Text, View, Alert, TouchableOpacity, Icon } from 'react-native';
import { Image } from 'react-native-elements';
import { createSwitchNavigator } from 'react-navigation';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import UserScreen from "./UserScreen";
import MenuScreen from "./MenuScreen";

const PanelNavigator = createSwitchNavigator({
  User: UserScreen,
  Menu: MenuScreen
},
  {
    initialRouteName: 'User',
    defaultNavigationOptions: {
      header: null,
      // gesturesEnabled: true,
      // gestureDirection: 'horizontal',
      // gestureResponseDistance: {
      //   horizontal: 600,
      //   vertical: 600
      // }
    }
  });

const EventDetailScreen = (props) => {
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40
  };
  return (
    <GestureRecognizer
      onSwipeLeft={() => props.navigation.navigate('User')}
      onSwipeRight={() => props.navigation.navigate('Menu')}
      config={config}
      style={{
        flex: 1,
        backgroundColor: 'transparent'
      }}
    >
      <PanelNavigator {...props} />
    </GestureRecognizer>
  )
};

EventDetailScreen.router = PanelNavigator.router;

export default EventDetailScreen;
