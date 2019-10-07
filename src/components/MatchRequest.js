import React from "react";
import { connect } from "react-redux";
import { FlatList, Text, View, Alert, TouchableOpacity } from "react-native";
import { Image, ListItem, Badge } from "react-native-elements";
import UserScreen from "./UserScreen";
import withAcceptReject from "./withAcceptReject";

const OverlayUserScreen = withAcceptReject(UserScreen);

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
  acceptMatchRequest: () => dispatch({ type: 'ACCEPT_MATCH_REQUEST' })
});
const MatchRequest = connect(mapStateToProps, mapDispatchToProps)
  (({ navigation, acceptMatchRequest }) => {
    return (
      <View style={{flex: 1}}>
        <OverlayUserScreen
          onAccept={() => {
            acceptMatchRequest();
            navigation.navigate('MainNavigator');
          }}
          onReject={() => {
            navigation.navigate('MainNavigator');
          }}
        />        
      </View>
    )
  });

export default MatchRequest;