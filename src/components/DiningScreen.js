import React from 'react';
import { connect } from "react-redux";
import { Text, View, FlatList } from 'react-native';
import { Rating, Image, Icon, Button } from 'react-native-elements';
import MenuScreen from "./MenuScreen";

const mapStateToProps = ({ eventDetail }) => eventDetail;
const mapDispatchToProps = (dispatch) => ({
  finishDining: () => dispatch({ type: "FINISH_DININING" }),
  sendRating: (rating) => console.log("RATING", rating) || dispatch({ type: "SEND_RATING", rating })
});

const DininingScreen = connect(mapStateToProps, mapDispatchToProps)
  (({ navigation, rating, finishDining, sendRating }) => {
    return (
      <View style={{ flex: 1 }}>
        {/* <View style={{ flex: 1, backgroundColor: 'grey' }} /> */}
        <MenuScreen />
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'transparent', height: 120, alignItems: 'center' }} >
          <Button containerStyle={{ width: '50%' }} title="Finish Dining" onPress={finishDining} />
          <Rating
            startingValue={`{${rating}}`}
            onFinishRating={sendRating}
            style={{ paddingVertical: 10 }}
            containerStyle={{ background: 'transparent' }}
            style={{ background: 'transparent' }}
          />
        </View>
      </View>
    );
  });

export default DininingScreen;
