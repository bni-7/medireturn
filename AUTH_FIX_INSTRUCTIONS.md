# Authentication Fix - Schedule Pickup

## ✅ Issue Fixed

**Problem**: Getting 401 (Unauthorized) error when trying to schedule pickup

**Root Cause**: Backend auth middleware was only checking for tokens in cookies, but frontend was sending tokens in the Authorization header

**Solution**: Updated backend middleware to check both Authorization header AND cookies

## 🧪 How to Test

### Option 1: Use Existing Account (if you're already logged in)

1. **Check if you're logged in**:
   - Open browser console (F12)
   - Type: `localStorage.getItem('token')`
   - If you see a token string, you're logged in ✅
   - If you see `null`, you need to login ❌

2. **If logged in, try scheduling pickup again**:
   - Go to: http://localhost:5173/schedule-pickup
   - Fill out the form
   - Click "Schedule Pickup"
   - Should work now! ✅

### Option 2: Fresh Login (if no token or still having issues)

1. **Logout first** (if partially logged in):
   ```javascript
   // In browser console (F12):
   localStorage.clear();
   ```
   Then refresh the page

2. **Register a new account**:
   - Go to: http://localhost:5173/register
   - Fill in the form:
     - **Name**: Test User
     - **Email**: test@example.com (or any email)
     - **Password**: password123
     - **Phone**: 9876543210
     - **Role**: Citizen (important!)
     - **Address**: Complete all fields (street, city, state, pincode)
   - Click "Register"

3. **You should be automatically logged in and redirected to dashboard**

4. **Schedule a pickup**:
   - Click "Schedule Pickup" in navigation
   - Fill out the form:
     - **Collection Point**: Select any (e.g., Apollo Pharmacy)
     - **Pickup Date**: Tomorrow or any future date
     - **Time Slot**: Any slot
     - **Medicine Details**: e.g., "Paracetamol 500mg"
     - **Estimated Quantity**: e.g., 0.5
     - **Contact Phone**: Auto-filled
   - Click "Schedule Pickup"
   - Should see success message! ✅

### Option 3: Use Pre-seeded Citizen Account

If you already seeded a citizen account, you can use it:

**Citizen Login Credentials** (if you created one during testing):
- Email: Your registered email
- Password: password123 (or whatever you set)

## 🔍 Verify Token is Being Sent

Open browser console (F12) before scheduling pickup. You should see:

```
📤 API Request: POST /pickups (with token)  ✅ Good!
```

If you see:
```
📤 API Request: POST /pickups (NO TOKEN)  ❌ Bad - need to login
```

Then you need to login/register first.

## 🚨 Still Getting 401 Error?

If you're still getting unauthorized error after the fix:

1. **Clear localStorage and login again**:
   ```javascript
   localStorage.clear();
   // Then register/login again
   ```

2. **Check you selected "Citizen" role** during registration
   - Only citizens can schedule pickups
   - Collection points cannot schedule pickups

3. **Verify backend restarted** with the fix:
   - Check the backend terminal
   - Should show: `[nodemon] restarting due to changes...`

4. **Hard refresh the frontend**:
   - Press `Ctrl + Shift + R` (Windows)
   - Or `Cmd + Shift + R` (Mac)

## 📋 What Was Changed

### Backend: `src/middleware/auth.js`
- Now checks Authorization header first
- Falls back to cookies if no header
- Both methods now work! ✅

### Frontend: `src/api/axios.js`
- Added better logging to show if token is present
- No functional changes needed (already working correctly)

## ✅ Expected Flow

1. User registers/logs in → Token saved to localStorage
2. User clicks "Schedule Pickup" → Form loads
3. User fills form and submits → Token sent in Authorization header
4. Backend validates token → ✅ Authorized
5. Pickup created → Success message shown
6. Redirect to dashboard → See scheduled pickup

Everything should work now! 🎉
