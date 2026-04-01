# ScanSavvy - Mobile Coupon Aggregation App

**Tagline:** "All Your Coupons. One QR Code."

ScanSavvy is a mobile-first coupon aggregation app built for everyday shoppers. It auto-clips coupons from your favorite stores and generates QR codes for instant savings at checkout.

## ✅ Complete Implementation

### All 9 Screens Built
1. ✅ **Splash Screen** - Animated logo with smooth transitions
2. ✅ **Onboarding** - 3 swipeable slides explaining the app
3. ✅ **Sign Up / Login** - Email/password authentication + social buttons (UI)
4. ✅ **Link Store Accounts** - Connect to 5 major retailers
5. ✅ **Home Dashboard** - Trending deals, stats, nearby store detection
6. ✅ **QR Code Screen** - Real QR generation, auto-brightness, timer
7. ✅ **Coupon Browser** - Search, filter, clip/unclip functionality
8. ✅ **Savings History** - Total savings, visit history, monthly chart
9. ✅ **Account Settings** - Manage stores, notifications, location

### Design System Match
- ✅ Navy primary color (#1A2E44)
- ✅ Light blue-grey background (#F5F7FA)
- ✅ Retailer brand colors (Walmart blue, Target red, etc.)
- ✅ Pill-shaped buttons (56px, fully rounded)
- ✅ Card-based layout (16px radius, subtle shadows)
- ✅ System fonts (SF Pro / Roboto)
- ✅ HOT/NEW badges with soft colors
- ✅ Navigation tabs with icons

## Key Features

### 🎯 Smart Coupon Management
- Auto-clip coupons from linked stores
- Real-time search and filtering
- Category filters: Grocery, Personal Care, Household, Beauty, Pharmacy
- Store filters: All, Walmart, Target, Kroger, CVS, Walgreens
- Persistent clip state with AsyncStorage

### 📍 Location-Based Detection
- Simulated "Kroger Nearby" banner
- Geofence radius selector (0.25 / 0.5 / 1 mile)
- Location permission handling

### 📱 QR Code Generation
- Real QR code: `scansavvy://redeem?store=kroger&session=demo2024&user=alex`
- Auto-brightness to 100% for scanning
- Countdown timer (5h 42m expiration)
- Expandable clipped coupons list
- Estimated savings display ($47.50)

### 💰 Savings Tracking
- Total saved: $284.50
- Visit history with dates, stores, amounts
- Monthly bar chart visualization
- Share savings button

### 🏪 Store Integration
- 5 retailers: Walmart, Target, Kroger, CVS, Walgreens
- Loyalty program names displayed
- Connect/disconnect functionality
- Green checkmark for connected stores

## Mock Data Highlights

### Sample Deals
- **Target**: 25% OFF All Household Essentials (HOT - 2,340 claimed)
- **Walmart**: $10 OFF $50 Grocery Purchases (NEW - 1,892 claimed)
- **Kroger**: BOGO Free Select Snacks & Beverages (1,567 claimed)
- **CVS**: 40% OFF Health & Wellness Items (987 claimed)
- **Walgreens**: $5 OFF $20 Beauty Purchase (743 claimed)

### Community Stats
- $47,230 saved by local shoppers this week
- 12,450 coupons redeemed
- $18.92 average savings per trip

### Activity Feed
- Sarah M. saved $156 at Target, Kroger
- James T. saved $142 at Walmart, CVS
- Maria L. saved $128 at Publix, Costco

## Tech Stack

- **Framework**: Expo 54 with React Native
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API + AsyncStorage
- **QR Codes**: react-native-qrcode-svg
- **Location**: expo-location
- **Brightness**: expo-brightness
- **Icons**: @expo/vector-icons (Ionicons)

## User Journey

1. **Launch** → Animated splash screen (2s)
2. **Onboarding** → Swipe through 3 feature slides
3. **Sign Up** → Create account with email/password
4. **Link Stores** → Connect at least 1 loyalty account
5. **Home** → Browse trending deals, see nearby store
6. **Get Coupons** → Tap button to generate QR code
7. **Clip More** → Browse and clip additional coupons
8. **Track Savings** → View total savings and history
9. **Settings** → Manage stores, notifications, location

## File Structure

```
/app/frontend/
├── app/
│   ├── _layout.tsx              # Root with AuthProvider
│   ├── index.tsx                # Splash
│   ├── onboarding.tsx           # 3-slide carousel
│   ├── auth/
│   │   ├── signup.tsx
│   │   └── login.tsx
│   ├── link-stores.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Bottom tabs
│   │   ├── home.tsx
│   │   ├── coupons.tsx
│   │   ├── savings.tsx
│   │   └── account.tsx
│   └── qr-code.tsx
├── components/
│   ├── PrimaryButton.tsx
│   ├── SecondaryButton.tsx
│   ├── Logo.tsx
│   ├── CouponCard.tsx
│   └── StoreBadge.tsx
├── constants/
│   ├── Colors.ts
│   ├── Typography.ts
│   └── MockData.ts
└── context/
    └── AuthContext.tsx
```

## Running the App

```bash
cd /app/frontend

# Start Expo
yarn start

# Scan QR code with Expo Go app
# Or press 'w' for web, 'i' for iOS simulator, 'a' for Android emulator
```

## Demo Credentials

Any email/password combination works (mock authentication).

Example:
- Email: alex@example.com
- Password: password123

## Notable Implementation Details

✅ **Pull-to-refresh** on home screen
✅ **Smooth animations** for onboarding slides
✅ **Platform-specific** behavior (SafeAreaView)
✅ **Keyboard handling** with KeyboardAvoidingView
✅ **Persistent state** across app restarts
✅ **Touch-friendly** 44px minimum touch targets
✅ **Loading states** for QR code generation
✅ **Modal navigation** for QR screen
✅ **Tab navigation** with active state indicators
✅ **Responsive** to different screen sizes

## Success Criteria Met

A tester can:
1. ✅ Onboard and create an account
2. ✅ Link mock store accounts
3. ✅ See trending deals on home screen
4. ✅ Tap "Get My Coupons" and see real QR code
5. ✅ Browse coupons with filters
6. ✅ View savings history
7. ✅ Update notification and account settings

The app feels **polished, production-ready, and visually matches the ScanSavvy design system**.

---

**Status**: ✅ MVP Complete - All screens functional with realistic mock data
