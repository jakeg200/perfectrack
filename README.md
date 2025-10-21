# PerfTrack - Employee Performance Gamification MVP

A modern, frontend-only demo MVP for an employee performance tracking and gamification platform. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

### Core Functionality
- **Performance Tracking**: Log achievements and track KPIs (tasks, sales, attendance, peer kudos, innovation, customer satisfaction)
- **Gamification System**: Points, levels (Bronze → Silver → Gold → Platinum → Diamond), and 8 achievement badges
- **Leaderboard**: Company-wide and department-specific rankings
- **Rewards Catalog**: Redeem points for rewards (time off, perks, swag, experiences)
- **Activity Feed**: Real-time style updates of achievements across the company
- **Role-Based Access**: Employee, Manager, and Admin dashboards

### Demo Features
- Mock authentication (no passwords required)
- 18 realistic employee profiles with generated data
- localStorage persistence (data survives page refreshes)
- Test/demo page for experimentation
- Responsive design (mobile, tablet, desktop)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

```bash
# Navigate to the project directory
cd /tmp/performance-gamification-mvp

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Login

1. You'll see the login page with 3 quick-select personas:
   - **Sarah Johnson** (Employee) - Engineering
   - **Mike Wilson** (Manager) - Sales
   - **Alex Martinez** (Admin) - HR

2. Click on any persona or select from the dropdown
3. Explore the platform!

## 📁 Project Structure

```
/app
  /page.tsx                 # Landing/login page
  /dashboard/page.tsx       # Employee dashboard
  /leaderboard/page.tsx     # Company leaderboard
  /rewards/page.tsx         # Rewards catalog
  /manager/page.tsx         # Manager team view
  /admin/page.tsx           # Admin configuration
  /test/demo/page.tsx       # Test & simulation page
  /layout.tsx               # Root layout
  /globals.css              # Global styles

/components
  /ui/                      # Reusable UI components (shadcn-style)
  /dashboard/               # Dashboard-specific components
  /performance/             # Performance tracking components
  /gamification/            # Badges, levels, animations
  /leaderboard/             # Leaderboard table
  /rewards/                 # Reward cards and modals
  /nav-bar.tsx              # Navigation bar
  /activity-feed.tsx        # Activity feed

/lib
  /mock-data.ts             # Mock data generator (15-20 employees)
  /points-engine.ts         # Points, levels, badge calculation
  /storage.ts               # localStorage utilities
  /constants.ts             # Badges, rewards, KPI configs
  /utils.ts                 # Helper functions

/types
  /index.ts                 # TypeScript type definitions
```

## 🎮 How to Use

### As an Employee
1. **Dashboard**: View your points, level, badges, and recent achievements
2. **Log Achievement**: Click "Log Achievement" to record new accomplishments
3. **Leaderboard**: See how you rank against colleagues
4. **Rewards**: Browse and redeem rewards with your points
5. **Profile**: Track your progress and badge collection

### As a Manager
1. **Team Dashboard**: View team performance overview
2. **Top Performers**: See team leaderboard
3. **Recent Activity**: Monitor team achievements
4. **Team Roster**: Full team member details

### As an Admin
1. **System Stats**: Company-wide analytics
2. **Points Configuration**: Adjust point values for each KPI type
3. **Badge Distribution**: See which badges are most earned
4. **Department Breakdown**: Analyze performance by department
5. **Reset Data**: Clear and reseed all data

## 🧪 Test Page

Visit `/test/demo` to:
- View current user state (points, level, badges)
- Simulate adding points (+10, +50, +100, +500)
- Generate 5 random achievements
- Reset to initial data
- Clear all localStorage

## 🎯 KPI Types & Points

Default point values (configurable by admins):

| KPI Type | Points | Description |
|----------|--------|-------------|
| Task Completed | 10 | General task completion |
| Sales Win | 50 | Closed deal |
| Attendance | 5 | Perfect attendance |
| Peer Kudos | 15 | Recognition from colleagues |
| Innovation | 30 | Innovative idea submission |
| Customer Satisfaction | 20 | High customer rating |

## 🏆 Levels & Thresholds

| Level | Points Required | Color |
|-------|----------------|-------|
| Bronze | 0 - 99 | Bronze |
| Silver | 100 - 249 | Silver |
| Gold | 250 - 499 | Gold |
| Platinum | 500 - 999 | Platinum |
| Diamond | 1000+ | Diamond |

## 🎖️ Badges

8 achievement badges with varying rarity:

- **First Week Hero** (Common) - Complete 5 tasks in first week
- **Team Player** (Common) - Receive 10 peer kudos
- **Sales Champion** (Rare) - Close 20 sales deals
- **Perfect Attendance** (Rare) - 30 consecutive days of attendance
- **Innovation Award** (Epic) - Submit 5 innovative ideas
- **Customer Star** (Epic) - 15 exceptional customer ratings
- **Speedster** (Legendary) - Complete 50 tasks
- **Mentor** (Legendary) - Help onboard 5 new team members

## 🎁 Sample Rewards

- Extra PTO Day (500 pts)
- $50 Gift Card (300 pts)
- Premium Parking (200 pts)
- Coffee with CEO (400 pts)
- Premium Swag Bundle (150 pts)
- Work From Home Day (100 pts)
- And more!

## 🔧 Technical Details

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom shadcn/ui-style components
- **Animations**: Framer Motion & canvas-confetti
- **Charts**: Recharts (ready for integration)
- **Storage**: localStorage (no backend required)

### Key Features
- Fully client-side rendering
- No authentication required (mock login)
- Persistent data between sessions
- Automatic level-up detection
- Real-time badge eligibility checking
- Responsive design
- Role-based navigation

## 📝 Data Model

All data stored in localStorage:

- **Users**: Employee profiles with points, levels, badges
- **Achievements**: Logged KPIs with timestamps
- **Redemptions**: Reward redemption history
- **Activity Feed**: Recent platform activities
- **Points Config**: Customizable point values

## 🎨 Design Principles

- **Modern & Vibrant**: Gradients, shadows, smooth animations
- **Gamified UX**: Celebrate achievements with visual feedback
- **Data Visualization**: Progress bars, charts, stats cards
- **Responsive**: Works on all screen sizes
- **Accessible**: Clear typography, good contrast

## 🚧 Future Enhancements

Ideas for expanding beyond MVP:

1. **Backend Integration**: Replace localStorage with real database
2. **Time-Based Filtering**: Weekly/monthly leaderboards
3. **Team Challenges**: Collaborative goals and competitions
4. **Push Notifications**: Real-time alerts for achievements
5. **Manager Approvals**: Workflow for achievement validation
6. **Custom Badges**: User-defined achievement criteria
7. **Analytics Dashboard**: Advanced performance insights
8. **Integration APIs**: Connect with project management tools
9. **Social Features**: Comments, reactions, celebrations
10. **Mobile App**: Native iOS/Android experience

## 🐛 Known Limitations

- Mock data only (no real backend)
- No real-time updates (requires manual refresh)
- No user registration/authentication
- Limited time-based filtering
- Single-browser persistence only
- No data export functionality

## 📄 License

MIT License - Feel free to use this as a starting point for your own project!

## 🤝 Contributing

This is a demo MVP. For production use, consider:
- Adding proper authentication
- Implementing a backend API
- Adding comprehensive testing
- Implementing proper error handling
- Adding data validation
- Securing sensitive operations

---

**Built with ❤️ for demonstrating employee performance gamification concepts**

