# MediReturn - Testing Guide

## ✅ Fixes Applied

### 1. Collection Points Page
- **Fixed**: Updated map markers to use `address.lat` and `address.lng` instead of `location.coordinates`
- **Fixed**: Updated "Get Directions" button to use correct address fields
- **Fixed**: Both List View and Map View now work correctly

### 2. Home Page Navigation
- **Fixed**: "Find Collection Points" button now links to `/collection-points` (was `/map`)
- **Fixed**: "Get Started" button now links to `/register` (was `/signup`)
- **Fixed**: "Create Account" button now links to `/register` (was `/signup`)

### 3. Backend API
- ✅ Collection Points API returning data correctly
- ✅ 5 Collection Points seeded in database
- ✅ CORS configured correctly for localhost

## 🚀 How to Test

### Step 1: Verify Servers are Running
Both servers should already be running:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

### Step 2: Test Collection Points Page

#### Option A: Direct URL
1. Open browser to: http://localhost:5173/collection-points
2. You should see 5 collection points listed
3. Toggle between List View and Map View
4. Both views should display all 5 points

#### Option B: From Home Page
1. Go to: http://localhost:5173
2. Click "Find Collection Points" button (should take you to /collection-points)
3. Verify the page loads with collection points

#### Option C: From Header
1. Click "Collection Points" in the header navigation
2. Page should load with all collection points

### Step 3: Test Map View
1. Go to Collection Points page
2. Click "🗺️ Map View" button
3. Map should display with 5 markers
4. Click any marker to see popup with details
5. "Get Directions" button should open Google Maps

### Step 4: Test Schedule Pickup

#### First, Create an Account:
1. Go to: http://localhost:5173/register
2. Fill out the registration form with these details:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Password**: password123
   - **Phone**: 9876543210
   - **Role**: Citizen
   - **Address**: 123 Test Street, Mumbai, Maharashtra, 400001
3. Click "Register"

#### Then, Schedule a Pickup:
1. After login, you'll be on the dashboard
2. Click "Schedule Pickup" in the navigation
3. Fill out the pickup form:
   - **Collection Point**: Select any (e.g., Apollo Pharmacy)
   - **Pickup Date**: Select tomorrow or any future date
   - **Time Slot**: Select any slot
   - **Medicine Details**: e.g., "Paracetamol 500mg, Cough Syrup"
   - **Estimated Quantity**: e.g., 0.5
   - **Contact Phone**: Your phone number (auto-filled)
4. Click "Schedule Pickup"
5. Should see success message and redirect to dashboard

### Step 5: Test as Collection Point User
You can also test logging in as a collection point:

**Login Credentials** (Any of these):
- apollo.mumbai@pharmacy.com / password123
- fortis.delhi@hospital.com / password123
- medlife.bangalore@pharmacy.com / password123
- greenhealth.pune@ngo.org / password123
- cityclinic.chennai@clinic.com / password123

## 🗺️ Available Collection Points

1. **Apollo Pharmacy** - Mumbai, Maharashtra
2. **Fortis Hospital** - Delhi, Delhi
3. **Medlife Pharmacy** - Bangalore, Karnataka
4. **Green Health NGO** - Pune, Maharashtra
5. **City Clinic** - Chennai, Tamil Nadu

## 🐛 If Something Doesn't Work

### Collection Points Not Showing?
```bash
# Re-run the seed script:
cd backend
node scripts/seedCollectionPoints.js
```

### Frontend Not Loading?
```bash
# Restart frontend:
cd frontend
npm run dev
```

### Backend Not Responding?
```bash
# Restart backend:
cd backend
npm run dev
```

### Test API Directly:
```powershell
# Test collection points API:
curl http://localhost:5000/api/collection-points

# Should return JSON with 5 collection points
```

## 📝 Key Features Working

✅ View Collection Points (List & Map)
✅ Click "Get Directions" to open Google Maps
✅ Register new user account
✅ Login to existing account
✅ Schedule pickup (for citizen users)
✅ View dashboard (all users)
✅ Navigation between pages
✅ Responsive design (mobile & desktop)

## 🔍 Debug Information

If you see any errors, check the browser console (F12) for:
- API call errors
- Missing data errors
- Navigation issues

Backend logs show in the terminal where you ran `npm run dev`
Frontend logs show in the browser console

## 🎯 What Each Button Does

| Button/Link | Location | Action |
|-------------|----------|--------|
| **Find Collection Points** | Home page hero | Navigates to /collection-points |
| **Get Started** | Home page hero | Navigates to /register |
| **Explore Map** | Home page bottom | Navigates to /map |
| **Collection Points** | Header | Navigates to /collection-points |
| **Schedule Pickup** | Header (logged in) | Navigates to /schedule-pickup |
| **Get Directions** | Collection point card | Opens Google Maps |
| **📋 List View** | Collection Points page | Shows list of points |
| **🗺️ Map View** | Collection Points page | Shows map with markers |

All buttons should now be working correctly! 🎉
