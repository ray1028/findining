import React from 'react';
import { connect } from "react-redux";
import { Text, View, FlatList } from 'react-native';
import { Image, Icon } from 'react-native-elements';
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
    backBehavior: 'none',
    defaultNavigationOptions: {
      header: null
    }
  });

const EventDetailScreen = ({ navigation, selectedScreen, navigatePaginate }) => {
  const config = {
    velocityThreshold: 0.1,
    directionalOffsetThreshold: 60
  };
  console.log(selectedScreen);
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
        <Icon size={22} style={{ color: 'red', marginRight: 5 }} type="font-awesome" name={'User' === selectedScreen ? "circle" : "circle-o"} />
        <Icon size={22} style={{ color: 'red' }} type="font-awesome" name={'Menu' === selectedScreen ? "circle" : "circle-o"} />
      </View>

    </GestureRecognizer>
  )
};

EventDetailScreen.router = PanelNavigator.router;

const mapStateToProps = ({ eventDetail }) => eventDetail;

const mapDispatchToProps = (dispatch) => ({
  navigatePaginate: (navigation, screen) => {
    navigation.navigate(screen);
    dispatch({ type: 'SET_EVENT_SCREEN', screen });
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EventDetailScreen);
