# SRI — Service Retirement Intelligence

> A premium administrative retirement computation platform.  
> Exact calendar arithmetic. International configuration. Institutional grade.

---

## Overview

Service Retirement Intelligence (SRI) is a production-grade retirement date computation platform built for HR professionals, administrative departments, and institutional systems. It uses exact calendar arithmetic — no 30-day-month approximations — to determine mandatory retirement dates with legal-grade precision.

---

## Business Rules

### Case 1 — Research Fellow
- **Retirement Date = DOB + Research Fellow Retirement Age** (default: 65)
- **This rule overrides all other service limits absolutely.**

### Case 2 — Standard Employee
- **Age Limit Date** = DOB + Retirement Age (default: 60)
- **Service Limit Date** = DOA + Service Cap (default: 35 years)
- **Retirement Date** = Earlier of the two dates
- Returns which rule triggered retirement

### Additional Computations
- **Service to Cutoff** = DOA → 30 June 2004 (configurable)
- **Total Service** = DOA → Retirement Date
- All durations returned as exact years, months, days

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| Dates | date-fns v3 |
| State | Zustand (localStorage persistence) |
| PDF | jsPDF |
| Deployment | Vercel |

---

## Project Structure

```
service-retirement-intelligence/
├── app/
│   ├── layout.tsx              # Root layout + metadata
│   ├── globals.css             # Design system CSS variables
│   ├── page.tsx                # Home page
│   ├── calculator/page.tsx     # Calculator page (client)
│   ├── settings/page.tsx       # Settings page
│   ├── about/page.tsx          # About page
│   ├── api/README.ts           # API scaffold (future Supabase)
│   └── not-found.tsx           # 404 page
│
├── components/
│   ├── branding/Logo.tsx       # SVG logotype component
│   ├── layout/Navbar.tsx       # Sticky navigation
│   ├── layout/Footer.tsx       # Site footer
│   ├── calculator/
│   │   ├── RetirementForm.tsx  # Input form (RHF + Zod)
│   │   ├── ResultsPanel.tsx    # Results display
│   │   └── StepGuide.tsx       # Onboarding modal
│   ├── settings/
│   │   └── SettingsPanel.tsx   # Country profiles + parameter editor
│   └── pdf/
│       └── ExportButton.tsx    # jsPDF export
│
├── lib/
│   ├── retirementEngine.ts     # Core computation logic
│   ├── dateEngine.ts           # Exact calendar arithmetic
│   ├── validation.ts           # Zod schemas
│   └── countryProfiles.ts      # International presets
│
├── store/
│   └── settingsStore.ts        # Zustand global state
│
└── public/
    └── logo.svg                # Monochrome SVG logo
```

---

## Local Development

```bash
# 1. Clone or download the project
git clone https://github.com/YOUR_USERNAME/service-retirement-intelligence.git
cd service-retirement-intelligence

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# → Open http://localhost:3000

# 4. Build for production (verify before deploy)
npm run build
npm run start
```

---

## Deployment to Vercel

### Step 1 — Create GitHub Repository

```bash
# In your project directory
git init
git add .
git commit -m "feat: initial SRI platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/service-retirement-intelligence.git
git push -u origin main
```

### Step 2 — Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Select your `service-retirement-intelligence` repository
4. Vercel auto-detects Next.js — click **"Deploy"**

### Step 3 — Environment Variables

This project has no required environment variables for the base deployment.

For future Supabase integration, add these in Vercel → Project → Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 4 — Custom Domain

1. In Vercel dashboard → Project → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `sri.yourinstitution.org`)
4. Follow DNS configuration instructions:
   - Add a `CNAME` record pointing to `cname.vercel-dns.com`
   - Or use Vercel's nameservers for full DNS management
5. SSL is provisioned automatically

### Step 5 — Enable Analytics

1. In Vercel dashboard → Project → **Analytics**
2. Enable **Vercel Analytics** (free tier available)
3. Add Speed Insights for Core Web Vitals monitoring

---

## Computation Verification

### Test Case 1 — Research Fellow
```
DOB: 1965-03-15
DOA: 1992-08-01
Research Fellow: YES
Config: RF Age = 65

Expected Retirement Date: 15 March 2030
Total Service: 37 years, 7 months, 14 days
```

### Test Case 2 — Age Limit Trigger
```
DOB: 1968-06-10
DOA: 1995-01-20
Research Fellow: NO
Config: Retirement Age = 60, Service Cap = 35

Age Limit Date:     10 June 2028
Service Limit Date: 20 January 2030

Retirement Date: 10 June 2028 (AGE_LIMIT)
```

### Test Case 3 — Service Limit Trigger
```
DOB: 1960-12-01
DOA: 1985-04-15
Research Fellow: NO
Config: Retirement Age = 60, Service Cap = 35

Age Limit Date:     01 December 2020
Service Limit Date: 15 April 2020

Retirement Date: 15 April 2020 (SERVICE_LIMIT)
```

---

## Future Architecture (Supabase-Ready)

The codebase is scaffolded for multi-user expansion:

```
app/api/
├── computations/
│   ├── route.ts          # POST: save, GET: list
│   └── [id]/route.ts     # GET: retrieve by ID
├── auth/
│   ├── login/route.ts
│   └── logout/route.ts
└── settings/
    └── route.ts          # GET/PUT user settings

lib/
├── supabase/
│   ├── client.ts         # Browser client
│   └── server.ts         # Server-side client
└── types/
    ├── database.ts       # Generated Supabase types
    └── roles.ts          # 'admin' | 'staff'
```

---

## License

MIT — Use freely for institutional, commercial, or educational purposes.

---

*Built with precision. Deployed with confidence.*  
*Service Retirement Intelligence — Exact Calendar Arithmetic.*
