export const SCHEMA_SQL = `
--1. CATEGORIES
-- Categories can be shared by tasks and habits

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

--  2. TASKS
-- Each task may optionally belong to one category

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    due_time TEXT,

    priority TEXT NOT NULL
        CHECK (priority IN ('high', 'medium', 'low')),

    status TEXT NOT NULL DEFAULT 'incomplete'
        CHECK (
            STATUS IN (
                'incomplete',
                'in_progress',
                'complete',
                'missed'
            )
        ),

    category_id TEXT,

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- 3. HABITS
--  Recurrence settings belong to the habit itself.
-- Individual completion records are stored separately

CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT,

    frequency TEXT NOT NULL
        CHECK (
            frequency IN (
                'daily',
                'twice_daily',
                'weekly',
                'monthly'
            )
        ),

    day_of_month INTEGER
        CHECK (
            day_of_month IS NULL
            OR day_of_month BETWEEN 1 AND 31
        ),
    
    scheduled_time_1 TEXT,
    scheduled_time_2 TEXT,

    start_date TEXT NOT NULL,
    end_date TEXT,

    is_active INTEGER NOT NULL DEFAULT 1
        CHECK (is_active IN (0,1)),

    category_id TEXT,

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- 4. HABIT OCCURENCES
-- Each row represets one scheduled instance of a habit

CREATE TABLE IF NOT EXISTS habit_occurrences (
    id TEXT PRIMARY KEY NOT NULL,
    habit_id TEXT NOT NULL,
    scheduled_date TEXT NOT NULL,

    occurrence_number INTEGER NOT NULL DEFAULT 1
        CHECK (occurrence_number in (1,2)),

    status TEXT NOT NULL DEFAULT 'incomplete'
        CHECK (
            status IN(
                'incomplete',
                'complete',
                'missed'
            )
        ),

    completed_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,

    FOREIGN KEY (habit_id)
        REFERENCES habits(id)
        ON DELETE CASCADE,

    UNIQUE (habit_id, scheduled_date, occurrence_number)
);

-- 5. HABIT SCHEDULE DAYS
-- weekdays use ISO numbering: monday = 1, Sunday = 7

CREATE TABLE IF NOT EXISTS habit_schedule_days (
    habit_id TEXT NOT NULL,

    weekday INTERGER NOT NULL
        CHECK (weekday BETWEEN 1 AND 2),

    PRIMARY KEY (habit_id, weekday),

    FOREIGN KEY (habit_id)
        REFERENCES habits(id)
        ON DELETE CASCADE
);

-- INDEXES
-- These help SQLite find commonly requested records faster

CREATE INDEX IF NOT EXISTS idx_tasks_due_date
    ON tasks(due_date);

CREATE INDEX IF NOT EXISTS idx_tasks_category
    ON tasks(category_id);

CREATE INDEX IF NOT EXISTS idx_habits_category
    ON habits(category_id);

CREATE INDEX IF NOT EXISTS idx_occurrences_date
    ON habit_occurrences(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_occurrences_habit_date
    ON habit_occurrences(habit_id, scheduled_date);
`;