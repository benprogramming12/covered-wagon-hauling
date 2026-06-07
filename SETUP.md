# Covered Wagon Hauling LLC — Setup Guide

## Step 1 — Install Node.js
Download from https://nodejs.org (LTS version). Run the installer with default settings.

## Step 2 — Open a terminal in this folder
- In Windows Explorer, navigate to the `covered-wagon-hauling` folder
- Click the address bar, type `powershell`, press Enter

## Step 3 — Install dependencies
```
npm install
```

## Step 4 — Set up your environment file
Copy `.env.example` to `.env`:
```
copy .env.example .env
```
Then open `.env` in Notepad and fill in:
- `ADMIN_EMAIL` — your email address (used to log into the dashboard)
- `ADMIN_PASSWORD` — a strong password you choose
- `NEXTAUTH_SECRET` — any long random string (smash your keyboard, e.g. `xK9mP2qL8nR5vT1wY7aB3cE6`)
- Stripe keys (see Step 6)
- Email/SMTP settings (optional, for notifications)

## Step 5 — Set up the database
```
npm run db:push
```

## Step 6 — Set up Stripe (for payments)
1. Go to https://stripe.com and create a free account
2. Go to Developers → API Keys
3. Copy your **Publishable key** (starts with `pk_test_`) → paste into `.env` as `STRIPE_PUBLISHABLE_KEY`
4. Copy your **Secret key** (starts with `sk_test_`) → paste into `.env` as `STRIPE_SECRET_KEY`
5. (After deploying) Set up a webhook at your deployed URL + `/api/stripe/webhook`

## Step 7 — Add your logo
Copy your logo image file to: `public/logo.png`

## Step 8 — Run locally
```
npm run dev
```
Open http://localhost:3000 to see your site.
Admin dashboard: http://localhost:3000/admin

## Step 9 — Deploy to Railway
1. Go to https://railway.app and sign up (free tier available)
2. Click "New Project" → "Deploy from GitHub repo"
   - Or use "Deploy from local" if you don't have GitHub
3. Add all your environment variables in Railway's dashboard
4. Set `NEXTAUTH_URL` to your Railway URL (e.g. https://covered-wagon.up.railway.app)
5. Railway will auto-deploy on every push

## Step 10 — Connect your GoDaddy domain
1. In Railway, go to Settings → Domains → Add Custom Domain
2. Enter your GoDaddy domain
3. Railway gives you a CNAME record
4. In GoDaddy DNS settings, add that CNAME record
5. Done! (Takes up to 24 hours to propagate)

## How the payment flow works
1. Customer submits a quote request on your website
2. You log into /admin and see the new request
3. You enter a total price and click "Send Deposit Request"
4. Customer gets an email with a secure Stripe link to pay 50%
5. After they pay, status updates to "Deposit Paid ✓"
6. You do the job
7. You log in and click "Collect Balance" — their saved card is charged automatically
8. Done! Both of you get confirmation.
