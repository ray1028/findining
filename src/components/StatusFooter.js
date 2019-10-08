import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";

const mapStateToProps = ({ events }) => events;
const mapDispatchToProps = (dispatch) => ({
  cancelUserStatus: (status) => dispatch({ type: "CANCEL_USER_STATUS", status })
});

const StatusFooter = connect(mapStateToProps, mapDispatchToProps)(
  ({ status, message, cancelUserStatus }) => {
    if (message) {
      return (
        <View style={{ width: '100%', height: 40, backgroundColor: 'yellow', position: 'absolute', bottom: 49, left: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18 }}>{message}</Text>
          <TouchableOpacity onPress={() => cancelUserStatus()}>
            <Icon
              name="times-circle"
              type="font-awesome"
              size={30}
              color="red"
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (<View />);
    }
  });

export default StatusFooter;