import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';

export default function CreateMenu({visible, setVisible}) {
  return (
    <Modal
        visible={visible}
        transparent={true}
        animationType='slide'
    >
        <View>
            <Text>
                What would you like to create?
            </Text>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});