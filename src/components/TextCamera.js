import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Button, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import { Header } from "react-native-elements";
import MapScreen from "./MapScreen";

// Object {
//   "ColorSpace": 1,
//   "ComponentsConfiguration": "???",
//   "Compression": 6,
//   "DateTime": "2019:09:26 15:46:36",
//   "DateTimeDigitized": "2019:09:26 15:46:36",
//   "DateTimeOriginal": "2019:09:26 15:46:36",
//   "DigitalZoomRatio": 1,
//   "ExifVersion": "0220",
//   "ExposureBiasValue": 0,
//   "ExposureMode": 0,
//   "ExposureProgram": 0,
//   "ExposureTime": 0.029999,
//   "FNumber": 2,
//   "Flash": 0,
//   "FlashpixVersion": "0100",
//   "FocalLength": 3.5,
//   "ISOSpeedRatings": 178,
//   "ImageDescription": "",
//   "ImageLength": 4608,
//   "ImageWidth": 3456,
//   "InteroperabilityIndex": "R98",
//   "JPEGInterchangeFormat": 1268,
//   "JPEGInterchangeFormatLength": 7216,
//   "LightSource": 255,
//   "Make": "asus",
//   "MeteringMode": 1,
//   "Model": "ASUS_X018D",
//   "Orientation": 1,
//   "PixelXDimension": 3456,
//   "PixelYDimension": 4608,
//   "ResolutionUnit": 2,
//   "SceneCaptureType": 0,
//   "Software": "MediaTek Camera Application",
//   "SubSecTime": "97",
//   "SubSecTimeDigitized": "97",
//   "SubSecTimeOriginal": "97",
//   "WhiteBalance": 0,
//   "XResolution": 72,
//   "YCbCrPositioning": 2,
//   "YResolution": 72,
// }

const mapStateToProps = ({ cameraView }) => cameraView;
const mapDispatchToProps = dispatch => ({
  setCameraPermission: status => {
    dispatch({ type: "SET_CAMERA_STATUS", value: status });
  },
  setCamera: camera => {
    dispatch({ type: "SET_CAMERA", value: camera });
  },
  dispatchUploadEvent: (image) => {
    dispatch({ type: "ACTION_IMAGE_AWS", value: image });
  },
  dispatchResetCamera: () => {
    dispatch({ type: "RESET_CAMERA" });
  },
  setOpenRestaurantByName: (restaurantName) => {
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
    backgroundColor: "white",
    borderStyle: "solid",
    borderColor: "orange",
    opacity: 2,
    borderRadius: 50
  },
  headerBar: {
    color: "white"
  }
});

const TextCamera = connect(mapStateToProps, mapDispatchToProps)
  (({
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
      // cleaning up camera
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
    }, [])

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
            style={styles.headerBar}
            centerComponent={{ text: "Findining" }}
            backgroundColor="#3A445D"
          >
            {/* <MapScreen /> */}
          </Header>
          <View style={styles.topContainer}>
            <Camera
              style={{ flex: 1, position: "relative" }}
              ref={setCamera}
              type={Camera.Constants.Type.back}
              onMountError={(...p) => console.log(p)}
            >
              {bounds.map((bound, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      try {                        
                        setOpenRestaurantByName(bound.text);
                        navigation.navigate('EventDetail');
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                    style={{ ...bound, position: "absolute", borderWidth: 3 }}
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
  });

export default TextCamera;
