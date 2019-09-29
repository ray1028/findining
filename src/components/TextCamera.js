import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Text, View, TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";

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

const TextCamera = ({
  hasCameraPermission,
  camera,
  setCamera,
  setCameraPermission,
  dispatchUploadEvent
}) => {
  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      console.log("set status", status);
      setCameraPermission(status);
    })();
  }, []);
  console.log("permission check", hasCameraPermission);
  if (hasCameraPermission === null) {
    return <View />;
  } else if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  } else {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          ref={setCamera}
          type={Camera.Constants.Type.back}
          onMountError={(...p) => console.log(p)}
        >
          <View
            style={{
              flex: 0.5,
              backgroundColor: "transparent",
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: "flex-end",
                alignItems: "center"
              }}
              onPress={async () => {
                if (camera) {
                  const photo = await camera.takePictureAsync({
                    exif: true,
                    base64: true,
                    skipProcessing: true
                  });
                  // console.log(photo.base64.length, photo.exif);
                  dispatchUploadEvent({
                    image: photo.base64,
                    meta: photo.exif
                  });
                }
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
                {" "}
                Capture{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
};

const mapStateToProps = ({ camera }) => camera;
const mapDispatchToProps = dispatch => ({
  setCameraPermission: status =>
    dispatch({ type: "SET_CAMERA_STATUS", value: status }),
  setCamera: camera => dispatch({ type: "SET_CAMERA", value: camera }),
  dispatchUploadEvent: image =>
    dispatch({ type: "ACTION_IMAGE_AWS", value: image })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextCamera);
