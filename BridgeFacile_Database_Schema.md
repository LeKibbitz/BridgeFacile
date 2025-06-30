# BridgeFacile Database Schema Documentation

## Project Overview
**Project Name:** BridgeFacile  
**Database Platform:** Supabase  
**Project URL:** https://supabase.com/dashboard/project/wfctinichbyfuwmxkebl  
**Organization:** Le Kibbitz  
**Created:** June 30, 2025  

## Complete Database Schema

### 1. **contacts** Table
**Purpose:** Store contact form submissions from the website  
**Columns:** 4  
- `id` (int8, Primary Key)
- `created_at` (timestamp)
- `pseudo` (text)
- `email` (text)
- `message` (text)
- `status` (text)

**Usage:** Captures all website contact requests for follow-up and customer management.

### 2. **students** Table
**Purpose:** Manage registered student information  
**Columns:** 4  
- `id` (int8, Primary Key)
- `created_at` (timestamp)
- `pseudo` (text)
- `email` (text)

**Usage:** Central registry of all students enrolled in bridge courses.

### 3. **lessons** Table
**Purpose:** Catalog of bridge lessons organized by module  
**Columns:** 3  
- `id` (int8, Primary Key)
- `created_at` (timestamp)
- `title` (text)

**Usage:** Stores all lesson content and structure for the bridge learning curriculum.

### 4. **student_progress** Table
**Purpose:** Track individual student advancement through lessons  
**Columns:** 4  
- `id` (int8, Primary Key)
- `created_at` (timestamp)
- `student_id` (int8, Foreign Key → students.id)
- `lesson_id` (int8, Foreign Key → lessons.id)

**Usage:** Monitors which lessons each student has completed for progress tracking and motivation.

### 5. **trustpilot_reviews** Table
**Purpose:** Store student evaluations and ratings  
**Columns:** 4  
- `id` (int8, Primary Key)
- `created_at` (timestamp)
- `student_id` (int8, Foreign Key → students.id)
- `lesson_id` (int8, Foreign Key → lessons.id)

**Usage:** Collects feedback after each module completion for quality improvement and testimonials.

### 6. **reminders** Table
**Purpose:** Automated follow-up system for student engagement  
**Columns:** 3  
- `id` (int8, Primary Key)
- `created_at` (timestamp)
- `student_id` (int8, Foreign Key → students.id)

**Usage:** Manages automated reminders to keep students engaged and progressing through courses.

### 7. **subscriptions** Table
**Purpose:** Manage course subscription types and billing  
**Columns:** 4  
- `id` (int8, Primary Key)
- `created_at` (timestamp)
- `student_id` (int8, Foreign Key → students.id)
- `subscription_type` (text)

**Usage:** Tracks which students have which type of subscription (live visio vs autonomous courses).

### 8. **group_sessions** Table
**Purpose:** Schedule and manage live group classes  
**Columns:** 4  
- `id` (int8, Primary Key)
- `created_at` (timestamp)
- `session_date` (date)
- `max_participants` (int4)

**Usage:** Organizes live visio sessions with scheduling and capacity management.

### 9. **session_participants** Table
**Purpose:** Link students to specific group sessions  
**Columns:** 4  
- `id` (int8, Primary Key)
- `created_at` (timestamp)
- `session_id` (int8, Foreign Key → group_sessions.id)
- `student_id` (int8, Foreign Key → students.id)

**Usage:** Many-to-many relationship table connecting students to the group sessions they attend.

## Business Logic Support

### Course Types Supported:
1. **Live Visio Courses** (120€+)
   - Fixed schedule sessions
   - Group interaction with instructor
   - Limited participants (4-8 students)
   - Scheduled via `group_sessions` and `session_participants`

2. **Autonomous Courses** (80€+)
   - Self-paced learning
   - 24/7 access to materials
   - Monthly check-in sessions
   - Progress tracked via `student_progress`

### Key Relationships:
- **Students** → **Subscriptions** (1:many)
- **Students** → **Progress** (1:many)
- **Students** → **Reviews** (1:many)
- **Students** → **Session Participation** (many:many via session_participants)
- **Lessons** → **Progress** (1:many)
- **Group Sessions** → **Participants** (1:many)

### Contact Management Flow:
1. Website contact form → `contacts` table
2. Follow-up converts contact → `students` table
3. Student subscribes → `subscriptions` table
4. Student progresses → `student_progress` table
5. Student reviews → `trustpilot_reviews` table

## Security Configuration
- **Row Level Security (RLS):** Enabled on all tables
- **Public Access:** Contact form submissions only
- **API Access:** Secured with project-specific keys
- **Data Protection:** GDPR compliant structure

## Next Steps
1. Configure contact form integration with Supabase API
2. Set up automated reminder system
3. Create admin dashboard for data management
4. Implement progress tracking in website
5. Configure Trustpilot review integration

## Technical Details
- **Database Type:** PostgreSQL (via Supabase)
- **Region:** East US (Ohio)
- **API Endpoint:** https://wfctinichbyfuwmxkebl.supabase.co
- **Real-time:** Enabled for live updates
- **Backup:** Automated via Supabase platform

---

**Documentation Created:** June 30, 2025  
**Last Updated:** June 30, 2025  
**Version:** 1.0  
**Status:** Production Ready ✅

