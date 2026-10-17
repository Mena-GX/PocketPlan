import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { useState } from 'react';

import { TASK_PRIORITY } from './constants';
import { STATUS } from './constants';
import { HABIT_TIMING } from './constants';
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
      dueDate: new Date(2026,9,20,23,59), //year, month, day, hour, minute
      priority: TASK_PRIORITY.HIGH,
    },

    {
      id: 2,
      title: 'Go to Pharmacy',
      category: 'Other',
      status: STATUS.INCOMPLETE,
      dueDate: new Date(2026,9,25,23,59), //year, month, day, hour, minute
      priority: TASK_PRIORITY.MEDIUM,
    },

    {
      id: 3,
      title: 'Make Social Media Posts',
      category: 'Work',
      status: STATUS.INCOMPLETE,
      dueDate: new Date(2026,9,31,23,59), //year, month, day, hour, minute
      priority: TASK_PRIORITY.LOW,
    },
  ]);

  const [habits, setHabits] = useState([
    {
      id: 1,
      title: 'Brush Teeth',
      timing: HABIT_TIMING.BIDAILY,
      status: STATUS.INCOMPLETE,
    },

    {
      id: 2,
      title: 'Take Pills',
      timing: HABIT_TIMING.BIDAILY,
      status: STATUS.INCOMPLETE,
    },
    {
      id: 3,
      title: 'Refill pillcase',
      timing: HABIT_TIMING.BIDAILY,
      status: STATUS.INCOMPLETE,
    },
  ]);

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
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.details}>
              <Text style={styles.taskTitle}>{item.title}</Text>

              <View style={styles.holder}>

              </View>
            </View>

            <Pressable style={styles.statusButton}/>
          </View>
        )}
      />
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
    // borderBottomColor: "grey",
    // borderBottomWidth: 1,
    alignItems: 'center'
  },

  progressContainer: {
    padding: 5,
  },

  progressBarBackground: {
    backgroundColor: '#a5a3a3',
    width: 300,
    height: 50,
    alignSelf: 'center',
    borderRadius: 50,
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#3863ff',
    borderRadius: 50,
  },

  progressCount: {

  },
});
