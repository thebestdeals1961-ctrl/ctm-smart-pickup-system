# CTM Smart Pickup - Setup Guide

## Quick Start

Follow these steps to get the system running locally.

---

## Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Supabase Account** (free) - [Sign up](https://supabase.com/)
- **Code Editor** (VS Code recommended)

---

## Step 1: Get the Code

If you cloned from GitHub:
```bash
git clone <your-repo-url>
cd ctm-smart-pickup
```

Or if you have the folder directly, just open it in your terminal.

---

## Step 2: Set Up the Database

**IMPORTANT:** You must create your own Supabase database. We do NOT create it automatically.

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Follow the instructions in `docs/DATABASE_SCHEMA.md` to:
   - Create all 4 tables (`users`, `drivers`, `passengers`, `rides`)
   - Get your API keys
   - Create your first admin user

### Option A: Manual Setup (Recommended for learning)
Follow `docs/DATABASE_SCHEMA.md` step by step to understand the system.

### Option B: Quick Seed (For testing)
After creating tables and setting up `.env`:
```bash
cd backend
npm install
npm run seed
```
This creates demo users, drivers, and passengers automatically.

**Demo credentials after seeding:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ctm.com | admin123 |
| Dispatcher | dispatcher@ctm.com | dispatcher123 |
| Driver | driver1@ctm.com | driver123 |
| Passenger | passenger1@ctm.com | passenger123 |

---

## Step 3: Configure the Backend

```bash
cd backend
```

### 3.1 Install dependencies
```bash
npm install
```

### 3.2 Create environment file
```bash
cp .env.example .env
```

### 3.3 Edit `.env` with your Supabase credentials
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=make-up-a-random-secret-string-here
FRONTEND_URL=http://localhost:3000
```

### 3.4 Start the backend
```bash
npm run dev
```

You should see:
```
==================================
  CTM SMART PICKUP SYSTEM
  Backend Server Running
  Port: 5000
==================================
```

The backend is now running at `http://localhost:5000`

---

## Step 4: Configure the Frontend

Open a **new terminal** window (keep the backend running):

```bash
cd frontend
```

### 4.1 Install dependencies
```bash
npm install
```

### 4.2 Create environment file (optional for local)
```bash
cp .env.example .env.local
```

### 4.3 Start the frontend
```bash
npm start
```

This will open your browser at `http://localhost:3000`

---

## Step 5: First Login

1. Go to `http://localhost:3000`
2. Login with your admin credentials
3. Default demo credentials (if you used the seed script):
   - Email: `admin@ctm.com`
   - Password: `admin123`

---

## Project Structure

```
ctm-smart-pickup/
├── backend/
│   ├── src/
│   │   ├── index.js          # Server entry point
│   │   ├── routes/           # API routes
│   │   │   ├── auth.js       # Login/register
│   │   │   ├── users.js      # User management
│   │   │   ├── drivers.js    # Driver management
│   │   │   ├── passengers.js # Passenger management
│   │   │   ├── rides.js      # Ride CRUD & dispatch
│   │   │   └── dashboard.js  # Analytics
│   │   ├── middleware/       # Auth middleware
│   │   └── utils/            # Supabase client, JWT helpers
│   ├── seed.js               # Database seed script
│   ├── vercel.json           # Vercel deployment config
│   ├── .env.example          # Environment template
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main app with routing
│   │   ├── App.css           # Global styles
│   │   ├── components/       # Layout, shared components
│   │   ├── pages/            # Dashboard, Rides, Drivers, etc.
│   │   └── hooks/            # useAuth, useApi
│   ├── public/
│   ├── .env.example          # Frontend env template
│   ├── .gitignore
│   └── package.json
└── docs/
    ├── DATABASE_SCHEMA.md
    ├── SETUP_GUIDE.md
    └── API_DOCUMENTATION.md
```

---

## Common Commands

| Command | Description |
|---------|-------------|
| `cd backend && npm run dev` | Start backend in development mode |
| `cd backend && npm start` | Start backend in production mode |
| `cd backend && npm run seed` | Seed database with demo data |
| `cd frontend && npm start` | Start frontend development server |
| `cd frontend && npm run build` | Build frontend for production |

---

## Deploying to Production

### Backend (Vercel, Railway, Render, etc.)

1. Push your code to GitHub
2. Connect your GitHub repo to your hosting platform
3. Set environment variables in the platform dashboard
4. Deploy!

**For Vercel:** The `vercel.json` file is already configured.

### Frontend (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Set the root directory to `frontend`
4. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.com/api`
5. Deploy!

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Supabase credentials missing" | Check your `.env` file has correct URL and keys |
| "Failed to create user" | Check table columns match exactly |
| "Foreign key violation" | Make sure referenced records exist first |
| "Permission denied" | Check RLS policies or use service_role key |
| "Cannot connect to backend" | Make sure backend is running on port 5000 |
| "CORS error" | Check `FRONTEND_URL` in backend `.env` matches your frontend URL |

---

## Need Help?

- Check `docs/DATABASE_SCHEMA.md` for database setup details
- Check `docs/API_DOCUMENTATION.md` for API reference
- Check the backend console for error messages
- Make sure your Supabase project is active and tables are created
- Ensure your `.env` file has the correct credentials

---

## You Own Everything

- ✅ All code is yours
- ✅ No platform lock-in
- ✅ Deploy anywhere
- ✅ Modify freely
- ✅ No hidden fees
