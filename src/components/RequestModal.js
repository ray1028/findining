import React, { useState } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert } from 'react-native';

export default function RequestModal() {
  [modalVisible, setModalVisible] = useState(false)
  return (
    <View style={{ marginTop: 22 }}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {}}>
        <View style={{ marginTop: 22 }}>
          <View>
            <Text>Hello World!</Text>
            <TouchableHighlight
              onPress={() => {
                setModalVisible((prev) => !prev);
              }}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <TouchableHighlight
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text>Show Modal</Text>
      </TouchableHighlight>
    </View>
  );
};
