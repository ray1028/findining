import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { connect } from "react-redux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { Image } from "react-native-elements";

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

const MapScreen = props => {
  const { events } = props;
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      console.error("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({});
    if (location) {
      console.log("should update state location " + JSON.stringify(location));
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
      {events.map(event => {
        const { user, restaurant } = event;
        return (
          <Marker
            onPress={() => props.navigation.navigate("EventDetail", { user, restaurant })}
            key={user.id}
            coordinate={{
              latitude: restaurant.latlng.lat,
              longitude: restaurant.latlng.lng
            }}
          >
            <TouchableOpacity>
              <Image
                source={{ uri: user.profile_uri }}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </Marker>
        );
      })}
    </MapView>
  );
};

const mapStateToProps = state => ({
  userCurrentLocation: state.findUserCurrentLocation.userCurrentLocation || "",
  events: state.events.visible
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
)(MapScreen);

const styles = StyleSheet.create({});
