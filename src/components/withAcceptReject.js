import React from 'react';
import { connect } from "react-redux";
import { Modal, Text, View, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const withAcceptReject = (Component) => {
  return (props) => {
    const { onAccept, onReject } = props;
    return (
      <View style={{ flex: 1 }}>
        <Component {...props} />
        <View style={{ backgroundColor: 'transparent', height: 150, zIndex: 1, position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity onPress={onAccept}>
            <Icon
              name="check-circle"
              size={140}
              color="green"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onReject}>
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