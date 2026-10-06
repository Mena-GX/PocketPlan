import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import CreateTaskScreen from './CreateTaskScreen';
import CreateHabitScreen from './CreateHabitScreen';

export default function App() {

  const Stack = createNativeStackNavigator();


  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
      >

        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
        />

        <Stack.Screen
          name="CreateTask"
          component={CreateTaskScreen}
        />

        <Stack.Screen
          name="CreateHabit"
          component={CreateHabitScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
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
