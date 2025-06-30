# BridgeFacile - Bridge Learning Platform

A comprehensive bridge learning platform built with React and Supabase, offering both live video courses and autonomous learning paths.

## 🚀 Live Demo

**Production Website:** https://uvsgjklv.manus.space

## ✨ Features

### 🎓 Course Offerings
- **Live Visio Courses**: Interactive group sessions with real-time instruction (€120+)
- **Autonomous Courses**: Self-paced learning with monthly check-ins (€80+)

### 📋 Contact System
- Complete contact form with 6 fields:
  - First Name (Prénom)
  - Last Name (Nom)
  - Lucky Pseudonym (Votre pseudo le plus chanceux)
  - Email Address (Meilleure Adresse mail)
  - Postal Code (Code postal) - for finding nearby bridge clubs
  - Message (Message)

### 🗄️ Database Architecture
Complete 9-table Supabase schema:
- `contacts` - Contact form submissions
- `students` - Student management
- `lessons` - Course content organization
- `student_progress` - Progress tracking
- `subscriptions` - Subscription management
- `group_sessions` - Live session scheduling
- `session_participants` - Session enrollment
- `reminders` - Automated follow-ups
- `trustpilot_reviews` - Review integration

### 🎨 Design Features
- Responsive mobile-first design
- Professional green color scheme
- Modern card-based layouts
- Cross-browser compatibility
- Accessibility optimized

## 🛠️ Technical Stack

- **Frontend**: React 18+ with Vite
- **UI Components**: Custom components with Lucide icons
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + REST API)
- **Authentication**: Supabase Auth with RLS policies
- **Deployment**: Production-ready build system

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bridge-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure Supabase**
   - Update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `src/App.jsx`
   - Set up database schema using provided SQL files

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🗄️ Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Run the SQL commands to create all 9 tables
3. Configure Row Level Security policies:

```sql
-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous contact form submissions
CREATE POLICY "Allow anonymous inserts for contacts" ON public.contacts
AS PERMISSIVE
FOR INSERT
TO anon
WITH CHECK (true);
```

### Required Tables

All tables are automatically created with proper relationships and constraints. See the database schema documentation for complete details.

## 🔐 Security

- Row Level Security (RLS) enabled
- Anonymous contact form submissions allowed
- Secure API key configuration
- Input validation and sanitization
- CORS-enabled for cross-origin requests

## 📱 Responsive Design

The platform is fully responsive and tested on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile devices (iOS Safari, Android Chrome)
- Tablet devices (iPad, Android tablets)

## 🎯 Business Features

### Course Management
- Dual course model (Live/Autonomous)
- Flexible pricing structure
- Progress tracking system
- Student engagement tools

### Student Acquisition
- Professional contact form
- Automatic database integration
- Postal code for local club recommendations
- Follow-up system foundation

### Review System
- Trustpilot integration
- Automated review requests
- Reputation management tools

## 📊 Analytics Ready

The platform includes comprehensive data collection for:
- Student engagement metrics
- Course completion rates
- Contact form conversion tracking
- Progress analytics
- Business intelligence reporting

## 🚀 Deployment

### Production Deployment
The site is deployed and accessible at: https://uvsgjklv.manus.space

### Custom Domain Setup
To deploy to your own domain:
1. Build the project: `npm run build`
2. Upload the `dist/` folder to your hosting provider
3. Configure DNS settings to point to your hosting provider

## 📞 Contact Information

- **Email**: thomas.joannes@bridgefacile.fr
- **Phone**: +33 6 58 51 58 34
- **WhatsApp/SMS**: Available

## 🤝 Contributing

This project is ready for production use. For modifications or enhancements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for BridgeFacile. All rights reserved.

## 🎉 Acknowledgments

- Built with modern React best practices
- Powered by Supabase for reliable backend services
- Designed with user experience as the top priority
- Optimized for performance and accessibility

---

**BridgeFacile** - Making bridge learning accessible and enjoyable for everyone! 🃏
