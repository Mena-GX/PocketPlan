import { StyleSheet, Text, View } from 'react-native';

export default function CreateTaskScreen() {
  return (
    <View style={styles.container}>
      <Text>This is the create tasks screen</Text>
    </View>
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
