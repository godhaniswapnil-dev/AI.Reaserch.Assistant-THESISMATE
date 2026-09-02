# ThesisMate - Complete Application Setup

## 🔴 Current Error: ECONNREFUSED

The error **"Could not proxy request ... ECONNREFUSED"** means:
- ✓ Frontend is running on port 3000
- ✓ Frontend tried to reach backend on port 5262
- ✗ **Backend is NOT running** (connection refused)

---

## ✅ SOLUTION: Start Backend First!

### **Option 1: Using Visual Studio (RECOMMENDED)**

1. **Open Visual Studio 2026**
   - File → Open → Select `WebApplication3.slnx`

2. **Set Startup Project**
   - In Solution Explorer, right-click `AIRESEARCHASSISTANT`
   - Click "Set as Startup Project"

3. **Run Backend**
   - Press **F5** (or Debug → Start Debugging)
   - Wait for console to show:
	 ```
	 Now listening on: http://localhost:5262
	 Now listening on: https://localhost:7148
	 ```
   - **Do NOT close this window**

4. **Open Frontend in New Terminal**
   - Open PowerShell/Git Bash
   - Run: `cd C:\Users\itisha\source\repos\WebApplication3\clientapp`
   - Run: `npm start`
   - Wait for: `Compiled successfully!`
   - Browser opens to http://localhost:3000

---

### **Option 2: Using Quick Start Script**

**For PowerShell:**
```powershell
# navigate to project root
cd C:\Users\itisha\source\repos\WebApplication3\

# run the startup script
.\START_APP.ps1
```

**For Command Prompt:**
```cmd
cd C:\Users\itisha\source\repos\WebApplication3\
START_APP.bat
```

---

## 🧪 Test the Application

### **Create Account (POST /api/auth/register)**

1. Click **"Sign up"** in top right
2. Fill in:
   - **Full Name:** `kano`
   - **Email:** `kano@gmail.com`
   - **Password:** `password123`
3. Click **"Create account"**
4. **Expected:**
   - ✅ Account created in SQL Database
   - ✅ Redirected to Dashboard
   - ✅ Green avatar shows "K" (first letter of name)
   - ✅ Username "kano" displayed next to avatar

### **Login (POST /api/auth/login)**

1. Click **"Logout"** (if logged in)
2. Click **"Login"** button
3. Fill in credentials from above
4. Click **"Login"**
5. **Expected:**
   - ✅ Logs in successfully
   - ✅ Redirected to Dashboard
   - ✅ Can click avatar to stay on dashboard

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│                  (localhost:3000)                             │
└────────────────────┬────────────────────────────────────────┘
					 │
					 │ HTTP Requests
					 │ /api/auth/*
					 │
┌────────────────────▼────────────────────────────────────────┐
│              REACT FRONTEND                                  │
│                  Port: 3000                                  │
│  Proxy Configuration → http://localhost:5262                │
└────────────────────┬────────────────────────────────────────┘
					 │
					 │ Proxied Requests
					 │
┌────────────────────▼────────────────────────────────────────┐
│            .NET 8 BACKEND (ASP.NET Core)                    │
│                  Port: 5262                                 │
│         API Endpoints: /api/auth/*, /api/dashboard          │
└────────────────────┬────────────────────────────────────────┘
					 │
					 │ SQL Queries
					 │
┌────────────────────▼────────────────────────────────────────┐
│          SQL SERVER (LocalDB)                                │
│       Database: WebApp3Db                                    │
│       Table: dbo.Users (FullName, Email, Password_Hash)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Port Configuration

| Component | Port | Status |
|-----------|------|--------|
| React Frontend | 3000 | Auto-running |
| .NET Backend API | 5262 | Must start manually |
| HTTPS Variant | 7148 | Optional |
| SQL LocalDB | (local) | Auto |

---

## 🚨 Troubleshooting

### **"Could not proxy request ... ECONNREFUSED"**
- **Cause:** Backend not running
- **Fix:** Start Visual Studio and press F5 on AIRESEARCHASSISTANT project

### **"Cannot find npm" or "npm: The term is not recognized"**
- **Cause:** Node.js not installed
- **Fix:** Download from https://nodejs.org/ and install

### **"Port 5262 already in use"**
- **Cause:** Another process using the port
- **Fix:** 
  - Close other applications
  - Or run: `netstat -ano | findstr :5262` to find process ID
  - Then: `taskkill /PID <processid> /F`

### **"Cannot connect to database"**
- **Cause:** LocalDB not running or migrations not applied
- **Fix:** Run migrations from Visual Studio Package Manager Console:
  ```
  Update-Database -Project "WebApplication3"
  ```

### **"Blank dashboard after login"**
- **Cause:** JWT token not being sent to /api/dashboard
- **Fix:** Check browser console (F12 → Console) for errors

---

## 📝 API Reference

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login with credentials | No |
| GET | `/api/dashboard` | Get user info | Yes (JWT) |

---

## 🔒 Security Notes

- Passwords are hashed using `PasswordHasher<User>` (ASP.NET Core)
- JWT tokens expire after 60 minutes (configurable in appsettings.json)
- CORS policy allows `localhost:3000` in development
- Change `Jwt:Key` to a secure value in production

---

## 📱 Next Steps (After Everything Works)

1. ✅ Test signup → creates user → saves to database
2. ✅ Test login → verifies credentials
3. ✅ Test logout → clears state
4. Implement additional features:
   - Password reset
   - Profile editing
   - Document creation
   - Real-time features

---

**Still having issues?** 
1. Check browser console (F12)
2. Check backend console output
3. Verify ports: `netstat -ano | findstr :5262`
4. Restart both backend and frontend
