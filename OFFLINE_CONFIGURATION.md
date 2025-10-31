# Offline Configuration Guide

This guide explains how to configure the FPL Fixture Difficulty Table app for different data source modes.

## Current Configuration

The app is currently configured to **default to offline mode** with real FPL data stored locally. This provides:

- ✅ **Fast loading** (no network requests)
- ✅ **Reliable performance** (no API downtime)
- ✅ **Custom difficulty ratings** applied
- ✅ **Real FPL data** (teams, fixtures, gameweeks)

## Configuration Options

### 1. Default Configuration (Current)

**File:** `src/config/appConfig.ts`

```typescript
export const APP_CONFIG = {
    dataSource: {
        defaultMode: 'offline',
        availableModes: ['offline', 'online', 'mock'],
        showModeSelector: true,
        allowModeSwitching: true
    }
    // ... other config
};
```

**Features:**
- Starts in offline mode
- Users can switch between offline/online/mock modes
- Shows mode selector in UI

### 2. Offline-Only Configuration

To make the app **purely offline** with no switching options:

**Step 1:** Update `src/config/appConfig.ts`:

```typescript
export const APP_CONFIG = {
    dataSource: {
        defaultMode: 'offline',
        availableModes: ['offline'], // Only offline mode
        showModeSelector: false,     // Hide mode selector
        allowModeSwitching: false    // Disable switching
    },
    // ... rest of config stays the same
};
```

**Step 2:** Rebuild the app:
```bash
npm run build
```

**Result:**
- App always uses offline data
- No mode selector shown in UI
- No network requests ever made
- Fastest possible performance

### 3. Online-First Configuration

To prioritize online mode but keep offline as fallback:

```typescript
export const APP_CONFIG = {
    dataSource: {
        defaultMode: 'online',
        availableModes: ['online', 'offline'],
        showModeSelector: true,
        allowModeSwitching: true
    }
    // ... other config
};
```

## Data Sources Explained

### Offline Mode (Recommended)
- **Data:** Real FPL teams, fixtures, and gameweeks stored in `src/data/offlineData.ts`
- **Custom Ratings:** Pre-applied to all fixtures
- **Performance:** Instant loading
- **Reliability:** Always works
- **Updates:** Manual (requires updating the offline data file)

### Online Mode
- **Data:** Live from FPL API via proxy service
- **Custom Ratings:** Applied in real-time
- **Performance:** Depends on network/API
- **Reliability:** Subject to API availability
- **Updates:** Automatic (always current)

### Mock Mode
- **Data:** Simulated data for testing
- **Custom Ratings:** Applied
- **Performance:** Simulated delays
- **Reliability:** Always works
- **Updates:** Not applicable

## Custom Difficulty Rules

The custom difficulty rules are configured in `appConfig.ts`:

```typescript
customDifficulty: {
    enabled: true,
    rules: {
        hardestAway: ['Man City', 'Arsenal'],  // Away = Grade 5
        easiestAll: []                         // No always-easy teams
    }
}
```

These rules are applied in all modes (offline, online, mock).

## Updating Offline Data

The offline data in `src/data/offlineData.ts` contains real FPL data fetched from the API. To update it:

1. **Fetch new data** (this was already done):
   ```bash
   # This fetches current FPL data and applies custom difficulty ratings
   node scripts/updateOfflineData.js
   ```

2. **Rebuild the app**:
   ```bash
   npm run build
   ```

## Recommended Setup

For most users, the **current default configuration** is recommended because:

- ✅ **Fast and reliable** (offline by default)
- ✅ **Real FPL data** (not mock data)
- ✅ **Custom difficulty ratings** applied
- ✅ **Flexibility** (can switch to online if needed)
- ✅ **No network dependency** for core functionality

## Pure Offline Setup

If you want the app to be **completely offline** with no online options:

1. Update `src/config/appConfig.ts`:
   ```typescript
   availableModes: ['offline'],
   showModeSelector: false,
   allowModeSwitching: false
   ```

2. Rebuild: `npm run build`

3. The app will now:
   - Always use offline data
   - Never make network requests
   - Have no mode switching UI
   - Load instantly

This is perfect for environments where internet access is limited or you want guaranteed performance.