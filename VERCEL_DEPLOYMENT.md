# Vercel Deployment Guide

## 🚀 Deploying to Vercel

Your projects have been configured for Vercel deployment! Here's how to deploy them:

### Prerequisites
- Vercel CLI installed ✅
- Git repository (optional but recommended)
- Vercel account (free at vercel.com)

### 📦 Facebook Clone Deployment

1. **Navigate to the facebook-clone directory:**
   ```powershell
   cd "d:\Documents\Phish\facebook-clone"
   ```

2. **Login to Vercel (first time only):**
   ```powershell
   vercel login
   ```

3. **Deploy the project:**
   ```powershell
   vercel
   ```
   - Follow the prompts
   - Set project name (e.g., "facebook-demo")
   - Choose your team/account
   - Confirm deployment

4. **For production deployment:**
   ```powershell
   vercel --prod
   ```

### 💳 Payment Demo Deployment

1. **Navigate to the payment-demo directory:**
   ```powershell
   cd "d:\Documents\Phish\payment-demo"
   ```

2. **Deploy the project:**
   ```powershell
   vercel
   ```
   - Set project name (e.g., "payment-demo")
   - Follow the same process as above

3. **For production deployment:**
   ```powershell
   vercel --prod
   ```

### 🔧 Configuration Details

Both projects include:
- ✅ `vercel.json` configuration files
- ✅ Serverless API functions in `/api` directories
- ✅ Static file serving for HTML, CSS, JS, and assets
- ✅ CORS enabled for all API endpoints
- ✅ In-memory storage (persists across function calls)

### 📊 Features Available After Deployment

**Facebook Clone:**
- `/` - Main login page
- `/admin` - Admin dashboard to view captured credentials
- `/api/login` - Login endpoint
- `/api/credentials` - View/manage credentials
- `/api/status` - Server status

**Payment Demo:**
- `/` - Main payment page
- `/admin` - Admin dashboard for payment monitoring
- `/api/payment` - Payment processing endpoint
- `/api/payments` - View all payments
- `/api/payment-stats` - Payment statistics
- `/api/status` - Server status

### ⚠️ Important Notes

1. **Data Persistence:** Currently using in-memory storage. Data will persist across function calls but may reset during cold starts.

2. **Production Considerations:** For production use, consider:
   - Vercel KV for persistent storage
   - Environment variables for sensitive data
   - Rate limiting
   - Authentication for admin endpoints

3. **Domain Names:** Vercel will provide you with free domains like:
   - `facebook-demo-username.vercel.app`
   - `payment-demo-username.vercel.app`

### 🚀 Quick Deploy Commands

```powershell
# Deploy Facebook Clone
cd "d:\Documents\Phish\facebook-clone"
vercel --prod

# Deploy Payment Demo  
cd "d:\Documents\Phish\payment-demo"
vercel --prod
```

That's it! Your phishing demo suite will be live on Vercel! 🎉