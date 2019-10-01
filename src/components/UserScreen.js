import React from 'react';
import { connect } from "react-redux";
import { Modal, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const UserScreen = () => {
  return (
    <View>
      <View backgroundColor="black" style={{ flex: 1 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../assets/images/ray.png')}
            containerStyle={{ width: 260, height: 260, borderRadius: 130, overflow: 'hidden' }}
          />
          <Text style={{ color: 'white', fontSize: 40, overflow: 'hidden', borderBottomWidth: 5, borderBottomColor: 'white' }}>
            Ray J
          </Text>
          <Text style={{ color: 'white', fontSize: 20, marginTop: 60 }}>
            Single and looking to mingle
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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
    </View>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({ });

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
