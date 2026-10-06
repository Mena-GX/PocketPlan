import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, {useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './HomeScreen';
import HabitsScreen from './HabitsScreen';
import TasksScreen from './TasksScreen';
import StatisticsScreen from './StatisticsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ navigation}) {
    const [createMenuOpen, setCreateMenuOpen] = useState(false);

  return (
    <View style={{flex: 1}}>
        <Tab.Navigator
            screenOptions={({ route}) => ({
                headerShown: false,

                tabBarIcon: ({ focused, color, size}) => {
                    let iconName;

                    if(route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Tasks') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Create') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'Habits') {
                        iconName = focused ? 'repeat' : 'repeat-outline';
                    } else if (route.name === 'Stats') {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="Tasks" component={TasksScreen}/>
            <Tab.Screen
                name="Create"
                component={HomeScreen}
                options={{
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...props}
                            onPress={() =>
                                setCreateMenuOpen(!createMenuOpen)
                            }
                        />
                    ),
                }}
            />
            <Tab.Screen name="Habits" component={HabitsScreen}/>
            <Tab.Screen name='Stats' component={StatisticsScreen}/>
        </Tab.Navigator>

        {createMenuOpen && (
            <View
                style={{
                    position: 'absolute',
                    bottom: 100,
                    alignSelf: 'center',
                    borderRadius: 15,
                    padding: 10,
                    backgroundColor: 'white',
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        setCreateMenuOpen(false);
                        navigation.navigate('CreateTask')
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            margin: 10,
                            fontSize: 25,
                        }}
                    >
                        Task
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setCreateMenuOpen(false);
                        navigation.navigate('CreateTask')
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            margin: 10,
                            fontSize: 25,
                        }}
                    >
                        Habit
                    </Text>
                </TouchableOpacity>
            </View>
        )}
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
