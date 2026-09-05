# Orixs Sign-Up, Login & Pricing Flow: Complete Implementation Plan

**Date**: September 2, 2026
**Author**: Development Team
**Status**: Planning (no changes made yet)

---

## 1. Current State Analysis

### 1.1 What Exists Today

| Component | Location | Status |
|-----------|----------|--------|
| **Marketing website** | orixs.io (this Next.js project: `orixs-web`) | Live, recently redesigned |
| **Business app** | dev.orixs.io | Separate app, has basic login page |
| **Insurance app** | insurance.orixs.io | Separate app, has basic login page |
| **Construction app** | construction.orixs.io | Separate app, has basic login page |
| **Backend API** | master.orixs.io | Live, handles plans + client creation |
| **Pricing page** | orixs.io/pricing (currently hidden from navbar) | Functional but hidden |
| **CMS login** | orixs.io/cmsuser/login | Internal only, works |

### 1.2 Current "Get Started" Flow (Broken)

```
User clicks "Get Started with Business" on Use Cases page
        ↓
Opens NewsletterModal (WhatsApp-based contact form)
        ↓
Dead end. No connection to product apps.
```

**Every CTA button** across the site (Navbar "Explore Now", Homepage "Get Started", Use Cases "Get Started with [Industry]", Case Studies CTA, Blog CTA) currently opens the same `NewsletterModal` component. This modal sends a WhatsApp message with contact details. It does NOT:
- Create an account
- Connect to any product app
- Initiate a subscription

### 1.3 External Login Pages (Not In This Codebase)

The three product login pages shown in the screenshots:
- `dev.orixs.io/login` (purple button: "Log In →")
- `insurance.orixs.io/login` (blue button: "Log In")
- `construction.orixs.io/login` (blue button: "Log In →")

**These are separate applications, NOT part of this orixs-web codebase.** They have:
- Basic UI with Orixs logo, email/password fields, "Forgot password", "Stay logged in"
- No sign-up flow, no pricing, no "Continue for Free" option
- Inconsistent branding (different button colors, different arrow styles)

### 1.4 Existing Backend Infrastructure (Already Working)

| API Endpoint | Purpose | Status |
|-------------|---------|--------|
| `GET /api/masterplans/grouped-by-platform` | Fetch all plans grouped by industry (RINI/Insurance/Construction/Scene One/Intern Africa) | Working |
| `POST /api/master-clients` | Create a new client (company signup + admin user + plan selection) | Working |
| Razorpay payment integration | Handles paid subscriptions, returns payment links | Working |

**Existing pricing data structure** (from API):
- Plans per platform: Startup Plan, Business Pro, Enterprise
- Multi-currency: USD, INR, GBP, ZAR
- Billing periods: Monthly, Yearly (with discount support)
- Free trial support: trial days, trial user limits, trial AI credit limits
- License-based pricing with min/max limits

### 1.5 Existing Pricing Page (`/pricing`)

A fully functional pricing page already exists at `app/pricing/page.tsx` with:
- Tab navigation for all 5 platforms (Orixs, Insurance, Intern Africa, Construction, Scene One)
- Currency selector (USD, INR, GBP, ZAR)
- Billing period toggle (Monthly/Yearly)
- Plan cards with features, pricing, discounts, free trial badges
- Click a plan → PricingForm modal with: company details, admin details (name, email, password), country/state/pincode, timezone, website, billing, license count
- Submits to `POST /api/master-clients` → returns Razorpay payment link → redirects to payment

**This page is currently hidden from the navbar** (commented out in `Navbar.tsx`).

---

## 2. Investor Requirements (What Needs to Change)

Based on investor direction, the desired flow is:

```
"Get Started with [Industry]" button
        ↓
Navigate to a proper Sign-Up page (not a modal/panel)
        ↓
Sign-Up page shows:
  - Create account form (name, email, password)
  - "Continue for Free" (prominent, unlimited access)
  - Paid plan options with pricing
        ↓
On Free Plan signup:
  - Account created in backend
  - Redirect to product app (dev.orixs.io / insurance.orixs.io / construction.orixs.io)
  - User can log in and access everything
        ↓
On Paid Plan signup:
  - Account created in backend
  - Razorpay payment flow
  - After payment, redirect to product app
```

### Investor's Key Points:
1. No newsletter panel, no modal. Navigate to a full page.
2. Sign-up AND login on the same page (tabs or toggle).
3. Sign-up must show "Continue for Free" prominently.
4. After sign-up, show pricing with free plan as a visible option.
5. Free plan = unlimited access (for now, as a growth strategy).
6. Everything must connect to backend and DB properly.
7. Consistent, premium UI matching the approved Use Cases page design.
8. Must work end-to-end: signup → DB → login → access.

---

## 3. Recommended Implementation Plan

### Phase 1: orixs.io Sign-Up & Pricing Pages (This Codebase)

#### 3.1 Create Industry-Specific Sign-Up Pages

**New route**: `/get-started/[industry]`
- `/get-started/business` → Business Operations signup
- `/get-started/insurance` → Insurance signup
- `/get-started/construction` → Construction signup

**Page layout** (premium design, matching Use Cases page):

```
┌─────────────────────────────────────────────────┐
│  Navbar                                          │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌─── Left Column (50%) ──────────────────────┐ │
│  │  Industry branding + value proposition      │ │
│  │  "Start running your business with Orixs"   │ │
│  │  Key benefits (3-4 bullet points)           │ │
│  │  Trust signals ("No credit card required")  │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌─── Right Column (50%) ─────────────────────┐ │
│  │  [ Sign Up ] [ Log In ]  ← tab toggle       │ │
│  │                                              │ │
│  │  Sign Up form:                               │ │
│  │    Full Name                                 │ │
│  │    Work Email                                │ │
│  │    Password                                  │ │
│  │    Company Name                              │ │
│  │                                              │ │
│  │  [  Continue for Free  ]  ← primary CTA     │ │
│  │  "Unlimited access. No credit card needed."  │ │
│  │                                              │ │
│  │  ── or choose a plan ──                      │ │
│  │                                              │ │
│  │  ┌─Free──┐ ┌─Startup─┐ ┌─Business Pro─┐    │ │
│  │  │ $0/mo │ │ $19/mo  │ │   $49/mo     │    │ │
│  │  │Unlim. │ │ ...     │ │   ...        │    │ │
│  │  └───────┘ └─────────┘ └──────────────┘    │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Footer                                          │
└─────────────────────────────────────────────────┘
```

**Log In tab** (when toggled):

```
│  [ Sign Up ] [ Log In ]  ← tab toggle       │
│                                              │
│  Log In form:                                │
│    Email Address                             │
│    Password                                  │
│    [ ] Remember me                           │
│    Forgot password?                          │
│                                              │
│  [  Log In  ]  ← primary CTA                │
│                                              │
│  Don't have an account? Sign up              │
```

#### 3.2 Update All CTA Buttons Across the Site

| Current Button | Current Action | New Action |
|---------------|---------------|------------|
| **Use Cases page**: "Get started with Business Operations" | `setShowModal(true)` → NewsletterModal | `router.push('/get-started/business')` |
| **Use Cases page**: "Get started with Insurance" | `setShowModal(true)` → NewsletterModal | `router.push('/get-started/insurance')` |
| **Use Cases page**: "Get started with Construction" | `setShowModal(true)` → NewsletterModal | `router.push('/get-started/construction')` |
| **Homepage Industries section**: "Get Started" | `setShowModal(true)` → NewsletterModal | Navigate to `/get-started/[active-industry]` |
| **Use Cases page hero**: "Request a demo" | `setShowModal(true)` → NewsletterModal | Keep as demo request OR redirect to signup |
| **CTA banners** (Case Studies, Blog): "Get started free" | `setShowModal(true)` → NewsletterModal | `router.push('/get-started/business')` (default) |
| **Navbar**: "Explore Now" | `setShowModal(true)` → NewsletterModal | Navigate to `/get-started/business` or show industry picker |

**Files to modify**:
- `components/UseCasesSection.tsx` (lines 179-184)
- `components/IndustriesNavSection.tsx` (lines 183-188)
- `app/use-cases/page.tsx` (hero CTA buttons)
- `app/case-studies/page.tsx` (CTA banner buttons)
- `app/blogs/page.tsx` (CTA banner buttons)
- `components/Navbar.tsx` (Explore Now button)
- `components/HeroSection.tsx` (homepage hero CTA)

#### 3.3 Backend Integration for Free Plan

The existing `POST /api/master-clients` endpoint already handles client creation. For the free plan flow:

1. **Check if a "Free" plan exists in the API response**: The backend returns plans grouped by platform. If there is no free plan in the backend, one needs to be created.

2. **Free plan signup flow**:
   ```
   User fills: name, email, password, company name
   → POST /api/master-clients with:
     - plan_id: [free plan ID]
     - price: 0
     - licenses_limit: [unlimited or max]
     - allow_free_trial: 1
     - Other required fields (country, etc. - can be simplified for free)
   → Backend creates company + admin user
   → Response: { master_client_id, user_id }
   → Redirect to product app login page
   ```

3. **Paid plan signup flow** (existing, already works):
   ```
   User fills all details + selects paid plan
   → POST /api/master-clients
   → Backend returns Razorpay payment_link
   → Redirect to Razorpay
   → After payment, redirect back to /pricing/[status]/[payment_id]
   → Then redirect to product app
   ```

#### 3.4 Product App Redirect URLs

After successful signup, redirect to the correct product:

| Industry | Redirect URL |
|----------|-------------|
| Business (RINI) | `https://dev.orixs.io/login` |
| Insurance | `https://insurance.orixs.io/login` |
| Construction | `https://construction.orixs.io/login` |

The user would then log in with the admin email/password they just created.

### Phase 2: Product App Login/Signup Page Redesign (Separate Codebases)

> **Important**: This requires access to the dev.orixs.io, insurance.orixs.io, and construction.orixs.io codebases, which are NOT part of this orixs-web project.

#### What needs to happen in each product app:

1. **Redesign login page** with:
   - Proper Orixs logo (consistent with orixs.io)
   - Purple-themed UI matching orixs.io brand
   - Clean, modern form design
   - "Forgot password" functionality
   - "Don't have an account? Sign up at orixs.io" link back to marketing site

2. **Add sign-up redirect**: Since sign-up happens on orixs.io, the product apps should link back to orixs.io/get-started/[industry] for new users.

3. **Consistent branding**: Same purple accent color (#7C3AED / purple-600), same logo, same font system across all three apps.

---

## 4. Detailed File Changes (Phase 1 Only - This Codebase)

### New Files to Create

| File | Purpose |
|------|---------|
| `app/get-started/[industry]/page.tsx` | Main signup/login page per industry |
| `components/SignUpForm.tsx` | Reusable signup form component |
| `components/LoginForm.tsx` | Reusable login form component |
| `components/PlanSelector.tsx` | Free + paid plan selector component |

### Files to Modify

| File | Change |
|------|--------|
| `components/UseCasesSection.tsx` | Replace `setShowModal(true)` with `router.push(...)` |
| `components/IndustriesNavSection.tsx` | Replace `setShowModal(true)` with navigation |
| `app/use-cases/page.tsx` | Update hero CTAs |
| `app/case-studies/page.tsx` | Update CTA banner buttons |
| `app/blogs/page.tsx` | Update CTA banner buttons |
| `components/Navbar.tsx` | Update "Explore Now" button action |
| `components/HeroSection.tsx` | Update homepage hero CTA |

### Files to Keep Unchanged
| File | Reason |
|------|--------|
| `components/NewsletterModal.tsx` | Keep for newsletter subscription (different purpose) |
| `components/modal/PartnerModal.tsx` | Keep for partner signups |
| `app/pricing/page.tsx` | Keep as standalone pricing reference page |
| `components/form/pricingForm.tsx` | Reuse logic for signup form |

---

## 5. Pricing Structure Recommendation

### Recommended Plan Tiers

| Plan | Price | Target | What They Get |
|------|-------|--------|---------------|
| **Free** | $0/mo | New users, small teams | Unlimited access to all features (current strategy) |
| **Startup** | $19-39/mo (varies by industry) | Growing businesses | Same features + priority support + higher limits |
| **Business Pro** | $49-99/mo (varies by industry) | Established companies | Everything + dedicated support + advanced analytics |
| **Enterprise** | Custom | Large organizations | Custom SLAs, dedicated infra, on-premise option |

### Free Plan Strategy

The investor wants free plan = unlimited access for now. This is a **growth-first strategy**:

- **Now**: Free plan gives full access to drive adoption
- **Later**: When user base grows, introduce limits (users, storage, API calls, AI credits) on the free tier
- **Conversion path**: Users who exceed limits naturally upgrade

### Important Backend Consideration

The free plan needs to exist in the backend's plan database (`masterplans` table). If it does not exist yet:
- Either create it via the backend admin panel
- Or submit with `price: 0` and handle it as a special case in the API

For the free plan, the signup flow should be simplified:
- **Required**: Name, Email, Password, Company Name
- **Optional/Auto-filled**: Country (detect from IP or ask), Timezone (detect from browser)
- **NOT needed for free**: Payment, billing period, license count (unlimited)

---

## 6. UI/UX Design Specifications

### Sign-Up Page Design System

Matching the approved Use Cases page premium design:

- **Background**: White with subtle purple radial gradient
- **Left panel**: Industry-specific hero content with gradient text, trust badges
- **Right panel**: Clean white card with rounded corners, subtle shadow
- **Primary CTA**: Purple-600 (#7C3AED) solid button, "Continue for Free"
- **Secondary CTAs**: White with purple border for paid plans
- **Typography**: System font stack (matching rest of site), bold headings
- **Animations**: Framer Motion entrance animations (fade-up on load)
- **Responsive**: Single column on mobile, two columns on desktop
- **Logo**: Consistent Orixs logo from `/worksuite-logo.jpeg`

### Tab Toggle (Sign Up / Log In)

```css
/* Active tab */
bg-purple-600 text-white rounded-lg shadow

/* Inactive tab */
bg-transparent text-gray-500 hover:text-gray-700
```

### Plan Cards in Signup

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   ★ FREE     │  │   STARTUP    │  │ BUSINESS PRO │
│              │  │              │  │ Recommended  │
│    $0/mo     │  │   $19/mo     │  │   $49/mo     │
│              │  │              │  │              │
│ ✓ All feat.  │  │ ✓ All feat.  │  │ ✓ All feat.  │
│ ✓ Unlimited  │  │ ✓ Priority   │  │ ✓ Dedicated  │
│              │  │   support    │  │   support    │
│              │  │              │  │ ✓ Analytics  │
│              │  │              │  │              │
│[Get Started] │  │[Get Started] │  │[Get Started] │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 7. Implementation Order (Recommended Sequence)

### Step 1: Create the Signup/Login Page (orixs-web)
- Build `app/get-started/[industry]/page.tsx` with 2-step form
- Step 1: Name, Email, Password, Company Name + "Continue for Free" CTA
- Step 2: Country, State, Pincode, Phone, Website (Timezone auto-detected)
- Tab toggle: Sign Up / Log In
- Log In tab: email + password, submit to product app login URL directly
- Include plan cards (Free trial via plan_id:1 + paid plans from API)
- Wire up to `POST /api/master-clients` with all 17 required fields
- After success: redirect to product app login with success message

### Step 2: Update All CTA Buttons (orixs-web)
- Replace `setShowModal(true)` with `router.push('/get-started/[industry]')` in:
  - `components/UseCasesSection.tsx` (line 180)
  - `components/IndustriesNavSection.tsx` (line 185)
  - `app/use-cases/page.tsx` (hero CTAs)
  - `app/case-studies/page.tsx` (CTA banner)
  - `app/blogs/page.tsx` (CTA banner)
  - `components/Navbar.tsx` ("Explore Now" → `/get-started/business`)
- Keep NewsletterModal only for newsletter/footer subscriptions

### Step 3: Customize Product App Login Pages (Laravel on server)
- Add `login-custom.css` to `/var/www/dev/public/css/`, `/var/www/insurance/public/css/`, `/var/www/construction/public/css/`
- Purple branding: purple header, purple login button, consistent Orixs logo
- Enable `allow_client_signup` in GlobalSetting so register page link shows
- Add "New here? Sign up at orixs.io/get-started" link on login page
- Update logo files in `/public/img/logo.png` to match orixs.io branding

### Step 4: Deploy and Test End-to-End
- Build orixs-web locally, verify no errors
- SCP to server, build as kpyxal, PM2 reload
- Test: orixs.io/get-started/business → fill form → backend creates account → redirect to dev.orixs.io/login → login with created credentials → access app
- Repeat for insurance and construction

---

## 8. Investigated Answers (Verified from Backend & Server)

### Q1: Does a free ($0) plan exist in the backend?
**Answer: NO.** The API (`GET /api/masterplans/grouped-by-platform`) returns these plans:

| Platform | Plans | Lowest Price |
|----------|-------|-------------|
| **rini-dev** (Business) | Basic ($1000), Advance ($3000), Premium ($5000) | $1000/mo |
| **rini-construction** | Advance ($1000), Premium ($5000) | $1000/mo |
| **rini-insurance** | Premium ($1000) | $1000/mo |
| **rini-talent** (Entertainment) | Premium ($1000) | $1000/mo |
| **rini-intern-africa** | Premium ($998) | $998/mo |

**Recommendation**: We handle the free plan on the frontend. When user picks "Free", we still call `POST /api/master-clients` with `price: 0` and `allow_free_trial: 1`. The Basic plan for Business (id: 1) already has `free_trial: 1` with 30 days, 100 users, 100 AI credits. We can use that plan ID with `price: 0` to create a free-tier account, OR we skip plan selection entirely and let the backend create a default/trial account. The simplest path: submit with `plan_id: 1` (Basic) and rely on the existing free trial mechanism (30 days free).

### Q2: Can free signups use a simplified form?
**Answer: NO, the backend requires all 17 fields.** Tested with an empty POST, the validation response demands:

| Required Fields |
|----------------|
| company_name, company_email, website, country, state, pincode, timezone, language, status, admin_name, admin_email, admin_password, admin_mobile_number, business_mobile_number, role, start_date, licenses_limit |

**Recommendation**: We build a **2-step signup form**:
- **Step 1** (quick): Name, Email, Password, Company Name (feels simple and fast)
- **Step 2** (details): Country, State, Pincode, Phone, Website, Timezone (auto-detect timezone from browser, auto-fill where possible)

This way the user's first impression is "4 fields, easy!" but we collect everything the backend needs. We auto-fill: `language: "en"`, `status: "active"`, `role: "admin"`, `start_date: today`, `licenses_limit: 100`, `timezone: detected`.

### Q3: After signup, auto-login or redirect to login page?
**Answer: Redirect to login page with success message.** The product apps (Laravel) have their own session-based auth. However, there IS a token-based login endpoint: `GET /ai/login-with-token` on dev.orixs.io. If the master-clients API returns a login token, we could potentially auto-redirect. But the safest and most reliable approach is:
- Show success message: "Account created! You can now log in."
- Redirect to `dev.orixs.io/login` (or insurance/construction equivalent)
- The user logs in with the admin email + password they just created

### Q4: Do we have access to the product app codebases?
**Answer: YES.** All three are Laravel apps on the same production server:

| App | Server Path | Auth Views |
|-----|------------|------------|
| **Business** | `/var/www/dev/` | `resources/views/auth/login.blade.php` (263 lines), `register.blade.php` (116 lines) |
| **Insurance** | `/var/www/insurance/` | Same structure, same auth views |
| **Construction** | `/var/www/construction/` | Same structure, same auth views |

They share a common `<x-auth>` layout component. The login pages support social auth (Google, Facebook, Twitter, LinkedIn), email/password login, "Stay logged in", and password toggle. The register page has: Name, Email, Password, Company Name. Login page theming is configurable via `GlobalSetting` (auth_theme, logo_background_color). Currently: `auth_theme: "light"`, `global_app_name: "RINI"`, `allow_client_signup: null` (signup might be disabled).

**We can customize these login pages** by:
1. Editing the Blade templates directly on the server
2. Adding a `login-custom.css` file (the layout already checks for and loads it)
3. Updating `GlobalSetting` values (logo_background_color, auth_theme, company_name)

### Q5: Navbar "Explore Now" behavior?
**Recommendation**: Navigate to `/get-started/business` as the default (Business is the flagship product). On the /get-started page itself, include an industry switcher so users can change to Insurance or Construction.

---

## 9. Technical Architecture

### API Flow Diagram

```
orixs.io/get-started/business
        │
        ├── Fetch plans: GET master.orixs.io/api/masterplans/grouped-by-platform
        │   └── Returns: plans for RINI (Business) with pricing per currency
        │
        └── On signup: POST master.orixs.io/api/master-clients
            ├── Free plan: { plan_id: X, price: 0, ... }
            │   └── Response: { master_client_id, user_id }
            │       └── Redirect to: dev.orixs.io/login
            │
            └── Paid plan: { plan_id: Y, price: 19, ... }
                └── Response: { payment_link: "https://rzp.io/..." }
                    └── Redirect to Razorpay
                        └── After payment: /pricing/[status]/[payment_id]
                            └── Redirect to: dev.orixs.io/login
```

### Industry-to-Platform Mapping

| URL Param | Platform API Key | Product App URL |
|-----------|-----------------|-----------------|
| `business` | `RINI` | `dev.orixs.io` |
| `insurance` | `Insurance` | `insurance.orixs.io` |
| `construction` | `Construction` | `construction.orixs.io` |

### Existing Code to Reuse

| Component/File | What to Reuse |
|---------------|---------------|
| `hooks/api/usePricing.tsx` | Fetch plans from API |
| `lib/api/tanstack/pricingApi.tsx` | Submit signup to master-clients |
| `lib/interface/pricing.tsx` | TypeScript interfaces |
| `lib/utils/convertApiToPricingData.ts` | Transform API response |
| `lib/config/axiosInstance.tsx` | Axios instance with base URL |
| `components/form/pricingForm.tsx` | Form validation logic (password, phone, pincode) |
```

---

## Appendix: Key File Paths Reference

```
Project root: C:\Users\user\Desktop\Orixs\orixs-web

# Pages
app/use-cases/page.tsx          # Use Cases page (hero + CTAs)
app/case-studies/page.tsx       # Case Studies page (CTA banner)
app/blogs/page.tsx              # Blog page (CTA banner)
app/pricing/page.tsx            # Existing pricing page (hidden)
app/page.tsx                    # Homepage
app/cmsuser/login/page.tsx      # CMS login (internal)

# Components with CTAs to update
components/UseCasesSection.tsx   # "Get started with [Industry]" button
components/IndustriesNavSection.tsx # "Get Started" button
components/Navbar.tsx            # "Explore Now" button
components/HeroSection.tsx       # Homepage hero CTA
components/NewsletterModal.tsx   # Current modal (to be replaced in CTAs)

# Backend integration
lib/config/axiosInstance.tsx     # Axios: master.orixs.io/api
hooks/api/usePricing.tsx         # Fetch plans
lib/api/tanstack/pricingApi.tsx  # POST master-clients
lib/interface/pricing.tsx        # TypeScript interfaces
lib/utils/convertApiToPricingData.ts # Transform API data
components/form/pricingForm.tsx  # Existing form (validation logic to reuse)

# Config
.env                            # NEXT_PUBLIC_BACKEND_URL=https://master.orixs.io/
next.config.js                  # assetPrefix for production
```
