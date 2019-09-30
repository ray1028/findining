import React from 'react';
import { connect } from "react-redux";
import { Modal, Text, View, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const withAcceptReject = (Component) => {
  return (props) => {
    return (
      <View>
        <Component {...props} style={{ height: '80%', background: 'transparent' }} />
        <View style={{ backgroundColor: 'transparent', height: 280, zIndex: 1, position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity onPress={() => console.log("Accept")}>
            <Icon
              name="check-circle"
              size={140}
              color="green"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Reject")}>
            <Icon
              name="times-circle"
              size={140}
              color="red"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default withAcceptReject;