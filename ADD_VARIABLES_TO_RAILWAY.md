# How to Add MONGO_URI Variable to Railway

## Step-by-Step Guide

### Step 1: Go to Railway Dashboard
- Open https://railway.app
- Login with your account
- Click on your **"E-Lib"** project

### Step 2: Select the Backend Service
- You should see two services:
  - E-Lib (Backend) ← Click this one
  - Mongo (Database)
- Click on **"E-Lib"** service

### Step 3: Go to Variables Tab
- On the left side menu, look for these tabs:
  - **Deployments**
  - **Variables** ← Click here
  - **Metrics**
  - **Settings**
- Click **"Variables"**

### Step 4: Add New Variable
- You'll see a section that says **"Environment Variables"**
- Look for a button that says **"Add Variable"** or **"New Variable"**
- Click it

### Step 5: Enter Variable Name
**Field 1: Name/Key**
- Type exactly: `MONGO_URI`
- (Must be in CAPITAL letters with underscore)

### Step 6: Enter MongoDB Connection String
**Field 2: Value**

Paste your MongoDB connection string. It should look like:
```
mongodb+srv://sachinsharmaa07:Sachin.@69@e-lib.xxxxx.mongodb.net/elib?retryWrites=true&w=majority
```

### Step 7: Save the Variable
- Click **"Save"** or **"Add"** button
- You should see it appear in the list of variables

### Step 8: Add Other Variables (Same Process)

Repeat Steps 4-7 for these variables:

**Variable 2:**
- Name: `PORT`
- Value: `4000`

**Variable 3:**
- Name: `NODE_ENV`
- Value: `production`

---

## Final Step: Redeploy

After adding all variables:

1. Go to **"Deployments"** tab (left menu)
2. Find the latest deployment (should show as failed or pending)
3. Look for a **"Redeploy"** button (usually at the bottom right)
4. Click **"Redeploy"**
5. Wait for deployment to complete (should show green checkmark ✅)
6. Go to **"Deploy Logs"** tab to verify it says:
   ```
   ✅ MongoDB connected successfully
   ✅ Server running on port 4000
   ```

---

## Visual Summary

```
Railway Dashboard
    ↓
E-Lib Project
    ↓
E-Lib Service (Backend)
    ↓
Variables Tab
    ↓
Add Variable
    ↓
Name: MONGO_URI
Value: mongodb+srv://...
    ↓
Save
    ↓
Redeploy
```

---

## All Variables You Need

| Order | Name | Value |
|-------|------|-------|
| 1st | `MONGO_URI` | `mongodb+srv://sachinsharmaa07:Sachin.@69@e-lib.xxxxx.mongodb.net/elib?retryWrites=true&w=majority` |
| 2nd | `PORT` | `4000` |
| 3rd | `NODE_ENV` | `production` |

Replace `xxxxx` with your actual cluster name from MongoDB Atlas.

---

## What Should Happen

✅ After redeploy, you should see in Deploy Logs:
```
Server running on port 4000
✅ MongoDB connected successfully
```

If you see this, deployment is SUCCESSFUL! 🎉

---

## Troubleshooting

**❌ "Variable not saved"**
- Make sure you clicked the Save button
- Check variable name has no spaces

**❌ "MongoDB connection failed"**
- Double-check the connection string is copied correctly
- Verify password doesn't have typos
- Check that IP whitelist on MongoDB includes your IP

**❌ "Still showing Failed"**
- Wait 2-3 minutes after adding variables
- Then click Redeploy again
- Check Deploy Logs for specific error message
