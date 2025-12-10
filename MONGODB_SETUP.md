# MongoDB Atlas Setup - Complete Guide

## Your Credentials (Save These!)

**Username:** `sachinsharmaa07`  
**Password:** `Sachin.@69`  
**Cluster Name:** `E-Lib`

---

## Step 1: Get Connection String

1. On the MongoDB Atlas page you're viewing, look for a **"Connect"** button
2. Click **"Connect"** 
3. In the popup, choose **"Drivers"** (or "Connect your application")
4. Select **"Node.js"** as the driver
5. Copy the connection string - it will look like:

```
mongodb+srv://sachinsharmaa07:Sachin.@69@e-lib.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## Step 2: Format Your Connection String

Replace the placeholders in the connection string:

**Template:**
```
mongodb+srv://sachinsharmaa07:Sachin.@69@e-lib.xxxxx.mongodb.net/elib?retryWrites=true&w=majority
```

**Your URL (Example):**
```
mongodb+srv://sachinsharmaa07:Sachin.@69@e-lib.xxxxx.mongodb.net/elib?retryWrites=true&w=majority
```

*(Replace `xxxxx` with your actual cluster name from MongoDB Atlas)*

---

## Step 3: Add to Railway

### On Railway Dashboard:

1. Go to https://railway.app
2. Click your **E-Lib** project
3. Click the **E-Lib** service (Backend)
4. Go to **"Variables"** tab
5. Click **"Add Variable"**
6. Add these:

| Name | Value |
|------|-------|
| `PORT` | `4000` |
| `MONGO_URI` | `mongodb+srv://sachinsharmaa07:Sachin.@69@e-lib.xxxxx.mongodb.net/elib?retryWrites=true&w=majority` |
| `NODE_ENV` | `production` |

7. Click **"Save"** for each one
8. Go to **"Deployments"** tab
9. Click **"Redeploy"** on the latest deployment

---

## Step 4: Check Connection

After redeploying, go to **"Deploy Logs"** and look for:

```
✅ MongoDB connected successfully
✅ Server running on port 4000
```

If you see these messages, your deployment is successful! 🎉

---

## Step 5: Get Your Backend URL

Once deployed successfully:

1. Go to **"Settings"** tab
2. Look for **"Public URL"** or **"Domain"**
3. Copy that URL (looks like: `https://comfortable-reprieve-production.railway.app`)

---

## Step 6: Add Backend URL to Vercel

Now update your frontend to use the deployed backend:

1. Go to https://vercel.app
2. Click your **E-Lib Frontend** project
3. Go to **"Settings"** → **"Environment Variables"**
4. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://comfortable-reprieve-production.railway.app/api`
5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click **"Redeploy"** on latest deployment

---

## Complete Setup Checklist

- [ ] MongoDB Atlas cluster created ✓
- [ ] Connection string copied
- [ ] `MONGO_URI` added to Railway Variables
- [ ] `PORT` set to `4000` in Railway
- [ ] Railway redeployed
- [ ] Deploy logs show "MongoDB connected successfully"
- [ ] Backend Public URL copied
- [ ] `VITE_API_URL` added to Vercel
- [ ] Vercel redeployed

---

## Testing Your Live App

Once everything is deployed:

1. Go to your Vercel frontend URL: `https://your-app.vercel.app`
2. Try to register a new account
3. Try to login
4. Check if everything works!

---

## If Something Goes Wrong

### MongoDB Connection Failed?
- Check password doesn't have special characters (yours has `@` - that's fine)
- Verify IP whitelist includes your IP (or "0.0.0.0/0")
- Copy connection string exactly as shown

### Backend still not running?
- Check Railway deploy logs for errors
- Verify all variables are set correctly
- Try manual redeploy

### Frontend can't connect?
- Verify `VITE_API_URL` is correct
- Check backend is running (curl the URL)
- Verify CORS is enabled in backend

---

## Quick Command to Test Backend

```bash
curl https://comfortable-reprieve-production.railway.app
```

Should return: `E-Lib Backend Running`

---

Let me know:
1. What's your exact connection string from MongoDB?
2. Have you added variables to Railway yet?
3. What's your Railway backend URL?

I can help verify everything! 🚀
