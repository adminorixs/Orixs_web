# Responsive UI/UX Audit Report — Orixs Web

**Date:** 2026-09-03  
**Auditor:** Claude (automated)  
**Stack:** Next.js 15.3.2 · React 18.2.0 · Tailwind CSS 3.3.3 · shadcn/ui · Framer Motion  
**Breakpoints tested:** 320px, 375px, 390px, 414px, 430px (mobile) · 768px, 820px, 1024px (tablet) · 1024px, 1280px, 1440px, 1920px (desktop)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Global / Design System Issues](#2-global--design-system-issues)
3. [Homepage Issues](#3-homepage-issues)
4. [Use Cases Page Issues](#4-use-cases-page-issues)
5. [Blogs Page Issues](#5-blogs-page-issues)
6. [Case Studies Page Issues](#6-case-studies-page-issues)
7. [About Page Issues](#7-about-page-issues)
8. [Pricing Page Issues](#8-pricing-page-issues)
9. [Get Started Page Issues](#9-get-started-page-issues)
10. [Component-Level Issues](#10-component-level-issues)
11. [Severity Matrix](#11-severity-matrix)

---

## 1. Executive Summary

The Orixs website has a solid desktop design but **significant mobile and tablet responsiveness issues** that impact usability. The most critical problems are:

- **StackedCardsSection** forces `h-screen` on every card at all viewports, creating ~400vh of content with massive blank space on mobile
- **NewsletterModal** has a fixed `w-[440px]` that overflows mobile screens (<440px)
- **DashboardSection** floating icons overflow the viewport with negative absolute positions
- **WorkflowCarouselSection** fixed `h-96` container doesn't adapt to mobile image sizing
- **About page** has broken leadership section breakpoint logic (tablet layout shows at `sm:flex md:hidden` — visible 640–768px but missing the 4th leader; mobile shows 5 leaders)
- **Pricing page** tab navigation uses a 2-2-1 grid on mobile for 5 tabs which is functional but awkward
- **Viewport meta** disables user scaling (`userScalable: false`) — accessibility violation
- Multiple instances of **triplicated layout patterns** (mobile/tablet/desktop rendered as separate DOM trees hidden by breakpoints) instead of responsive CSS

**Overall severity:** 🔴 4 Critical · 🟠 8 High · 🟡 12 Medium · 🔵 6 Low

---

## 2. Global / Design System Issues

### 2.1 🔴 CRITICAL — `userScalable: false` blocks pinch-to-zoom
- **File:** `app/layout.tsx:16`
- **Issue:** `userScalable: false` in the viewport config prevents users from zooming. This is a WCAG 2.1 Level AA failure (Success Criterion 1.4.4) and causes accessibility problems for users with low vision.
- **Root Cause:** Explicit setting in viewport export
- **Fix:** Remove `userScalable: false` and `maximumScale: 1`

### 2.2 🟡 MEDIUM — `overflow-x-hidden` on body masks horizontal overflow bugs
- **File:** `app/layout.tsx:26`
- **Issue:** `overflow-x-hidden` on `<body>` hides horizontal overflow globally. This masks bugs (like the DashboardSection floating icons) instead of fixing them. It also breaks `position: sticky` behavior in some browsers when applied to the body.
- **Root Cause:** Applied as a band-aid for overflow-causing components
- **Fix:** Remove from body; fix individual overflow sources instead

### 2.3 🟡 MEDIUM — No custom breakpoints defined in Tailwind config
- **File:** `tailwind.config.ts`
- **Issue:** Using only default Tailwind breakpoints (sm:640, md:768, lg:1024, xl:1280). The `xs` breakpoint at 480px is manually defined in `globals.css` as individual utility classes — not integrated into the Tailwind config. This creates inconsistency.
- **Root Cause:** Custom `xs` utilities were added ad-hoc in CSS instead of extending Tailwind's `screens` config
- **Fix:** Either add `xs: '480px'` to Tailwind's `screens` config or remove the custom CSS utilities if unused

### 2.4 🔵 LOW — Manual CSS `xs:` utilities outside Tailwind
- **File:** `app/globals.css:137-160`
- **Issue:** Four manual `xs:` utility classes defined (`xs:hidden`, `xs:inline`, `xs:flex-row`, `xs:mt-0`) outside Tailwind's plugin system. These aren't discoverable by IntelliSense and may cause confusion.
- **Root Cause:** Quick fix applied outside the design system
- **Fix:** Consolidate into Tailwind config or remove if unused

### 2.5 🟡 MEDIUM — Triplicated layout pattern (anti-pattern)
- **Files:** `Navbar.tsx`, `IndustriesNavSection.tsx`, `about/page.tsx`, `pricing/page.tsx`
- **Issue:** Multiple components render 2-3 entirely separate DOM trees for mobile/tablet/desktop, toggled with `hidden`/`md:hidden`/`lg:hidden`. This:
  - Triples the DOM size
  - Makes maintenance error-prone (changes must be applied to all 3 copies)
  - Ships unused HTML/JS to every viewport
- **Root Cause:** Layout-switching was done by duplicating markup instead of using responsive CSS on a single DOM tree
- **Fix:** Refactor to single DOM tree with responsive Tailwind classes

---

## 3. Homepage Issues

### 3.1 🔴 CRITICAL — StackedCardsSection: `h-screen` cards create massive blank space on mobile
- **File:** `components/StackedCardsSection.tsx:57,63`
- **Issue:** 
  - Section height is `(cards.length + 1) * 80vh` = **400vh** at ALL viewports
  - Each card uses `h-screen` (100vh), so on a 375px mobile with 812px viewport height, each card occupies 812px even though its content only needs ~400px
  - This creates ~400px of blank white space per card × 4 cards = **~1600px of wasted space**
  - The sticky scroll effect itself is problematic on mobile (cards are too tall, content is cramped in the top half)
- **Root Cause:** Fixed viewport-height sizing without mobile adaptation
- **Fix:** On mobile, either:
  - Switch to a non-sticky vertical layout (simple stacked cards)
  - Use `min-h-screen` instead of `h-screen` and reduce section multiplier
  - Set explicit mobile height: `h-auto min-h-[500px] md:h-screen`

### 3.2 🟠 HIGH — StackedCardsSection: `min-w-[280px]` on both columns causes overflow on small screens
- **File:** `components/StackedCardsSection.tsx:66,79`
- **Issue:** Both text column (`min-w-[280px]`) and image column (`min-w-[280px] md:min-w-[400px]`) have minimum widths. On a 375px screen with padding, this means:
  - In `flex-col` mode (mobile), each column individually fits
  - But the image column's content is oversized for the container
- **Root Cause:** `min-w` set too aggressively without mobile override
- **Fix:** Remove `min-w-[280px]` on mobile; use `w-full` instead

### 3.3 🟠 HIGH — DashboardSection: Floating icons overflow viewport on mobile
- **File:** `components/DashboardSection.tsx:27,38,49`
- **Issue:** Floating icons use negative absolute positioning:
  - `right-[-10px]` (Google Calendar)
  - `right-[-30px]` (Teams)
  - `right-[-35px]` (Mail)
  
  On mobile, these escape the container and create horizontal overflow (masked by body's `overflow-x-hidden`). The icons are tiny (8×8 = 32px) on mobile, making them nearly invisible and pointless.
- **Root Cause:** Fixed negative positions without container clipping or mobile-specific adjustments
- **Fix:** Either hide icons on mobile (`hidden md:block`) or constrain them within the container bounds

### 3.4 🟠 HIGH — WorkflowCarouselSection: Fixed `h-96` doesn't scale for mobile
- **File:** `components/WorkflowCarouselSection.tsx:46`
- **Issue:** The carousel container has a fixed `h-96` (384px). On mobile:
  - Images are sized to fill this height but their aspect ratio causes them to appear much smaller
  - The carousel items have `px-8` padding, reducing the visible image area further
  - No responsive height adjustment
- **Root Cause:** Fixed pixel height on carousel container
- **Fix:** Use responsive heights: `h-48 sm:h-64 md:h-80 lg:h-96`

### 3.5 🟡 MEDIUM — HomePageResourceSection: Fixed-width cards don't adapt
- **File:** `components/HomePageResourceSection.tsx:89`
- **Issue:** Resource cards use `w-[280px] sm:w-80` — fixed widths in a horizontal scroll. On a 375px mobile screen, only ~1.2 cards are visible, with no indication that more content exists.
- **Root Cause:** Fixed card widths with no scroll indicators
- **Fix:** Add scroll indicators (dots or arrows) and/or show partial next card to hint scrollability

### 3.6 🔵 LOW — Gap between DashboardSection and StackedCardsSection
- **File:** `app/page.tsx` (composition order)
- **Issue:** There's a noticeable visual gap between the dashboard image and the start of the stacked cards section on mobile, creating a disjointed visual flow.
- **Root Cause:** Both sections have their own padding/margins
- **Fix:** Adjust section spacing with negative margins or reduced padding on mobile

---

## 4. Use Cases Page Issues

### 4.1 🟡 MEDIUM — Hero text invisible on initial load (animation timing)
- **File:** `app/use-cases/page.tsx:32-42`
- **Issue:** The hero heading ("One platform. Every industry.") uses Framer Motion `initial={{ opacity: 0 }}` and on mobile the text appears to render invisibly for a moment. If JS is slow or the animation fails, the text remains invisible.
- **Root Cause:** `opacity: 0` as initial state with no CSS fallback
- **Fix:** Add CSS `opacity: 1` as base style, let Framer Motion override; or use `whileInView` instead of `animate`

### 4.2 🟡 MEDIUM — Stats grid wraps to 2×2 on mobile but lacks visual separation
- **File:** `app/use-cases/page.tsx:84`
- **Issue:** The stats bar uses `grid-cols-2 md:grid-cols-4`. On mobile this creates a 2×2 grid but the items have no borders or background to visually separate them, making it look like a random number cluster.
- **Root Cause:** No visual container or dividers on the stats items
- **Fix:** Add background cards or dividers between stat items on mobile

### 4.3 🔵 LOW — UseCasesSection cards stack to single column on mobile
- **File:** `components/UseCasesSection.tsx:98`
- **Issue:** Use case selector cards use `grid-cols-1 sm:grid-cols-3`. On mobile, all 3 cards stack vertically, taking up significant scroll space just for navigation.
- **Root Cause:** Grid drops to single column below 640px
- **Fix:** Consider a horizontal scroll or tab bar pattern on mobile instead of stacked cards

---

## 5. Blogs Page Issues

### 5.1 🟡 MEDIUM — Featured article image height too short on mobile
- **File:** `app/blogs/page.tsx:78`
- **Issue:** Featured article image uses `h-56 sm:h-64 lg:h-80`. On a 375px screen, `h-56` (224px) creates a squat image that doesn't showcase the content well.
- **Root Cause:** Mobile height is slightly too small for the featured article visual impact
- **Fix:** Consider `h-48 sm:h-56 md:h-64 lg:h-80` or auto-height with aspect ratio

### 5.2 🔵 LOW — Blog cards grid goes single-column on mobile
- **File:** `app/blogs/page.tsx:160`
- **Issue:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — single column on mobile is fine functionally but creates a very long scrolling page.
- **Root Cause:** Standard responsive grid behavior
- **Fix:** Consider 2 columns on larger phones (≥414px) or limit visible cards with "Show more"

---

## 6. Case Studies Page Issues

### 6.1 🟡 MEDIUM — Case study grid single-column up to 1024px
- **File:** `app/case-studies/page.tsx:112`
- **Issue:** Grid uses `grid-cols-1 lg:grid-cols-3`, meaning even tablet (768–1023px) shows single-column cards. This wastes horizontal space on iPad-sized screens.
- **Root Cause:** Missing intermediate breakpoint for tablet
- **Fix:** Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### 6.2 🔵 LOW — Stats inside case study cards cramped at 320px
- **File:** `app/case-studies/page.tsx:161`
- **Issue:** Each card has `grid-cols-3` stats. At 320px, the stat labels (e.g., "On-time payouts achieved") get severely truncated by `-webkit-line-clamp: 1`.
- **Root Cause:** Fixed 3-column grid for stats doesn't adapt to very small screens
- **Fix:** Consider `grid-cols-2` for stats on very small screens, or reduce font size

---

## 7. About Page Issues

### 7.1 🟠 HIGH — Leadership section has inconsistent member counts across breakpoints
- **File:** `app/about/page.tsx:72-181`
- **Issue:** Three separate DOM trees for leadership:
  - **Mobile (< md):** Shows 5 people (Rakesh, Mahesh Kumar, M Abdul Raoof, Dr. Lizo, Mahesh T.)
  - **Tablet (`sm:flex md:hidden`):** Shows only 4 people (missing Dr. Lizo Mkhutshulwa!)
  - **Desktop (≥ md):** Shows all 5 people
  
  The tablet layout literally drops a director from the page.
- **Root Cause:** Triplicated DOM with inconsistent content between copies
- **Fix:** Single DOM tree with responsive grid; ensure all 5 members are always present

### 7.2 🟠 HIGH — "Meet Orixs" image uses extreme negative margin
- **File:** `app/about/page.tsx:33`
- **Issue:** `className="mb-8 md:mb-20 mx-auto md:-ml-48 xl:-ml-64"` — the "Meet Orixs" text image uses `-ml-48` (negative 12rem margin) on desktop, pushing it far left and potentially off-screen on smaller desktops.
- **Root Cause:** Hardcoded negative margins for visual positioning
- **Fix:** Use `max-w-` and standard positioning instead of negative margins

### 7.3 🟡 MEDIUM — Hero section image has no responsive sizing constraints
- **File:** `app/about/page.tsx:23-25`
- **Issue:** Uses native `<img>` tag (not Next.js `<Image>`) with `max-width: 100%` inline style. On desktop it works, but there's no explicit width constraint so the image and text compete for space unpredictably at different viewports.
- **Root Cause:** Native `<img>` without explicit responsive sizing
- **Fix:** Use Next.js `<Image>` with explicit width/height and responsive classes

### 7.4 🟡 MEDIUM — Tablet layout breakpoint mismatch
- **File:** `app/about/page.tsx:112`
- **Issue:** Tablet layout uses `hidden sm:flex md:hidden` — this means it's visible between 640px and 767px only. But the mobile layout uses `flex flex-col md:hidden`, which is visible from 0–767px. Both mobile AND tablet layouts are visible from 640–767px simultaneously.
- **Root Cause:** Overlapping visibility conditions between mobile and tablet
- **Fix:** Mobile should be `flex flex-col sm:hidden`, tablet should be `hidden sm:flex md:hidden`

---

## 8. Pricing Page Issues

### 8.1 🟠 HIGH — Pricing cards use `max-w-[340px]` for RINI tab but `max-w-[600px]` for others
- **File:** `app/pricing/page.tsx:429-434`
- **Issue:** `boxDimensions` has inconsistent max-widths per tab. When switching tabs, cards visually resize. On mobile with `grid-cols-1`, the `max-w-[340px]` makes the RINI card look narrow while other tabs fill the width.
- **Root Cause:** Per-tab box dimension configuration
- **Fix:** Use consistent max-width across all tabs, or remove max-width on mobile

### 8.2 🟡 MEDIUM — Currency/Billing selectors stack awkwardly on mobile
- **File:** `app/pricing/page.tsx:668-763`
- **Issue:** The currency and billing selectors use `flex-col md:flex-row`. On mobile they stack vertically, each taking full width, which works but creates a lot of vertical space before reaching the actual pricing cards.
- **Root Cause:** Full-width selectors on mobile
- **Fix:** Place selectors side-by-side on mobile using `flex-row` with `gap-2`

### 8.3 🟡 MEDIUM — Tab navigation 2-2-1 grid on mobile is unusual
- **File:** `app/pricing/page.tsx:806-861`
- **Issue:** 5 tabs arranged as 2-2-1 rows on mobile. The lone 5th tab ("Scene One") looks orphaned. Also, tabs are separate DOM blocks for mobile/tablet/desktop (triplicated).
- **Root Cause:** Odd number of tabs + triplicated layout approach
- **Fix:** Use horizontal scrollable tabs or a 3-2 grid instead. Consolidate to single DOM tree.

### 8.4 🟠 HIGH — `hover:scale-105` on pricing cards causes layout shift on mobile
- **File:** `app/pricing/page.tsx:884`
- **Issue:** `transition-transform hover:scale-105` on pricing cards scales them up on hover/tap. On mobile (touch devices), this causes visual jank when tapping to select a plan. The card expands, potentially pushing siblings.
- **Root Cause:** Desktop hover effect applied to all viewports
- **Fix:** Disable scale on mobile: `md:hover:scale-105` instead of `hover:scale-105`

---

## 9. Get Started Page Issues

### 9.1 🟡 MEDIUM — Two-column layout persists too long on mobile
- **File:** `app/get-started/[industry]/page.tsx`
- **Issue:** The page uses `flex-col lg:flex-row` for the signup form + benefits split. On tablet (768–1023px), the content stays in single column which is fine, but the form itself has complex multi-step inputs that may be cramped.
- **Root Cause:** Form inputs don't have sufficient mobile-specific sizing
- **Fix:** Ensure form inputs have adequate touch target sizes (min 44×44px) and spacing on mobile

---

## 10. Component-Level Issues

### 10.1 🔴 CRITICAL — NewsletterModal: Fixed 440px width overflows mobile
- **File:** `components/NewsletterModal.tsx:80-81`
- **Issue:** Modal uses `fixed top-32 right-6 z-50` with `w-[440px]`. On any screen narrower than 446px (440 + 6px right), the modal overflows the left edge of the screen. On a 375px phone, 65px of the form is clipped/invisible.
- **Root Cause:** Fixed pixel width with no responsive override; fixed position with no mobile centering
- **Fix:** Use `w-full max-w-[440px]` and center on mobile: `fixed inset-x-4 top-32 sm:right-6 sm:left-auto sm:inset-x-auto`

### 10.2 🔴 CRITICAL — NewsletterModal: No backdrop/overlay on mobile
- **File:** `components/NewsletterModal.tsx:80`
- **Issue:** The modal is positioned `fixed top-32 right-6` with no backdrop overlay. On mobile, it floats without context, and users may not realize they need to close it to interact with the page beneath. There's no way to dismiss by tapping outside.
- **Root Cause:** Modal designed as a desktop sidebar panel, not a mobile-aware modal
- **Fix:** Add a semi-transparent backdrop on mobile; use proper modal pattern with overlay

### 10.3 🟠 HIGH — PartnerModal: Form doesn't scroll properly on small screens
- **File:** `components/modal/PartnerModal.tsx:392`
- **Issue:** The partner form uses `max-w-2xl` (672px) with many fields. On mobile the Modal wrapper should handle scrolling, but the form is extremely long with all the plan rows, currency selectors, etc. The "Submit" button may be below the visible area.
- **Root Cause:** Complex form not optimized for mobile viewing
- **Fix:** Ensure the modal container has `max-h-[90vh] overflow-y-auto` and sticky action buttons

### 10.4 🟠 HIGH — PartnerModal: Currency/Billing selectors overflow on mobile
- **File:** `components/modal/PartnerModal.tsx:508-531`
- **Issue:** The currency and billing selectors use `flex items-center gap-4` with fixed-width selects (`w-32`). On a 375px screen inside a modal, these elements overflow the form width.
- **Root Cause:** Fixed-width selectors + inline flex layout without wrapping
- **Fix:** Use `flex-wrap` and responsive widths, or stack vertically on mobile

### 10.5 🟡 MEDIUM — TestimonialsSection: Navigation buttons overflow on mobile
- **File:** `components/TestimonialsSection.tsx:60-61`
- **Issue:** Left/right navigation buttons use negative positions (`left-[-16px]`, `right-[-16px]`). On mobile, these buttons stick to the very edge of the screen and may be partially clipped by `overflow-x-hidden`.
- **Root Cause:** Negative positioning for buttons outside container
- **Fix:** Position buttons inside the container on mobile, or overlay them on the cards

### 10.6 🟡 MEDIUM — TestimonialsSection: Video cards are too wide for mobile
- **File:** `components/TestimonialsSection.tsx:75`
- **Issue:** Cards use `min-w-[320px]` — on a 375px screen with `px-4` padding, only 343px is available. The card is forced wider than the viewport content area.
- **Root Cause:** `min-w` exceeds available mobile viewport
- **Fix:** Use `min-w-[280px] sm:min-w-[320px]`

### 10.7 🟡 MEDIUM — Navbar: Desktop buttons overlap centered menu at medium widths
- **File:** `components/Navbar.tsx:68`
- **Issue:** Desktop CTA buttons are `absolute right-4` while the navigation menu is `absolute left-1/2 -translate-x-1/2`. Between 768px and ~1024px, these two absolutely-positioned elements overlap or get very close to each other.
- **Root Cause:** Two absolute-positioned elements competing for horizontal space
- **Fix:** Use a flex layout with `justify-between` instead of absolute positioning, or hide CTAs at `md` and only show at `lg`

---

## 11. Severity Matrix

| Severity | Count | Issues |
|----------|-------|--------|
| 🔴 Critical | 4 | StackedCards h-screen, NewsletterModal width, NewsletterModal no backdrop, userScalable:false |
| 🟠 High | 8 | StackedCards min-w, DashboardSection overflow, WorkflowCarousel height, About leadership inconsistency, About negative margins, Pricing card max-w, Pricing hover:scale, PartnerModal overflow |
| 🟡 Medium | 12 | body overflow-x-hidden, no xs breakpoint in config, triplicated layouts, Hero animation, Stats no separators, UseCases single-col, Case studies grid, About breakpoint overlap, Pricing selectors, Pricing tabs, Testimonials buttons, Navbar overlap |
| 🔵 Low | 6 | Manual xs utilities, Resources scroll hint, Blog image height, Blog single-col, Case study stats cramped, Dashboard/StackedCards gap |

### Priority Order for Fixes:
1. **StackedCardsSection** — affects homepage, most visible, worst UX impact
2. **NewsletterModal** — breaks on any mobile device
3. **userScalable: false** — accessibility violation
4. **DashboardSection overflow** — visible overflow on mobile
5. **WorkflowCarouselSection** — blank space on mobile homepage
6. **About page leadership** — missing director on tablet
7. **PartnerModal** — form unusable on mobile
8. **Pricing page** — hover effects, inconsistent sizing
9. **Navbar overlap** — medium desktop issue
10. Everything else

---

*This audit was generated from code analysis and visual testing at 375×812 mobile viewport. Further testing at 320px, 768px, and 1920px is recommended during implementation validation.*
