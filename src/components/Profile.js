import React from "react";
import { View, StyleSheet, Text, ImageBackground } from "react-native";
import { Image, Input, Header, Icon } from "react-native-elements";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native";

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
    key: "finance",
    name: "finance",
    type: "material-community"
  },
  {
    key: "sports",
    name: "soccer-ball-o",
    type: "font-awesome"
  },
  {
    key: "date",
    name: "heart-o",
    type: "font-awesome"
  },
  {
    key: "tech",
    name: "code",
    type: "entypo"
  },
  {
    key: "art",
    name: "paint-brush",
    type: "font-awesome"
  },
  {
    key: "health",
    name: "food-variant",
    type: "material-community"
  },
  {
    key: "music",
    name: "music",
    type: "font-awesome"
  },
  {
    key: "travel",
    name: "plane",
    type: "font-awesome"
  },
  {
    key: "book",
    name: "book",
    type: "font-awesome"
  },
  {
    key: "gym",
    name: "dumbbell",
    type: "material-community"
  }
];

const Profile = ({
  checked,
  changeGenderChecked,
  pushInterestsHandler,
  userInterests,
  removeInterestHandler
}) => {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.topContainer}>
        <ImageBackground
          source={require("../assets/images/profile-background.jpg")}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            style={styles.userIcon}
            source={{
              uri: "https://facebook.github.io/react-native/img/tiny_logo.png"
            }}
          />
        </ImageBackground>
      </View>

      <View style={styles.bottomContainer}>
        <Input
          placeholder="Name That You Wish To Be Called"
          style={{ margin: 20 }}
        />
        <View style={styles.radioBoxContainer}>
          {options.map(option => {
            return (
              <View key={option.key} style={styles.radioOptionContainer}>
                {option.key === "male" ? (
                  <Icon type="foundation" name="male-symbol" />
                ) : (
                  <Icon type="foundation" name="female-symbol" />
                )}
                <TouchableOpacity
                  style={styles.radioBox}
                  onPress={() => changeGenderChecked(option.key)}
                >
                  {checked === option.key && (
                    <View style={styles.checkedCircle} />
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View style={styles.interestContainer}>
          {interests.map(interest => {
            return (
              <TouchableOpacity
                key={interest.key}
                style={styles.iconContainer}
                onPress={() => {
                  !userInterests.includes(interest.key)
                    ? pushInterestsHandler(interest.key)
                    : removeInterestHandler(interest.key);
                }}
              >
                <Icon
                  type={interest.type}
                  name={interest.name}
                  iconStyle={{
                    color: userInterests.includes(interest.key)
                      ? "orange"
                      : "black"
                  }}
                  size={35}
                  underlayColor="blue"
                />
              </TouchableOpacity>
            );
          })}
        </View>
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
    width: 120,
    height: 120,
    borderRadius: 60
  },
  radioBox: {
    height: 20,
    width: 20,
    borderRadius: 10,
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
    backgroundColor: "white"
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "black"
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
    // margin: 5
  }
});

const mapStateToProps = state => {
  return {
    checked: state.userProfile.genderChecked || "",
    userInterests: state.userProfile.userInterests
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeGenderChecked: check =>
      dispatch({ type: "SET_GENDER_CHECKED", check }),
    pushInterestsHandler: interest =>
      dispatch({ type: "SET_INTEREST", interest }),
    removeInterestHandler: interest =>
      dispatch({ type: "REMOVE_INTEREST", interest })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
