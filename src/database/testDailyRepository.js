import {
  createTask,
  deleteTask,
} from '../repositories/taskRepository';

import {
  createHabit,
  deleteHabit,
} from '../repositories/habitRepository';

import {
  getDailyData,
  getDailyTasks,
  getDailyHabits,
} from '../repositories/dailyRepository';

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function testDailyRepository() {
  console.log('Starting daily repository tests...');

  const today = formatDate(new Date());

  let createdTask;
  let createdHabit;

  try {
    // TEST 1: Create a task due today.
    createdTask = await createTask({
      title: 'Test Daily Task',
      description: 'Testing the daily repository',
      due_date: today,
      due_time: '10:00',
      priority: 'high',
      status: 'incomplete',
      category_id: null,
    });

    console.log('Test 1 passed: Task created.');

    // TEST 2: Create a daily habit.
    createdHabit = await createHabit({
      title: 'Test Daily Habit',
      description: 'Testing daily habit retrieval',
      frequency: 'daily',
      start_date: today,
      scheduled_time_1: '09:00',
      scheduled_time_2: null,
      category_id: null,
    });

    console.log('Test 2 passed: Habit created.');

    // TEST 3: Retrieve daily tasks.
    const tasks = await getDailyTasks(today);

    const foundTask = tasks.find(
      (task) => task.id === createdTask.id
    );

    if (!foundTask) {
      throw new Error('Created task was not retrieved.');
    }

    console.log('Test 3 passed: Daily tasks retrieved.');

    // TEST 4: Retrieve daily habits.
    // This test also requires the occurrence to exist.
    const dailyData = await getDailyData(today);

    const foundHabit = dailyData.habits.find(
      (habit) => habit.habit_id === createdHabit.id
    );

    if (!foundHabit) {
      throw new Error('Created habit was not retrieved.');
    }

    console.log('Test 4 passed: Daily habits retrieved.');

    // TEST 5: Verify combined daily data.
    if (dailyData.tasks.length < 1) {
      throw new Error('Daily data did not include tasks.');
    }

    if (dailyData.habits.length < 1) {
      throw new Error('Daily data did not include habits.');
    }

    if (dailyData.progress.total !==
        dailyData.tasks.length + dailyData.habits.length) {
      throw new Error('Daily progress total is incorrect.');
    }

    console.log('Test 5 passed: Combined daily data retrieved.');

    // TEST 6: Verify initial progress.
    const expectedTotal =
      dailyData.tasks.length + dailyData.habits.length;

    if (dailyData.progress.total !== expectedTotal) {
      throw new Error('Progress total does not match activities.');
    }

    console.log('Test 6 passed: Daily progress calculated.');

    console.log('All daily repository tests passed!');
  } finally {
    // Clean up test records.
    if (createdTask) {
      await deleteTask(createdTask.id);
    }

    if (createdHabit) {
      await deleteHabit(createdHabit.id);
    }
  }
}