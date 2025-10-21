# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd /tmp/performance-gamification-mvp
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## First Time Login

### Quick Select Personas
Choose one of the pre-configured users:

1. **Sarah Johnson** - Employee (Engineering)
   - View employee dashboard
   - Log achievements
   - Redeem rewards
   
2. **Mike Wilson** - Manager (Sales)
   - Access employee features PLUS
   - View team dashboard
   - Monitor team performance
   
3. **Alex Martinez** - Admin (HR)
   - Access all features PLUS
   - Configure point values
   - View system analytics
   - Reset data

## Key Pages to Explore

| Page | URL | Description |
|------|-----|-------------|
| Login | `/` | Choose your user |
| Dashboard | `/dashboard` | Your performance overview |
| Leaderboard | `/leaderboard` | Company rankings |
| Rewards | `/rewards` | Redeem your points |
| Manager | `/manager` | Team view (managers only) |
| Admin | `/admin` | System config (admins only) |
| Test Demo | `/test/demo` | Experiment with features |

## Try These Actions

### As Employee (Sarah)
1. Click "Log Achievement" on dashboard
2. Select achievement type (e.g., "Task Completed")
3. Add description and submit
4. Watch your points increase!
5. Visit `/rewards` and redeem something

### As Manager (Mike)
1. View your team's performance
2. See top performers
3. Monitor recent team activity
4. Check team roster

### As Admin (Alex)
1. View system-wide stats
2. Adjust point values for KPIs
3. See badge distribution
4. Check department breakdowns

## Experiment in Test Mode

Visit `/test/demo` to:
- Add points instantly (+10, +50, +100, +500)
- Simulate 5 random achievements
- Reset all data to initial state
- Clear localStorage entirely

## Tips

- **Data Persists**: All your changes are saved in localStorage
- **Switch Users**: Logout and login as different users to see different perspectives
- **Reset Anytime**: Use the test page or admin panel to reset data
- **No Backend Needed**: Everything runs in your browser!

## Need Help?

Check the main [README.md](./README.md) for:
- Detailed feature documentation
- Technical architecture
- Data models
- Badge criteria
- Reward catalog
- And more!

---

**Ready to gamify performance? Start exploring! 🚀**

