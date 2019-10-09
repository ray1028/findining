import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import { Header } from "react-native-elements";
import MapScreen from "./MapScreen";

const mapStateToProps = ({ cameraView }) => cameraView;
const mapDispatchToProps = dispatch => ({
  setCameraPermission: status => {
    dispatch({ type: "SET_CAMERA_STATUS", value: status });
  },
  setCamera: camera => {
    dispatch({ type: "SET_CAMERA", value: camera });
  },
  dispatchUploadEvent: image => {
    dispatch({ type: "ACTION_IMAGE_AWS", value: image });
  },
  dispatchResetCamera: () => {
    dispatch({ type: "RESET_CAMERA" });
  },
  setOpenRestaurantByName: restaurantName => {
    dispatch({ type: "SET_OPEN_RESTAURANT_NAME", restaurantName });
  }
});

const styles = StyleSheet.create({
  buttonConrainer: {
    flex: 1,
    flexDirection: "column-reverse",
    width: "100%",
    alignItems: "center",
    alignContent: "center",
    marginBottom: 10
  },
  topContainer: {
    flex: 7
  },
  bottomContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3A445D"
  },
  captureButton: {
    height: 100,
    width: 100,
    borderWidth: 15,
    backgroundColor: "#58B09C",
    opacity: 10,
    borderStyle: "solid",
    borderColor: "orange",
    opacity: 2,
    borderRadius: 50
  },
  headerBar: {
    color: "white"
  }
});

const TextCamera = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  ({
    hasCameraPermission,
    camera,
    bounds,
    setCamera,
    isFocused,
    setCameraPermission,
    dispatchUploadEvent,
    dispatchResetCamera,
    setOpenRestaurantByName,
    navigation
  }) => {
    useEffect(() => {
      if (!isFocused) {
        dispatchResetCamera();
        return;
      }
    }, [isFocused]);

    useEffect(() => {
      (async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        setCameraPermission(status);
      })();
    }, []);

    if (!isFocused) {
      return <View />;
    }

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Header
            centerComponent={{
              text: "Findining",
              style: {
                color: "white",
                fontWeight: "bold",
                fontSize: 30,
                letterSpacing: 1
              }
            }}
            backgroundImage={require("../assets/images/camera-top.jpeg")}
          ></Header>
          <View style={styles.topContainer}>
            <Camera
              style={{ flex: 1, position: "relative" }}
              ref={setCamera}
              type={Camera.Constants.Type.back}
              onMountError={(...p) => console.log("Camera Mount Error", p)}
            >
              {bounds.map((bound, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      try {
                        setOpenRestaurantByName(bound.text);
                        navigation.navigate("EventDetail");
                      } catch (err) {
                        console.log("Open Restaurant error", err);
                      }
                    }}
                    style={{
                      ...bound,
                      position: "absolute",
                      borderWidth: 3,
                      padding: 5,
                      borderColor: "#58B09C"
                    }}
                  ></TouchableOpacity>
                );
              })}
            </Camera>
          </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={async () => {
                if (camera) {
                  const photo = await camera.takePictureAsync({
                    exif: true,
                    base64: true,
                    skipProcessing: true
                  });
                  dispatchUploadEvent({
                    image: photo.base64,
                    meta: photo.exif
                  });
                }
              }}
            ></TouchableOpacity>
          </View>
        </View>
      );
    }
  }
);

export default TextCamera;
