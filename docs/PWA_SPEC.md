# 📱 Slipstats PWA Specification & Offline Strategy

## 1. Web App Manifest (`public/manifest.json`)
The manifest configures Slipstats as a native-feeling standalone application on smartphones and tablets:
* **Display Mode**: `standalone` (removes browser address bar and navigation controls).
* **Orientation**: `portrait` (optimized for single-handed thumb operation).
* **Theme Color**: `#005cb8` (sets Android status bar tinting).
* **Background Color**: `#f9f9ff` (prevents white screen flashes during app launch).
* **Icons**: 192x192 and 512x512 adaptive icons stored in `public/images/logo.png`.

---

## 2. Service Worker Strategy (`public/sw.js`)
Slipstats implements a **Stale-While-Revalidate with Offline Cache** strategy:
1. **Critical Assets Cached on Install**:
   * App shell (`/`)
   * App icons & brand logos (`/images/logo.png`, `/images/mother_avatar.png`)
   * Web App Manifest (`/manifest.json`)
2. **Network-First for Financial Records**:
   * When online, all ledger actions fetch real-time data.
   * When offline, the service worker serves cached application assets, enabling mothers to view their ledger and enter offline receipts without a network connection.
3. **Safe-Area Insets**:
   * Layout utilizes `.pt-safe` and `.pb-safe` with `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` to account for iPhone notches, dynamic islands, and Android navigation bars.

---

## 3. Installation Flow
* **iOS Users**:
  1. Open the application URL in Safari.
  2. Tap the **Share** icon at the bottom of Safari.
  3. Scroll down and tap **"Add to Home Screen"**.
  4. The Slipstats icon will appear directly alongside native apps.
* **Android Users**:
  1. Open the application in Chrome.
  2. A native prompt will display: *"Add Slipstats to Home Screen"*.
  3. Alternatively, tap the Chrome settings menu ➔ tap **"Install App"**.
