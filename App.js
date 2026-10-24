import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { testDatabase } from './src/database/testDatabase';
import { testCategoryRepository } from './src/database/testCategoryRepository';

import TabNavigator from './TabNavigator';
import CreateTaskScreen from './CreateTaskScreen';
import CreateHabitScreen from './CreateHabitScreen';


export default function App() {

  //const Stack = createNativeStackNavigator();
  // useEffect(() => {
  //   testDatabase()
  //   .then(() => {
  //     console.log('Database test completed');
  //   })
  //   .catch((error) => {
  //     console.error('Database test failed: ', error);
  //   });
  // }, []);

  useEffect(() => {
    testCategoryRepository()
    .then(() => {
      console.log('Category repository test passed.');
    })
    .catch((error) => {
      console.error('Category repository test failed:', error);
    });
  }, []);

  return (
    // <NavigationContainer>
    //   <Stack.Navigator
    //     screenOptions={{headerShown: false}}
    //   >

    //     <Stack.Screen
    //       name="MainTabs"
    //       component={TabNavigator}
    //     />

    //     <Stack.Screen
    //       name="CreateTask"
    //       component={CreateTaskScreen}
    //     />

    //     <Stack.Screen
    //       name="CreateHabit"
    //       component={CreateHabitScreen}
    //     />

    //   </Stack.Navigator>
    // </NavigationContainer>

    <View style={styles.container}>
      <Text>PocketPlan category repository test</Text>
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
