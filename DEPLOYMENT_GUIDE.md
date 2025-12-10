# E-Library Deployment Guide

Complete guide to deploy your E-Library frontend on Vercel and backend on a cloud service.

---

## PART 1: DEPLOY FRONTEND ON VERCEL

### Step 1: Sign Up on Vercel
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account
5. Complete the signup process

### Step 2: Create Vercel Project
1. Click "New Project"
2. Select your "E-Lib" repository from GitHub
3. Click "Import"

### Step 3: Configure Frontend Settings
1. **Project Name**: e-lib-frontend (or your choice)
2. **Framework Preset**: Vite
3. **Root Directory**: ./Frontend
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**: Add these:
   ```
   VITE_API_URL = https://your-backend-url.com/api
   ```
   (Replace with your actual backend URL)

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete (usually 2-3 minutes)
3. You'll get a URL like: https://e-lib-frontend.vercel.app

---

## PART 2: DEPLOY BACKEND ON RAILWAY

Railway is free and easy for Node.js + MongoDB backends.

### Step 1: Sign Up on Railway
1. Go to https://railway.app
2. Click "Start New Project"
3. Choose "Deploy from GitHub repo"
4. Authorize Railway to access GitHub
5. Select your "E-Lib" repository

### Step 2: Configure Railway Project
1. Click "New Service"
2. Select "GitHub repo"
3. Choose your E-Lib repo
4. Click "Deploy"

### Step 3: Add MongoDB Database
1. In Railway dashboard, click "New Service"
2. Search for "MongoDB"
3. Click "MongoDB" → "Provision"
4. Wait for it to provision (1-2 minutes)

### Step 4: Configure Environment Variables
1. Go to your service settings
2. Click "Variables"
3. Add these variables:
   ```
   PORT = 4000
   MONGO_URI = ${{ Mongo.MONGO_URL }}
   NODE_ENV = production
   ```
4. Railway automatically detects MongoDB connection string

### Step 5: Configure Build & Start Commands
1. In service settings, go to "Deploy"
2. Set these:
   ```
   Build Command: cd Backend && npm install
   Start Command: cd Backend && npm start
   ```
3. Set "Root Directory": ./

### Step 6: Deploy
1. Click "Deploy"
2. Monitor the logs
3. Your backend will be live at something like: https://e-lib-backend-production.railway.app

---

## PART 3: UPDATE FRONTEND TO USE DEPLOYED BACKEND

### Update Environment Variable
1. Go to your Vercel project
2. Settings → Environment Variables
3. Update `VITE_API_URL`:
   ```
   VITE_API_URL = https://e-lib-backend-production.railway.app/api
   ```
4. Redeploy (push a small change or click "Redeploy" in Vercel)

### Update Frontend API Service
Edit `Frontend/src/services/api.js`:
```javascript
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: baseURL,
});

export default api;
```

---

## ALTERNATIVE: Deploy Backend on Heroku (Paid but Popular)

If you prefer Heroku:

### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows/Linux
Visit: https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Create Heroku App
```bash
heroku login
heroku create e-lib-backend
```

### Step 3: Add MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Add to Heroku:
```bash
heroku config:set MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/elib"
heroku config:set PORT=4000
```

### Step 4: Deploy
```bash
git subtree push --prefix Backend heroku main
```

### Step 5: Check Logs
```bash
heroku logs --tail
```

---

## PART 4: UPDATE BACKEND FOR PRODUCTION

### Step 1: Add CORS for Vercel
Edit `Backend/server.js`:
```javascript
const cors = require("cors");

app.use(cors({
  origin: [
    "https://e-lib-frontend.vercel.app",  // Your Vercel frontend
    "http://localhost:5173"                // Keep for local testing
  ],
  credentials: true
}));
```

### Step 2: Update Environment Variables
Create `.env` file in Backend folder:
```
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/elib
NODE_ENV=production
```

### Step 3: Update File Upload Paths (if using Vercel)
**NOTE**: Vercel doesn't persist files between deployments. Use these alternatives:

**Option A: Use Cloudinary for Images**
1. Sign up: https://cloudinary.com
2. Install package: `npm install cloudinary multer-storage-cloudinary`
3. Update upload handler to use Cloudinary

**Option B: Use MongoDB to Store PDFs (Base64)**
- Store PDFs as Base64 in MongoDB
- When downloading, convert back to PDF

**Option C: Use AWS S3 for Files**
1. Create AWS account
2. Create S3 bucket
3. Use AWS SDK to upload files

For now, use **Option B** (simplest):

Edit `Backend/controllers/bookController.js`:
```javascript
// Store PDF as base64
const fs = require("fs");
const base64pdf = fs.readFileSync(req.files.pdf[0].path, 'base64');

await Book.create({
  title: req.body.title,
  author: req.body.author,
  pdfBase64: base64pdf,  // Store as base64
  // ... other fields
});

// When downloading:
app.get("/api/books/:id/download", async (req, res) => {
  const book = await Book.findById(req.params.id);
  const buffer = Buffer.from(book.pdfBase64, 'base64');
  res.download(buffer, `${book.title}.pdf`);
});
```

---

## PART 5: FINAL CHECKLIST

Before deploying to production:

### Frontend
- [ ] Update `VITE_API_URL` to backend URL
- [ ] Remove `console.log` statements
- [ ] Test all features work
- [ ] Check responsive design on mobile

### Backend
- [ ] Add CORS for frontend domain
- [ ] Set MongoDB connection string
- [ ] Add file upload solution (Cloudinary/AWS S3)
- [ ] Test all API endpoints
- [ ] Add environment variables for secrets

### Database
- [ ] Create MongoDB Atlas account
- [ ] Create cluster
- [ ] Whitelist IP address (or allow all: 0.0.0.0/0)
- [ ] Get connection string
- [ ] Add to backend .env

---

## QUICK START DEPLOYMENT COMMANDS

### For Railway (Recommended for Beginners)
```bash
# Just push to GitHub and Railway auto-deploys
git push origin main
```

### For Vercel Frontend
```bash
# Just connect GitHub repo and Vercel auto-deploys
# No commands needed!
```

### For MongoDB Atlas
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to Railway/Heroku environment variables

---

## TESTING AFTER DEPLOYMENT

### Test Frontend
1. Go to https://e-lib-frontend.vercel.app
2. Register a new account
3. Try to browse books
4. Try to borrow a book
5. Check if everything works

### Test Backend
```bash
# Test API endpoint
curl https://your-backend-url.com/api/books

# Should return all books
```

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Frontend can't connect to backend | Check CORS in backend, verify API URL in frontend |
| 503 Service Unavailable | Backend might be sleeping (free tier), wait 30s and try again |
| MongoDB connection failed | Check connection string, whitelist IP address |
| File uploads not working | Use Cloudinary or AWS S3 instead of local storage |
| Vercel build fails | Check build command, verify all dependencies in package.json |

---

## ENVIRONMENT VARIABLES NEEDED

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (Railway/Heroku)
```
PORT=4000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/elib
NODE_ENV=production
```

---

## FREE TIER LIMITS

| Service | Free Tier |
|---------|-----------|
| Vercel | 6GB bandwidth/month, unlimited deployments |
| Railway | $5 free credit/month (usually enough) |
| MongoDB Atlas | 512MB storage, shared cluster |
| Cloudinary | 10GB storage (for images) |

---

## NEXT STEPS

1. Deploy frontend to Vercel ✓
2. Deploy backend to Railway ✓
3. Set up MongoDB Atlas ✓
4. Connect them together ✓
5. Test all features ✓
6. Share your live URL with others! 🎉

---

## USEFUL LINKS

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Cloudinary: https://cloudinary.com/
- AWS S3: https://aws.amazon.com/s3/

---

## SUPPORT

If deployment fails:
1. Check the logs in Vercel/Railway dashboard
2. Verify all environment variables are set
3. Make sure GitHub repo is up to date
4. Try redeploying manually
5. Check that backend is running (`curl` to check)

Good luck deploying! 🚀
