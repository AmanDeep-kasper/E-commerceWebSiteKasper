# 🔄 Auto Token Refresh Implementation Guide

## ✅ क्या किया गया है?

### Backend (`/server/src/controllers/authController.js`)

- ✅ `forgotPassword` - wrapped with asyncHandler
- ✅ `resetPassword` - wrapped with asyncHandler  
- ✅ `refreshAccessToken` - wrapped with asyncHandler
- ✅ सभी functions अब consistent error handling करते हैं

### Frontend (`/client`)

- ✅ **Axios Interceptor** - `/src/api/axiosInstance.js` में auto-refresh logic
- ✅ **Auto-Refresh Hook** - `/src/hooks/useAutoRefreshToken.js` बनाई गई
- ✅ **App Integration** - `/src/App.jsx` में hook add किया

---

## 🎯 कैसे काम करता है?

### Timeline (User का)

```
Login Command
    ↓
├─ Access Token (15 min) + Refresh Token (7 days) generate होते हैं
├─ Token cookies में store होते हैं
│
├─ 0 min ➜ 14 min: User normally use करता है
│  └─ Auto-refresh hook background में wait करता है
│
├─ 14 min पर: 🔄 Auto-refresh trigger होता है
│  ├─ /api/auth/refresh-token को call
│  ├─ ✅ New Access Token generate होता है
│  └─ User को कुछ नहीं दिखता, सब background में हो जाता है
│
├─ Next 14 min: फिर से normal use
│
├─ 28 min पर: 🔄 Again auto-refresh
│
├─ ... यह cycle continue होता है जब तक Refresh Token valid है
│
└─ 7 days बाद: ❌ Refresh Token expires
   └─ User को login page पर redirect किया जाता है
```

---

## 📝 Implementation Details

### 1️⃣ Backend Setup (✅ Already Done)

**File:** `/server/src/controllers/authController.js`

```javascript
// refreshAccessToken अब asyncHandler से wrap है
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw AppError.authentication("Refresh token required", "NO_REFRESH_TOKEN");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw AppError.authentication(
        "Refresh token expired. Please login again.",
        "REFRESH_TOKEN_EXPIRED"
      );
    }
    throw AppError.authentication("Invalid refresh token", "INVALID_REFRESH_TOKEN");
  }

  // ... rest of implementation
  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    data: { expiresIn, tokenType, sessionId },
  });
});
```

**Route:** `/api/auth/refresh-token` (POST)

- **Authentication:** Cookies (automatic)
- **Response:** `{ success: true, data: { expiresIn, tokenType, sessionId } }`

---

### 2️⃣ Frontend Axios Interceptor (✅ Already Done)

**File:** `/client/src/api/axiosInstance.js`

```javascript
// 1. Request में 401 error आए तो किया करें?
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(f => {
    if (error) f.reject(error);
    else f.resolve();
  });
  isRefreshing = false;
  failedQueue = [];
};

// 2. Response Interceptor में logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 error aye aur pehle retry nahi hua
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // Agar already refresh ho rha hai to queue mein dalo
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Token refresh karo
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.status === 200) {
          console.log("✅ Token auto-refreshed successfully");
          processQueue();
          // Original request dobara try karo
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed");
        processQueue(refreshError);
        
        // Login page pe redirect karo
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

**क्या यह करता है:**

- हर request में interceptor check करता है
- अगर 401 error आता है (token expired) तो refresh करने की कोशिश करता है
- Refresh successful हो तो original request retry करता है
- एक साथ multiple 401 requests आएं तो सभी को queue करता है एक-एक करके handle करने के लिए

---

### 3️⃣ Auto-Refresh Hook (✅ Already Done)

**File:** `/client/src/hooks/useAutoRefreshToken.js`

```javascript
export const useAutoRefreshToken = () => {
  const refreshTimerRef = useRef(null);
  const isRefreshingRef = useRef(false);

  const scheduleTokenRefresh = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // 14 minutes बाद refresh करने का schedule बनाओ
    const REFRESH_INTERVAL = 14 * 60 * 1000;

    refreshTimerRef.current = setTimeout(async () => {
      if (isRefreshingRef.current) return;

      isRefreshingRef.current = true;

      try {
        const response = await axiosInstance.post("/auth/refresh-token");

        if (response?.status === 200) {
          console.log("✅ Token refreshed successfully");
          
          // अगला refresh schedule करो
          scheduleTokenRefresh();
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          console.error("❌ Refresh token expired");
          window.location.href = "/login";
        } else {
          console.error("⚠️ Token refresh error");
          // 1 minute बाद फिर try करो
          scheduleTokenRefresh();
        }
      } finally {
        isRefreshingRef.current = false;
      }
    }, REFRESH_INTERVAL);

    console.log(`⏰ Token refresh scheduled for 14 minutes`);
  };

  useEffect(() => {
    // Component mount होते पर refresh schedule करो
    scheduleTokenRefresh();

    // Component unmount होते पर cleanup करो
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);
};
```

**क्या यह करता है:**

- User login करने के बाद automatically 14 minutes का timer set करता है
- 14 minutes बाद `/auth/refresh-token` को call करता है
- ✅ Success: अगला refresh schedule करो
- ❌ Failure: Login page पर redirect करो

---

### 4️⃣ App में Integration (✅ Already Done)

**File:** `/client/src/App.jsx`

```javascript
import { useAutoRefreshToken } from "./hooks/useAutoRefreshToken";

function App() {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated } = useSelector((state) => state.user);

  // 🔄 यह line auto-refresh को active करता है
  useAutoRefreshToken();

  // ... rest of App
}
```

---

## 🧪 Testing करने के लिए

### Browser Console में testing

```javascript
// 1. Current time check करो
console.log("Current time:", new Date().toLocaleTimeString());

// 2. Login करो (manual or UI से)

// 3. Console में यह देखो:
// ✅ "Token refresh scheduled for 14 minutes"

// 4. 14 minutes बाद automatically यह message आएगा:
// ✅ "Token refreshed successfully at [time]"

// 5. Refresh token सही है check करने के लिए:
document.cookie // देखो refresh token cookie है
```

### Manual Testing Steps

```bash
1. Server शुरू करो:
   cd server && npm run dev

2. Client शुरू करो (अलग terminal में):
   cd client && npm run dev

3. Login करो अपने credentials से

4. Network tab खोलो (DevTools → Network)

5. 14 minutes wait करो या फिर Console से manually:
   ```javascript
   // यह manually token refresh करेगा
   import axiosInstance from "./api/axiosInstance"
   axiosInstance.post("/auth/refresh-token")
   ```

1. Network tab में `/auth/refresh-token` का request देखो
   - Status: 200 ✅
   - Response: `{ success: true, data: {...} }`

```

---

## 🔒 Security Features

### ✅ Implemented:

1. **Refresh Token Security**
   - HTTPOnly Cookie में store है (JS से access नहीं कर सकते)
   - Secure flag है (HTTPS के साथ ही send होगा production में)
   - SameSite=strict है (CSRF protection)

2. **Token Rotation**
   - हर refresh पर नया token generate होता है
   - Old token invalidate हो जाता है

3. **Timing Safety**
   - Token 1 minute पहले refresh होता है (access token expire होने से)
   - Multiple requests एक साथ आएं तो queue में handle होते हैं

4. **Error Handling**
   - 401 errors automatically catch होते हैं
   - Sensitive error messages नहीं दिख रहे user को
   - Graceful fallback to login page

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Auto-refresh काम नहीं कर रहा"

**Solution:**
```javascript
// 1. Browser Console खोलो (F12)
// 2. देखो कि ये message आ रहा है:
console.log("⏰ Token refresh scheduled for 14 minutes");

// अगर नहीं आ रहा तो:
// - App.jsx में useAutoRefreshToken() add है?
// - Hook file import सही है?
// - No errors console में?
```

### Issue 2: "Token refresh कर रहा है पर काम नहीं कर रहा"

```javascript
// Check करो:
// 1. Backend endpoint `/api/auth/refresh-token` काम कर रहा है?
// 2. Refresh token cookie valid है?
// 3. Server logs में क्या दिख रहा है?
```

### Issue 3: "टू many refresh attempts"

```javascript
// यह नहीं होना चाहिए क्योंकि 14 minute gap है
// अगर हो रहा है तो REFRESH_INTERVAL को बढ़ाओ
const REFRESH_INTERVAL = 20 * 60 * 1000; // 20 minutes
```

---

## 📊 Token Timeline

```
Login (0 sec)
  ├─ Access Token: 15 min validity
  ├─ Refresh Token: 7 days validity
  │
  ├─ 14:00 min: 🔄 Auto-Refresh #1
  │  └─ New Access Token (15 min from now)
  │
  ├─ 28:00 min: 🔄 Auto-Refresh #2
  │  └─ New Access Token (15 min from now)
  │
  ├─ 42:00 min: 🔄 Auto-Refresh #3
  ├─ 56:00 min: 🔄 Auto-Refresh #4
  ├─ 70:00 min: 🔄 Auto-Refresh #5
  │
  ├─ ... (continuous cycle)
  │
  └─ 7 days (10080 min): ❌ Refresh Token Expires
     └─ Must login again
```

---

## 🚀 Next Steps

### Optional Enhancements

1. **Inactivity Logout**

   ```javascript
   // 30 minutes inactivity के बाद auto logout करो
   // (currently नहीं है)
   ```

2. **Token Expiry Warning**

   ```javascript
   // User को बताओ कि session expire होने वाला है
   // Toast notification show करो
   ```

3. **Multi-tab Sync**

   ```javascript
   // Multiple tabs में login हो तो सभी को sync रखो
   // (currently separate tabs work independently)
   ```

4. **Offline Support**

   ```javascript
   // Offline होने पर queue में requests रखो
   // Online होने पर सब requests retry करो
   ```

---

## 📚 File Reference

| File | Purpose | Status |
|------|---------|--------|
| `/server/src/controllers/authController.js` | Backend auto-refresh endpoint | ✅ Updated |
| `/client/src/api/axiosInstance.js` | Axios interceptor logic | ✅ Enhanced |
| `/client/src/hooks/useAutoRefreshToken.js` | React hook for scheduling | ✅ Created |
| `/client/src/App.jsx` | Hook integration | ✅ Updated |

---

## 💡 Summary

```
Before:  Login → 15 min → Token Expires → 😞 Re-login
After:   Login → 14 min → Auto-Refresh → 14 min → Auto-Refresh → ... → 7 days → Re-login
         ✅ Seamless experience!
```

**अब user 15 minutes बाद logout नहीं होगा! 🎉**

Token हर 14 minutes में automatically refresh होगा जब तक 7 days पूरे न हो जाएं।
