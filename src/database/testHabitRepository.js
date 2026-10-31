
import {
  createHabit,
  getHabitById,
  getAllHabits,
  updateHabit,
  getHabitOccurrences,
  deleteHabit,
} from '../repositories/habitRepository';

export async function testHabitRepository() {
  console.log('Starting habit repository test...');

  // 1. Create a daily habit.
  const created = await createHabit({
    title: 'Test Daily Habit',
    description: 'Testing habit persistence',
    frequency: 'daily',
    start_date: '2026-10-27',
    scheduled_time_1: '09:00',
    scheduled_time_2: null,
    category_id: null,
  });

  console.log('1. Created habit:', created.id);

  if (!created.id) {
    throw new Error('Habit creation did not return an ID.');
  }

  // 2. Retrieve the habit.
  const found = await getHabitById(created.id);

  if (!found || found.title !== 'Test Daily Habit') {
    throw new Error('Could not retrieve the created habit.');
  }

  console.log('2. Retrieved habit:', found.title);

  // 3. Update its settings.
  const updated = await updateHabit(
    created.id,
    {
      title: 'Updated Daily Habit',
      description: 'Updated description',
      frequency: 'daily',
      start_date: '2026-10-27',
      scheduled_time_1: '10:00',
      scheduled_time_2: null,
      category_id: null,
    }
  );

  if (updated.title !== 'Updated Daily Habit') {
    throw new Error('Habit update failed.');
  }

  console.log('3. Updated habit:', updated.title);

  // 4. Confirm occurrence retrieval works.
  const occurrences = await getHabitOccurrences(created.id);

  if (!Array.isArray(occurrences)) {
    throw new Error('Habit occurrences were not returned as an array.');
  }

  console.log('4. Retrieved occurrences:', occurrences.length);

  // 5. Confirm the habit appears in the full list.
  const habits = await getAllHabits();

  if (!habits.some((habit) => habit.id === created.id)) {
    throw new Error('Created habit was not found in the habit list.');
  }

  console.log('5. Retrieved all habits. Total:', habits.length);

  // 6. Delete the temporary habit.
  await deleteHabit(created.id);

  const deleted = await getHabitById(created.id);

  if (deleted !== null) {
    throw new Error('Habit was not deleted.');
  }

  console.log('6. Habit deleted successfully.');

  // 7. Confirm invalid titles are rejected.
  let invalidHabitRejected = false;

  try {
    await createHabit({
      title: ' ',
      frequency: 'daily',
      start_date: '2026-10-27',
    });
  } catch (error) {
    invalidHabitRejected = true;
    console.log('7. Empty habit title correctly rejected.');
  }

  if (!invalidHabitRejected) {
    throw new Error('An empty habit title was incorrectly accepted.');
  }

  console.log('Habit repository test completed!');
}