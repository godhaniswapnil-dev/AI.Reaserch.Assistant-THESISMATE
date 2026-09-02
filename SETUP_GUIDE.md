## COMPLETE SETUP GUIDE - WebApplication3

### ✅ CHECKLIST BEFORE STARTING

- [ ] Git Bash / PowerShell terminal ready
- [ ] Visual Studio 2026 Community Edition open
- [ ] Node.js installed (check with: `node -v`)
- [ ] npm installed (check with: `npm -v`)

---

## 🚀 STARTUP PROCEDURE (IN ORDER)

### **STEP 1: Start Backend (Visual Studio)**

1. Open `C:\Users\itisha\source\repos\WebApplication3\WebApplication3.slnx` in Visual Studio
2. Select the **AIRESEARCHASSISTANT** project in Solution Explorer
3. Press **F5** (or click the green play button)
4. Wait for output showing:
   ```
   Now listening on: http://localhost:5262
   Now listening on: https://localhost:7148
   ```
5. A browser tab may open with Swagger UI - **leave it open**

**✅ Backend Status Check:**
- Open: `http://localhost:5262/swagger`
- Should see list of API endpoints: `/api/auth/login`, `/api/auth/register`, `/api/dashboard`

---

### **STEP 2: Start Frontend (PowerShell - NEW Terminal)**

1. Open a **NEW PowerShell terminal** (don't close the backend)
2. Navigate to clientapp:
   ```powershell
   cd C:\Users\itisha\source\repos\WebApplication3\clientapp
   ```
3. Start the dev server:
   ```powershell
   npm start
   ```
4. Wait for output showing:
   ```
   Compiled successfully!
   Local: http://localhost:3000
   ```
5. Browser should auto-open to `http://localhost:3000`

---

## 🧪 TEST THE FLOW

### **Test Creation Account:**

1. Click **"Sign up"** button (top right)
2. Fill the form:
   - **Full Name:** `hanuman`
   - **Email address:** `ramdut@gmail.com`
   - **Password:** `password123`
3. Click **"Create account"**
4. **Expected Result:**
   - ✅ Account saved to SQL Database
   - ✅ Redirects to Dashboard
   - ✅ Shows username "hanuman" in green circle (top right)
   - ✅ JWT token stored in localStorage

### **Test Login:**

1. Click **"Logout"** (if already logged in)
2. Click **"Login"** button
3. Fill the form:
   - **Email:** `ramdut@gmail.com`
   - **Password:** `password123`
4. Click **"Login"**
5. **Expected Result:**
   - ✅ Logs in successfully
   - ✅ Redirects to Dashboard
   - ✅ Shows username "hanuman" in navbar

---

## 🔍 TROUBLESHOOTING

### **Error: "Could not proxy request... ECONNREFUSED"**
- **Cause:** Backend not running
- **Fix:** Make sure Visual Studio shows "Now listening on: http://localhost:5262" before starting frontend

### **Error: "Cannot POST /api/auth/register"**
- **Cause:** Wrong port or backend endpoints not found
- **Fix:** 
  - Check backend is running on 5262
  - Go to `http://localhost:5262/swagger` and verify endpoints exist

### **Frontend shows blank page**
- **Cause:** npm dependencies not installed
- **Fix:** Run `npm install` in clientapp folder

### **Database error writing to Users table**
- **Cause:** SQL LocalDB not running or migrations not applied
- **Fix:** 
  - Run migrations: `dotnet ef database update --project "WebApplication3\AIRESEARCHASSISTANT.csproj"`
  - Or just run backend - it auto-creates tables

---

## 📁 KEY FILES & PORTS

| Component | Port | URL |
|-----------|------|-----|
| **Backend** | 5262 | http://localhost:5262 |
| **Backend API** | 5262 | http://localhost:5262/api/* |
| **Frontend** | 3000 | http://localhost:3000 |
| **Swagger Docs** | 5262 | http://localhost:5262/swagger |

---

## 🗄️ DATABASE

- **Database:** `WebApp3Db` (LocalDB)
- **Location:** `(localdb)\MSSQLLocalDB`
- **Table:** `dbo.Users` (FullName, Email, Password_hashed)

**View data in Visual Studio:**
- SQL Server Object Explorer → (localdb)\MSSQLLocalDB → WebApp3Db → Tables → dbo.Users

---

## 📝 API ENDPOINTS

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create account (returns JWT) |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/dashboard` | Get user info (requires JWT) |

---

**If everything is working correctly, you should see:**
- ✅ Can sign up with new credentials
- ✅ Data appears in SQL Database immediately
- ✅ Can login with those credentials
- ✅ Redirected to Dashboard with green avatar and username
- ✅ Can logout and login again
