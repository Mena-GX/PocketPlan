# PocketPlan

**A personal productivity app for organizing tasks, building habits, and tracking progress.**

PocketPlan is a mobile task and habit management application designed to help users stay organized, establish consistent routines, and make progress toward their personal goals.

Combining daily planning, task management, recurring habit tracking, and progress statistics in one place, PocketPlan aims to make productivity feel approachable, motivating, and rewarding.

The application features a clean, colorful, and intuitive interface that encourages progress rather than perfection.

> **Project Status:** In Development

---

## Features

### Task Management
- Create, edit, delete, and manage tasks.
- Assign priority levels: High, Medium, and Low.
- Set optional due dates and due times.
- Organize tasks using customizable categories.
- Track task statuses:
  - Incomplete
  - In Progress
  - Complete
  - Missed
- Search, filter, and organize tasks by category, priority, and date.

### Habit Tracking
- Create and manage recurring habits.
- Configure multiple recurrence schedules:
  - Daily
  - Twice Daily
  - Selected Days of the Week
  - Monthly
- Track individual habit occurrences.
- View historical completion records.
- Monitor current and longest completion streaks.
- Preserve historical tracking data when modifying habit schedules.

### Daily Overview
- View daily tasks and scheduled habits in one place.
- Navigate between previous and upcoming dates.
- Monitor daily task completion through a progress bar.
- Quickly update task and habit statuses.
- View relevant deadlines, priorities, and scheduling information.

### Custom Categories
- Create and manage personalized categories.
- Assign categories to tasks and habits.
- Filter tasks based on selected categories.
- Organize responsibilities according to individual preferences.

### Progress Statistics
- View habit completion percentages.
- Monitor current and longest streaks.
- Track total completed and scheduled occurrences.
- Review historical completion trends.
- Visualize daily, weekly, and monthly progress.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| JavaScript | Primary programming language |
| React Native | Cross-platform mobile development |
| Expo | Development environment and application tooling |
| React Navigation | Screen navigation and bottom-tab navigation |
| Expo SQLite | Local database and persistent storage |
| React Native Components | User interface development |
| @expo/vector-icons | Application icons |
| React State & Hooks | UI state management |
| Jest | Unit testing |
| React Native Testing Library | Component testing |

---

## Application Architecture

PocketPlan follows a modular, client-side architecture that separates the user interface, application logic, and data access.

The initial release uses a local-first approach, storing application data directly on the device through Expo SQLite.

**Architecture Layers**

1. **Presentation Layer**
   - Application screens and reusable UI components.
   - User interactions and navigation.
   - Forms, task cards, habit cards, and progress indicators.

2. **Application Logic Layer**
   - Task and habit management.
   - Habit recurrence and scheduling.
   - Task filtering and status management.
   - Daily progress and statistics calculations.
   - Input validation and application business rules.

3. **Data Access Layer**
   - Centralized database operations.
   - Creating, retrieving, updating, and deleting records.
   - Database queries and error handling.
   - Data validation and transaction management.

4. **Persistence Layer**
   - Expo SQLite database.
   - Local storage of tasks, habits, categories, and historical habit occurrences.
   - Database initialization and versioned migrations.

This separation allows the application to remain maintainable while supporting potential backend integration in future releases.

---

## Database Structure

PocketPlan uses SQLite to maintain structured application data across sessions.

The database consists of five primary tables:

| Table | Description |
|---|---|
| `tasks` | Stores individual tasks and their associated details. |
| `habits` | Stores habit definitions and recurrence settings. |
| `habit_occurrences` | Tracks the completion status of individual scheduled habit occurrences. |
| `categories` | Stores user-created categories. |
| `habit_schedule_days` | Defines the weekdays associated with weekly habits. |

**Key Database Considerations**
- Unique identifiers for database records.
- Foreign-key relationships to maintain data integrity.
- Historical habit records are preserved when recurrence settings change.
- Parameterized SQL queries for safer database operations.
- Database transactions for related operations.
- Versioned migrations to support future schema changes.

---

## Design Philosophy

PocketPlan is designed around five core principles:

- **Clean:** Organized layouts, readable typography, and minimal visual clutter.
- **Motivating:** Progress indicators and positive feedback that recognize accomplishments.
- **Fun:** Colorful accents, rounded components, and subtle animations.
- **Approachable:** Intuitive navigation and straightforward interactions.
- **Calm:** A balanced interface that encourages productivity without creating unnecessary pressure.

The visual design uses a light, neutral foundation with expressive accent colors:

| Color | Purpose |
|---|---|
| Soft Violet | Primary actions and progress highlights |
| Fresh Green | Completed tasks and habits |
| Peach | Secondary highlights and decorative accents |
| Muted Coral | Missed items and status indicators |
| White & Soft Gray | Backgrounds and content surfaces |
| Deep Charcoal | Primary text |

The overall design philosophy is simple: **Progress over perfection.**

---

## Navigation

PocketPlan uses a persistent bottom navigation bar with five primary destinations:

| Screen | Purpose |
|---|---|
| Home | Daily overview, tasks, habits, and progress |
| Tasks | Task management, search, and filtering |
| Create | Centralized task and habit creation |
| Habits | Recurring habit management and tracking |
| Statistics | Habit analytics and progress visualizations |

---

## Getting Started

Follow these instructions to set up PocketPlan locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Expo](https://expo.dev/)
- [Visual Studio Code](https://code.visualstudio.com/) or another preferred code editor.

For mobile development, you can also install [Expo Go](https://expo.dev/go) on your iOS or Android device.

### Installation

**1. Clone the repository**

```bash
git clone <repository-url>
```

**2. Navigate into the project directory**

```bash
cd PocketPlan
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the Expo development server**

```bash
npx expo start
```

**5. Run the application**

Once the Expo development server starts:

- Scan the QR code using Expo Go on your mobile device.
- Press `i` to open the iOS simulator (macOS with Xcode).
- Press `a` to open the Android emulator (with Android development tools configured).

*Note: Additional setup instructions may be added as the project structure and dependencies are finalized.*

---

## Project Scope

The initial release focuses on individual productivity and habit management.

**Included in the initial scope:**
- Task creation and management.
- Recurring habit creation and tracking.
- Custom categories.
- Daily task and habit views.
- Date navigation.
- Task filtering.
- Daily progress visualization.
- Historical habit tracking.
- Habit completion statistics.
- Local SQLite persistence.

**Outside the initial scope:**
- User authentication and accounts.
- Cloud database storage.
- Cross-device synchronization.
- Social sharing and collaboration.
- External calendar integrations.

---

## Future Enhancements

Potential improvements for future releases include:

- User accounts and authentication.
- Cloud storage and cross-device synchronization.
- Push notifications and task reminders.
- Calendar integrations.
- Mobile home screen widgets.
- Habit goals and customizable milestones.
- Advanced statistics and trend analysis.
- Data export and backup.
- Optional themes and additional interface customization.

These enhancements will be considered after the core application functionality is established.

---

## Development Roadmap

PocketPlan is being developed incrementally, with an emphasis on establishing a reliable foundation before expanding functionality.

- [ ] Establish Expo project structure and development environment.
- [ ] Implement bottom-tab navigation and screen layouts.
- [ ] Initialize SQLite database and define data models.
- [ ] Implement centralized database operations.
- [ ] Implement task creation, editing, deletion, and status management.
- [ ] Implement habit creation and recurrence scheduling.
- [ ] Implement habit occurrence tracking.
- [ ] Integrate daily views and date navigation.
- [ ] Implement custom category management and task filtering.
- [ ] Implement daily progress calculations.
- [ ] Develop habit statistics and visualizations.
- [ ] Implement automated tests and perform manual testing.
- [ ] Refine UI/UX and accessibility.

---

## Testing

Testing will focus on ensuring that application functionality, data persistence, and progress calculations remain reliable.

Planned testing includes:

- **Unit Testing:** Task status updates, habit recurrence, filtering, progress calculations, streaks, and input validation.
- **Component Testing:** Task and habit cards, navigation, forms, filters, and progress indicators.
- **Database Testing:** CRUD operations, data persistence, relationships, and historical record integrity.
- **Manual Testing:** iOS and Android compatibility, date boundaries, empty states, and application restarts.

---

## Privacy & Data Storage

PocketPlan's initial release uses local SQLite storage and does not require users to create accounts or connect to a remote backend.

Application data is stored locally on the device. The application is designed to minimize unnecessary collection of personal information.

Future cloud functionality will require appropriate authentication, authorization, secure data transmission, and database access controls.

---

## License

License information has not yet been established.

---

**PocketPlan — One step at a time.**
