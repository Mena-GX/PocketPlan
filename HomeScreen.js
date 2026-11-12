import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import { Ionicons } from '@expo/vector-icons';

import { getDailyData } from '.src/repositories/dailyRepository';
import { updateTaskStatus } from './src/repositories/taskRepository'
import { updateOccurrenceStatus } from './src/repositories/occurrenceRepository';

//format a date object as yyyy-mm-dd
function formatDate(date){
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

//convert yyyy-mm-dd into a date object using local time
function parseDate(dateString){
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

//display the selected date in a readable format
function formatDisplayDate(dateString){
  const date = parseDate(dateString);

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}


function formatShortDate(dateString){
  const date = parseDate(dateString);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}



export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(
    formatDate(new Date())
  );

  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //retrieve the tasks, habits, and progress for the selected date
  const loadDailyData = useCallback(async () => {
    try{
      setLoading(true);
      setError(null);

      const data = await getDailyData(selectedDate);

      setDailyData(data);
    } catch (error) {
      console.error('Error loading daily data:', error);
      setError('Unable to load your daily activities.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  
  useEffect(() => {
    loadDailyData();
  }, [loadDailyData]);

  //move to the previous or next day
  function changeDate(numberOfDays){
    const date = parseDate(selectedDate);
    date.setDate(date.getDate() + numberOfDays);

    setSelectedDate(formatDate(date));
  }

  //return to today's date
  function goToToday() {
    setSelectedDate(formatDate(new Date()));
  }

  async function handleTaskToggle(task) {
    try {
      const newStatus =
        task.status === 'complete'
          ? 'incomplete'
          : 'complete';

      await updateTaskStatus(task.id, newStatus);
          
      await loadDailyData();
    } catch (error){
      console.error('Error updating task:', error);
      setError('Unable to update this task.');
    }
  }

  async function handleHabitToggle(habit){
    try {
      const newStatus =
        habit.status === 'complete'
          ? 'incomplete'
          : 'complete';

      await updateOccurrenceStatus(habit.id, newStatus);

      await loadDailyData();
    } catch (error) {
      console.error('Error updating habit:', error);
      setError('Unable to update this habit.');
    }
  }

  if (loading && !dailyData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7664d8" />
        <Text style={styles.loadingText}>
          Loading your day...
        </Text>
      </View>
    );
  }

  if(error && !dailyData){
    return(
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadDailyData}
        >
          <Text style={styles.retryButtonText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  const progress = dailyData?.progress;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>
              PocketPlan
            </Text>
          </View>
        </View>

        <View style={styles.dateCard}>
          <View style={styles.dateNavigation}>
            <Pressable
              style={styles.dateArrow}
              onPress={() => changeDate(-1)}
            >
              <Ionicons
                name='arrorw-back'
                size={24}
                color="black"
              />
            </Pressable>

            <View style={styles.dateTextContainer}>
              <Text style={styles.dateText}>
                {formatDisplayDate(selectedDate)}
              </Text>
            </View>

            <Pressable>
              <Ionicons
                name='arrow-forward'
                size={24}
                color="black"
              />
            </Pressable>
          </View>

          <Pressable
            onPress={goToToday}
          >
            <Text style={styles.todayButton}>
              Go to today
            </Text>
          </Pressable>
        </View>

        
      </ScrollView>
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
});
