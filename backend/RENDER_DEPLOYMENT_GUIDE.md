# 🚀 Render Deployment Guide for MSPN DEV Backend

This guide provides step-by-step instructions for deploying the FastAPI backend to Render.

---

## 📋 Prerequisites

1. **Render Account**: Sign up at https://render.com
2. **MongoDB Atlas**: Set up a MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
3. **GitHub Repository**: Your code must be in a GitHub repository
4. **Environment Variables**: Prepare your production environment variables

---

## 🗄️ Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster (Free tier is available)
3. Create a database user with username and password
4. Whitelist IP addresses:
   - Click "Network Access" → "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for Render
5. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string (format: `mongodb+srv://...`)
   - Replace `<password>` with your actual database password
   - Replace `<dbname>` with your database name (e.g., `mspn_dev_db`)

**Example Connection String:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mspn_dev_db?retryWrites=true&w=majority
```

---

## 🔧 Step 2: Create a New Web Service on Render

1. Log in to your Render dashboard: https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository:
   - Authorize Render to access your GitHub account
   - Select the repository containing your backend code
4. Configure the service:

### Basic Configuration

| Field | Value |
|-------|-------|
| **Name** | `mspn-dev-backend` (or your preferred name) |
| **Region** | Choose closest to your users |
| **Branch** | `main` (or your production branch) |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn server:app --host 0.0.0.0 --port $PORT` |

### Important Notes:
- ✅ **Root Directory**: Set to `backend` if your backend is in a `backend/` folder
- ✅ **Start Command**: This MUST be exactly `uvicorn server:app --host 0.0.0.0 --port $PORT`
- ✅ Render automatically provides the `$PORT` environment variable

---

## 🔐 Step 3: Configure Environment Variables

In your Render service settings, go to the **"Environment"** tab and add these variables:

### Required Environment Variables

| Key | Value | Example |
|-----|-------|---------|
| `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority` |
| `DB_NAME` | Your database name | `mspn_dev_db` |
| `CORS_ORIGINS` | Your frontend URL(s) | `https://your-app.vercel.app` |
| `SECRET_KEY` | Strong random secret key | `xK8nP2vM9qL5wR7tY3uZ6aB1cD4eF0gH` |

### How to Add Variables in Render:
1. In your web service, go to **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Enter the **Key** and **Value**
4. Click **"Save Changes"**

### Generate a Strong SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Multiple CORS Origins:
If you have multiple frontend domains, separate them with commas:
```
https://your-app.vercel.app,https://www.yourdomain.com,https://admin.yourdomain.com
```

---

## 🚀 Step 4: Deploy

1. After configuring all settings, click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Detect Python 3.11 (from `runtime.txt`)
   - Install dependencies (`pip install -r requirements.txt`)
   - Start the server (`uvicorn server:app --host 0.0.0.0 --port $PORT`)
3. Wait for the deployment to complete (usually 2-5 minutes)
4. Your backend will be available at: `https://your-service-name.onrender.com`

---

## ✅ Step 5: Verify Deployment

### Test Health Check Endpoint
```bash
curl https://your-service-name.onrender.com/
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "MSPN DEV API",
  "message": "Backend is running successfully"
}
```

### Test API Endpoint
```bash
curl https://your-service-name.onrender.com/api/
```

**Expected Response:**
```json
{
  "message": "MSPN DEV API is running",
  "status": "healthy"
}
```

---

## 🔄 Step 6: Configure Auto-Deploy

Render automatically redeploys your service when you push to your branch.

**To disable auto-deploy:**
1. Go to **"Settings"** tab
2. Scroll to **"Auto-Deploy"**
3. Toggle it off

**To manually deploy:**
1. Go to your service dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🌐 Step 7: Update Frontend Configuration

After deployment, update your frontend's environment variable:

**Vercel Environment Variables:**
```env
REACT_APP_BACKEND_URL=https://your-service-name.onrender.com/api
```

**Steps in Vercel:**
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add/Update `REACT_APP_BACKEND_URL`
4. Redeploy your frontend

---

## 📊 Monitoring and Logs

### View Logs
1. Go to your Render service dashboard
2. Click on **"Logs"** tab
3. You can see real-time logs and filter by time

### View Metrics
1. Go to **"Metrics"** tab
2. Monitor:
   - CPU usage
   - Memory usage
   - Response times
   - Request count

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Service Won't Start**
- ✅ Check logs for errors
- ✅ Verify `requirements.txt` has all dependencies
- ✅ Ensure `uvicorn` is in `requirements.txt`
- ✅ Check that start command is correct

#### 2. **MongoDB Connection Failed**
- ✅ Verify `MONGODB_URI` is correctly set
- ✅ Check MongoDB Atlas network access (whitelist 0.0.0.0/0)
- ✅ Ensure database user credentials are correct
- ✅ Check connection string format

#### 3. **CORS Errors in Frontend**
- ✅ Verify `CORS_ORIGINS` includes your Vercel frontend URL
- ✅ Must use HTTPS URLs in production
- ✅ No trailing slashes in URLs
- ✅ Check for typos in domain names

#### 4. **503 Service Unavailable**
- ✅ Check if service is sleeping (free tier sleeps after inactivity)
- ✅ First request after sleep takes 30-60 seconds
- ✅ Consider upgrading to paid plan to prevent sleeping

#### 5. **Environment Variables Not Working**
- ✅ Ensure no quotes around values in Render UI
- ✅ Click "Save Changes" after adding variables
- ✅ Redeploy after changing environment variables

---

## 💰 Pricing

### Free Tier
- ✅ 750 hours per month
- ✅ Sleeps after 15 minutes of inactivity
- ✅ Good for testing and low-traffic apps

### Paid Plans (Starter: $7/month)
- ✅ No sleeping
- ✅ Custom domains
- ✅ Better performance
- ✅ More resources

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** (already in `.gitignore`)
2. **Use strong `SECRET_KEY`** (generate random 32+ character string)
3. **Rotate secrets regularly** in production
4. **Use MongoDB Atlas with authentication** (never disable auth)
5. **Limit CORS origins** to only your domains (never use `*` in production)
6. **Enable MongoDB encryption** at rest (available in Atlas)
7. **Monitor logs** for suspicious activity
8. **Keep dependencies updated** regularly

---

## 📝 Additional Resources

- **Render Docs**: https://render.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Uvicorn Docs**: https://www.uvicorn.org

---

## 🎉 Success!

Your MSPN DEV backend is now deployed on Render!

**Your API Base URL:**
```
https://your-service-name.onrender.com/api
```

Remember to update this URL in your frontend's environment variables.

---

## 📞 Support

If you encounter issues:
1. Check Render logs first
2. Review this guide
3. Check Render's documentation
4. Contact Render support: https://render.com/support

---

**Last Updated**: December 2024
**Backend Version**: 1.0.0
