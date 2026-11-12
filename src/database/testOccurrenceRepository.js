import { createHabit, deleteHabit } from '../repositories/habitRepository';

import {
  generateHabitOccurrences,
  getHabitOccurrencesForDate,
  updateOccurrenceStatus,
} from '../repositories/occurrenceRepository';

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function testOccurrenceRepository() {
  console.log('Starting occurrence repository tests...');

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  const todayString = formatDate(today);
  const endDate = formatDate(dayAfterTomorrow);

  let createdHabit;

  try {
    // TEST 1: Create a habit.
    createdHabit = await createHabit({
      title: 'Test Daily Habit',
      description: 'Testing occurrence generation',
      frequency: 'daily',
      start_date: todayString,
      scheduled_time_1: '09:00',
      scheduled_time_2: null,
      category_id: null,
    });

    console.log('Test 1 passed: Habit created.');

    // TEST 2: Generate occurrences for three days.
    const inserted = await generateHabitOccurrences(
      createdHabit.id,
      todayString,
      endDate
    );

    if (inserted !== 3) {
      throw new Error(
        `Expected 3 occurrences, received ${inserted}.`
      );
    }

    console.log('Test 2 passed: Three occurrences generated.');

    // TEST 3: Generate the same dates again.
    const duplicateInsertions = await generateHabitOccurrences(
      createdHabit.id,
      todayString,
      endDate
    );

    if (duplicateInsertions !== 0) {
      throw new Error(
        'Duplicate occurrences were unexpectedly created.'
      );
    }

    console.log('Test 3 passed: Duplicate generation prevented.');

    // TEST 4: Retrieve today's occurrences.
    const todaysOccurrences =
      await getHabitOccurrencesForDate(todayString);

    const todaysHabitOccurrences = todaysOccurrences.filter(
      (occurrence) => occurrence.habit_id === createdHabit.id
    );

    if (todaysHabitOccurrences.length !== 1) {
      throw new Error(
        'Expected one occurrence for today.'
      );
    }

    console.log('Test 4 passed: Today\'s occurrence retrieved.');

    // TEST 5: Mark today's occurrence complete.
    const completed = await updateOccurrenceStatus(
      todaysHabitOccurrences[0].id,
      'complete'
    );

    if (completed.status !== 'complete') {
      throw new Error('Occurrence was not marked complete.');
    }

    if (!completed.completed_at) {
      throw new Error('Completion timestamp was not saved.');
    }

    console.log('Test 5 passed: Occurrence marked complete.');

    // TEST 6: Generate again without resetting completion.
    await generateHabitOccurrences(
      createdHabit.id,
      todayString,
      endDate
    );

    const occurrencesAfterRegeneration =
      await getHabitOccurrencesForDate(todayString);

    const preservedOccurrence = occurrencesAfterRegeneration.find(
      (occurrence) => occurrence.id === completed.id
    );

    if (!preservedOccurrence ||
        preservedOccurrence.status !== 'complete') {
      throw new Error(
        'Completed occurrence was not preserved.'
      );
    }

    console.log('Test 6 passed: Completion history preserved.');

    console.log('All occurrence repository tests passed!');
  } finally {
    // Clean up the test habit and its occurrences.
    if (createdHabit) {
      await deleteHabit(createdHabit.id);
    }
  }
}