import React, { useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { connect } from "react-redux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

let fakeUsersObj = [
  {
    id: 1,
    iconImage: require("../assets/images/findining.png"),
    latitude: 43.644152,
    longitude: -79.402227
  },
  {
    id: 2,
    iconImage: require("../assets/images/findining.png"),
    latitude: 43.644154,
    longitude: -79.402223
  },
  {
    id: 3,
    iconImage: require("../assets/images/findining.png"),
    latitude: 43.6441543,
    longitude: -79.402222
  }
];

let location = {};

const MainScreen = props => {
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      console.error("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({});
    if (location) {
      console.log("should update state location " + JSON.stringify(location));
      // findCurrentLocationHandler({ location });
      // {"timestamp":1569511353910,"mocked":false,"coords":{"altitude":50.29999923706055,"heading":0,"longitude":-79.4021192,"speed":0,"latitude":43.6441615,"accuracy":15.651000022888184}}
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android" && !Constants.isDevice) {
        console.log(_getLocationAsync());
        console.log("is thi s a device ? " + Constants.isDevice);
      } else {
        location = await _getLocationAsync();
        console.log(
          "currrent location for your device is " + JSON.stringify(location)
        );
      }
    })();
  }, []);

  // watcher for users current locations changes

  Location.watchPositionAsync({ timeInterval: 3000 }, () => {
    console.log("the location is now changed");
  });

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 43.644299,
        longitude: -79.402225,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
    >
      {fakeUsersObj.map(user => (
        <Marker
          key={user.id}
          coordinate={{
            latitude: user.latitude,
            longitude: user.longitude
          }}
          image={require("../assets/images/findining.png")}
        />
      ))}

      {/* <Marker
        coordinate={{
          latitude: 43.644299,
          longitude: -79.402225
        }}
        image={require("../images/findining.png")}
      /> */}
    </MapView>
  );
};

const mapStateToProps = state => ({
  userCurrentLocation: state.findUserCurrentLocation.userCurrentLocation || ""
});

const mapDispatchToProps = dispatch => {
  return {
    findCurrentLocationHandler: location =>
      dispatch({ type: "SET_LOCATION", location })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainScreen);

const styles = StyleSheet.create({
  mainScreenContainer: {
    // flexs: 1
  }
});
