import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { useState } from 'react';

import { TASK_PRIORITY } from './constants';
import { STATUS } from './constants';
import { FlatList } from 'react-native/types_generated/index';
// const priorityOptions = [
//   {label: 'High', value: TASK_PRIORITY.HIGH},
//   {label: 'Medium', value: TASK_PRIORITY.MEDIUM},
//   {label: 'Low', value: TASK_PRIORITY.LOW},
// ];

export default function HomeScreen() {
  const today = new Date();
  const weekday = today.toLocaleDateString('en-US', {
    weekday: 'long',
  });

  const date = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Do MKTG HW',
      category: 'School',
      status: STATUS.INCOMPLETE,
      dueDate: newDate(2026,9,20,23,59), //year, month, day, hour, minute
      priority: TASK_PRIORITY.HIGH,
    },

    {
      id: 2,
      title: 'Go to Pharmacy',
      category: 'Other',
      status: STATUS.INCOMPLETE,
      dueDate: newDate(2026,9,25,23,59), //year, month, day, hour, minute
      priority: TASK_PRIORITY.MEDIUM,
    },

    {
      id: 3,
      title: 'Make Social Media Posts',
      category: 'Work',
      status: STATUS.INCOMPLETE,
      dueDate: newDate(2026,9,31,23,59), //year, month, day, hour, minute
      priority: TASK_PRIORITY.LOW,
    },
  ]);
  const [habits, setHabits] = useState([]);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={{fontWeight:'700', fontSize: 25, paddingBottom: 5,}}>{weekday}</Text>
        <Text style={{paddingBottom: 5,}}>{date}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill}/>
        </View>

        <Text style={styles.progressCount}>
          {/* {completedTasks}/{totalTasks} */}
        </Text>
      </View>
      
      <FlatList>

      </FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  header: {
    paddingTop: 50,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    alignItems: 'center'
  },
});
