export const TASK_PRIORITY = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
};

export const PRIORITY_COLORS = {
    [TASK_PRIORITY.HIGH]: "#ff7070",
    [TASK_PRIORITY.MEDIUM]: "#faeca5",
    [TASK_PRIORITY.LOW]: "#70ffa0"
};

export const STATUS = {
    INCOMPLETE: 'incomplete',
    IN_PROGRESS: 'in progress',
    COMPLETE: 'complete',
    MISSED: 'missed',
};

export const STATUS_COLORS = {
    [STATUS.INCOMPLETE]: "#a8a8a8",
    [STATUS.IN_PROGRESS]: "#4589ff",
    [STATUS.COMPLETE]: "#70ffa0",
    [STATUS.MISSED]: "#ff7070",
};

export const HABIT_TIMING = {
    DAILY: 'daily',
    BIDAILY: 'bidaily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
};

// export const DEFAULT_CATEGORIES = [
//     {
//         id: 'work',
//         name: 'Work',
//     },
//     {
//         id: 'school',
//         name: 'School'
//     },
//     {
//         id: 'other',
//         name: 'Other',
//     },
// ];