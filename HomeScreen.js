import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import { Ionicons } from '@expo/vector-icons';

import { getDailyData } from './src/repositories/dailyRepository';
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

        {/* App heading */}
        <View style={styles.header}>
            <Text style={styles.appName}>
              PocketPlan
            </Text>
        </View>

        {/* Date Navigation */}
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

            <Pressable
              style={styles.dateArrow}
              onPress={() => changeDate(-1)}
            >
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

        {/* Daily Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>
            Your daily progress
          </Text>

          <View style={styles.progressHeader}>  
            <Text style={styles.progressPercentage}>
              {progress?.percentage ?? 0}%
            </Text>

            <Text style={styles.progressDescription}>
              {progress?.completed ?? 0} of {' '}
              {progress?.total ?? 0} activities completed
            </Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress?.percentage ?? 0}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressFooter}>
              <Text style={styles.progressSmallText}>
                {progress?.completed ?? 0} completed
              </Text>

              <Text style={styles.progressSmallText}>
                {progress?.remaining ?? 0} remaining
              </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Tasks
            </Text>

            <Text style={styles.sectionCount}>
              {dailyData?.taskProgress?.completed ?? 0}/
              {dailyData?.taskProgress?.total ?? 0}
            </Text>
          </View>

          {dailyData?.tasks?.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                No tasks scheduled!
              </Text>

              <Text style={styles.emptyDescription}>
                Enjoy some free time or add something
                to your day.
              </Text>
            </View>
          ) : (
            dailyData.tasks.map((task) => (
              <View
                key={task.id}
                style={styles.activityCard}
              >
                <Pressable
                  style={[
                    styles.checkbox,
                    task.status === 'complete' &&
                      styles.checkboxComplete,
                  ]}
                  onPress={() => handleTaskToggle(task)}
                >
                  {task.status === 'comnplete' && (
                    <Text style={styles.checkmark}>
                      ✓
                    </Text>
                  )}
                </Pressable>

                <View style={styles.activityInfo}>
                  <Text
                    style={[
                      styles.activityTitle,
                      task.status === 'complete' &&
                        styles.completedTitle
                    ]}
                  >
                    {task.title}
                  </Text>

                  <View>
                    
                  </View>
                </View>
              </View>
            ))
          )}
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
