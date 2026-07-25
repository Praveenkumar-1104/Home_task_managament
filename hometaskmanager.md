# Home Task Manager (Asana-Style)

## Project Overview

Home Task Manager is a collaborative task management application
inspired by Asana/Trello, designed for families, roommates, or small
teams.

The goal is to provide a shared workspace where members can: - Create
multiple boards - Assign tasks - Track progress - View completed work -
Automatically rotate recurring chores - Monitor who is responsible for
the next task

This project uses **Next.js** as the frontend and **Supabase** as the
backend service (database + realtime). No custom backend server is
required.

------------------------------------------------------------------------

# Technology Stack

  Layer             Technology
  ----------------- -------------------------------
  Frontend          Next.js 15 (App Router)
  Language          TypeScript
  Styling           Bootstrap 5 (or Tailwind CSS)
  Icons             Lucide React
  State             React Context + React Hooks
  Forms             React Hook Form
  Database          Supabase
  Authentication    Supabase Auth (optional)
  Deployment        Vercel
  Version Control   GitHub

------------------------------------------------------------------------

# Core Modules

## Dashboard

Displays: - Total Boards - Total Tasks - Pending Tasks - Completed
Tasks - Overdue Tasks - Today's Assignments - Recently Completed Tasks

------------------------------------------------------------------------

## Boards

Examples: - Kitchen - Cleaning - Garden - Shopping - Maintenance -
Office - Personal

Each board contains many tasks.

------------------------------------------------------------------------

## Tasks

Each task includes:

-   Title
-   Description
-   Priority
-   Due Date
-   Assigned Member
-   Next Member
-   Status
-   Labels
-   Attachments (future)
-   Comments (future)

Statuses: - Todo - In Progress - Completed

------------------------------------------------------------------------

## Members

Store:

-   Name
-   Avatar
-   Email (optional)
-   Color
-   Active Status

Features: - Add Member - Edit Member - Remove Member - View Assigned
Tasks - View Completed Tasks

------------------------------------------------------------------------

## Task Assignment

Manual Assignment

Example

Wash Dishes → Ravi

Automatic Rotation

Members

1.  Ravi
2.  Siva
3.  Arun
4.  Kumar

When Ravi completes:

Next Assignment

Siva

Then

Arun

Then

Kumar

Then

Ravi

------------------------------------------------------------------------

## Activity History

Every action is recorded.

Example

09:00 AM Task Created

09:15 AM Assigned to Ravi

10:30 AM Marked Completed

10:31 AM Assigned to Siva

------------------------------------------------------------------------

# Suggested Database Tables (Supabase)

## boards

-   id
-   name
-   color
-   created_at

## members

-   id
-   name
-   avatar
-   email
-   created_at

## tasks

-   id
-   board_id
-   title
-   description
-   assigned_to
-   next_member
-   priority
-   due_date
-   status
-   created_at

## task_history

-   id
-   task_id
-   action
-   member_id
-   timestamp

------------------------------------------------------------------------

# Folder Structure

``` text
app/
 ├── dashboard/
 ├── boards/
 │    ├── page.tsx
 │    └── [id]/page.tsx
 ├── members/
 ├── history/
 ├── settings/
 ├── layout.tsx
 └── page.tsx

components/
 ├── board/
 ├── task/
 ├── member/
 ├── dashboard/
 └── common/

context/
hooks/
lib/
types/
```

------------------------------------------------------------------------

# UI Layout

``` text
----------------------------------------------------------
 Sidebar        |              Dashboard
----------------------------------------------------------
 Dashboard      | Stats
 Boards         | Recent Tasks
 Members        | Upcoming Tasks
 History        | Activity
 Settings       |
----------------------------------------------------------
```

## Board Screen

``` text
--------------------------------------------------------
 Kitchen Board

 + New Task

 ------------------------------------------------------

 Todo

 [ Wash Plates ]

 [ Buy Vegetables ]

 ---------------------

 In Progress

 [ Clean Stove ]

 ---------------------

 Completed

 [ Mop Floor ]

--------------------------------------------------------
```

------------------------------------------------------------------------

# Features

## MVP

-   Create Board
-   Edit Board
-   Delete Board
-   Create Task
-   Edit Task
-   Delete Task
-   Assign Member
-   Change Status
-   Mark Complete
-   Dashboard
-   Search
-   Filter

## Advanced

-   Drag & Drop
-   Recurring Tasks
-   Auto Rotation
-   Dark Mode
-   Mobile Responsive
-   Realtime Sync
-   Notifications
-   Task Statistics
-   Export CSV
-   PWA

------------------------------------------------------------------------

# Design Inspiration

-   Asana
-   Trello
-   ClickUp
-   Jira (simplified)

------------------------------------------------------------------------

# Deployment

1.  Create Supabase project
2.  Create database tables
3.  Add NEXT_PUBLIC_SUPABASE_URL
4.  Add NEXT_PUBLIC_SUPABASE_ANON_KEY
5.  Push to GitHub
6.  Import repository into Vercel
7.  Deploy

------------------------------------------------------------------------

# Future Roadmap

Phase 1 - Boards - Members - Tasks

Phase 2 - Recurring chores - Automatic next-member assignment - Activity
timeline

Phase 3 - Comments - File uploads - Notifications - Calendar - Analytics

------------------------------------------------------------------------

# Goal

Build a clean, modern, collaborative task management application for
households and small teams that feels similar to Asana while remaining
lightweight, free to host, and easy to maintain.
