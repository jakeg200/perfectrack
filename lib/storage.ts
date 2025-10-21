// localStorage utilities for persisting data in the MVP

const STORAGE_KEYS = {
  USERS: "perf_gamification_users",
  ACHIEVEMENTS: "perf_gamification_achievements",
  REDEMPTIONS: "perf_gamification_redemptions",
  ACTIVITY_FEED: "perf_gamification_activity_feed",
  CURRENT_USER: "perf_gamification_current_user",
  POINTS_CONFIG: "perf_gamification_points_config",
  INITIALIZED: "perf_gamification_initialized",
};

// Generic storage functions
export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

export function loadFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}

export function clearAllStorage(): void {
  if (typeof window === "undefined") return;
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

// Specific storage functions for our app
export const storage = {
  // Users
  getUsers: () => loadFromStorage<any[]>(STORAGE_KEYS.USERS) || [],
  saveUsers: (users: any[]) => saveToStorage(STORAGE_KEYS.USERS, users),

  // Achievements
  getAchievements: () => loadFromStorage<any[]>(STORAGE_KEYS.ACHIEVEMENTS) || [],
  saveAchievements: (achievements: any[]) =>
    saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, achievements),

  // Redemptions
  getRedemptions: () => loadFromStorage<any[]>(STORAGE_KEYS.REDEMPTIONS) || [],
  saveRedemptions: (redemptions: any[]) =>
    saveToStorage(STORAGE_KEYS.REDEMPTIONS, redemptions),

  // Activity Feed
  getActivityFeed: () => loadFromStorage<any[]>(STORAGE_KEYS.ACTIVITY_FEED) || [],
  saveActivityFeed: (feed: any[]) => saveToStorage(STORAGE_KEYS.ACTIVITY_FEED, feed),

  // Current User
  getCurrentUser: () => loadFromStorage<string>(STORAGE_KEYS.CURRENT_USER),
  saveCurrentUser: (userId: string) => saveToStorage(STORAGE_KEYS.CURRENT_USER, userId),
  clearCurrentUser: () => removeFromStorage(STORAGE_KEYS.CURRENT_USER),

  // Points Config
  getPointsConfig: () => loadFromStorage<any>(STORAGE_KEYS.POINTS_CONFIG),
  savePointsConfig: (config: any) => saveToStorage(STORAGE_KEYS.POINTS_CONFIG, config),

  // Initialization flag
  isInitialized: () => loadFromStorage<boolean>(STORAGE_KEYS.INITIALIZED) === true,
  setInitialized: () => saveToStorage(STORAGE_KEYS.INITIALIZED, true),

  // Clear all data
  clearAll: clearAllStorage,
};

