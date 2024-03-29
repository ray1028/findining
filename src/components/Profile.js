import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import { Input, Icon, Avatar, withBadge, Button } from "react-native-elements";
import { connect } from "react-redux";

//
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
//

const options = [
  {
    key: "male",
    text: "Male"
  },
  {
    key: "female",
    text: "Female"
  }
];

const interests = [
  {
    id: 1,
    key: "finance",
    name: "finance",
    type: "material-community"
  },
  {
    id: 2,
    key: "sports",
    name: "soccer-ball-o",
    type: "font-awesome"
  },
  {
    id: 3,
    key: "date",
    name: "heart-o",
    type: "font-awesome"
  },
  {
    id: 4,
    key: "tech",
    name: "code",
    type: "entypo"
  },
  {
    id: 5,
    key: "art",
    name: "paint-brush",
    type: "font-awesome"
  },
  {
    id: 6,
    key: "health",
    name: "food-variant",
    type: "material-community"
  },
  {
    id: 7,
    key: "music",
    name: "music",
    type: "font-awesome"
  },
  {
    id: 8,
    key: "travel",
    name: "plane",
    type: "font-awesome"
  },
  {
    id: 9,
    key: "book",
    name: "book",
    type: "font-awesome"
  },
  {
    id: 10,
    key: "gym",
    name: "dumbbell",
    type: "material-community"
  }
];

const BadgedIcon = withBadge(
  <Icon
    type="font-awesome"
    name="camera"
    containerStyle={{
      backgroundColor: "lightblue",
      width: 50,
      borderRadius: 50,
      borderStyle: "solid",
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center"
    }}
  />,
  { top: 3, right: -10 }
)(Avatar);

const Profile = ({
  genderChecked,
  changeGenderChecked,
  pushInterestsHandler,
  userInterests,
  username,
  removeInterestHandler,
  usernameChangeHandler,
  navigation,
  saveProfile,
  userImage,
  dispatchUpdateUserImage,
  dispatchUpdateUserBase64,
  userImageBase64,
  // current logged in user and user interestss
  // allInterests,
  currentUserAndInterests
}) => {
  // image picker
  useEffect(() => {
    getPermissionAsync = async () => {
      // if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    };
  }, []);

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      exif: true
    });

    if (!result.cancelled) {
      dispatchUpdateUserImage(result.uri);
      dispatchUpdateUserBase64(result.base64);
    }
  };

  return (
    <View style={styles.profileContainer}>
      <View style={styles.topContainer}>
        <ImageBackground
          source={require("../assets/images/profile_background.jpeg")}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableWithoutFeedback onPress={() => _pickImage()}>
            <BadgedIcon
              source={{
                uri: userImage
              }}
              rounded
              size={170}
            />
          </TouchableWithoutFeedback>
        </ImageBackground>
      </View>

      <View style={styles.bottomContainer}>
        <Input
          inputStyle={{
            textAlign: "center",
            color: "white"
          }}
          containerStyle={{
            paddingTop: 10,
            width: "80%",
            borderColor: "orange"
          }}
          value={username}
          onChangeText={name => usernameChangeHandler(name)}
          label={"Your Name"}
          color="white"
        />
        <View style={styles.radioBoxContainer}>
          {options.map(option => {
            return (
              <View key={option.key} style={styles.radioOptionContainer}>
                {option.key === "male" ? (
                  <Icon
                    type="foundation"
                    name="male-symbol"
                    iconStyle={{ color: "white" }}
                  />
                ) : (
                  <Icon
                    type="foundation"
                    name="female-symbol"
                    iconStyle={{ color: "white" }}
                  />
                )}
                <TouchableOpacity
                  style={styles.radioBox}
                  onPress={() => changeGenderChecked(option.key)}
                >
                  {genderChecked === option.key && (
                    <View style={styles.checkedCircle} />
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View style={styles.interestContainer}>
          {interests.map(interest => {
            const isSelected = userInterests.includes(interest.id);
            return (
              <TouchableOpacity
                key={interest.id}
                style={styles.iconContainer}
                onPress={() => {
                  if (isSelected) {
                    removeInterestHandler(interest.id);
                  } else {
                    pushInterestsHandler(interest.id);
                  }
                }}
              >
                <Icon
                  type={interest.type}
                  name={interest.name}
                  iconStyle={{ color: isSelected ? "orange" : "white" }}
                  size={35}
                  underlayColor="blue"
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          title="SAVE"
          containerStyle={{ width: 100, marginTop: 20 }}
          buttonStyle={{
            backgroundColor: "orange",
            borderRadius: 40
          }}
          onPress={() => saveProfile()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1
  },
  topContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  userIcon: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 60
  },
  radioBox: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
    alignItems: "center",
    marginLeft: 10,
    justifyContent: "center"
  },
  radioBoxContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  radioOptionContainer: {
    flexDirection: "row",
    margin: 10
  },
  bottomContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3A445D"
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "orange"
  },
  interestContainer: {
    // flex: 1,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginTop: 15
  },
  iconContainer: {
    borderColor: "orange",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 50,
    padding: 12,
    margin: 3
  }
});

const mapStateToProps = state => {
  return {
    ...state.userProfile
    // checked: state.userProfile.genderChecked,
    // userInterests: state.userProfile.userInterests,
    // userName: state.userProfile.username,
    // currentUser: state.loginCredentials.currentUser,
    // allInterests: state.userProfile.allInterests,
    // currentUserAndInterests: state.userProfile.currentUserAndInterests,
    // interestProfile: state.userProfile.interestProfile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeGenderChecked: check =>
      dispatch({ type: "SET_GENDER_CHECKED", check }),
    usernameChangeHandler: name => dispatch({ type: "SET_USERNAME", name }),
    saveProfile: () => dispatch({ type: "SAVE_PROFILE" }),
    pushInterestsHandler: interest =>
      dispatch({ type: "ADD_INTEREST", interest }),
    removeInterestHandler: interest =>
      dispatch({ type: "REMOVE_INTEREST", interest }),
    dispatchGetUsersInterests: id =>
      dispatch({ type: " ACTION_USER_INTERESTS", value: id }),

    dispatchNewUserInterests: newUserInterests =>
      dispatch({ type: "SET_NEW_USER_INTERESTS", value: newUserInterests }),
    dispatchUpdateUserInterests: updatedUserInterests =>
      dispatch({
        type: "UPDATE_NEW_USER_INTERESTS",
        value: updatedUserInterests
      }),
    dispatchUpdateUserImage: uri =>
      dispatch({
        type: "SET_USER_IMAGE_URI",
        value: uri
      }),
    dispatchUpdateUserBase64: base64 =>
      dispatch({
        type: "SET_USER_IMAGE_BASE_64",
        value: base64
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
