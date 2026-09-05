# Responsive Implementation Plan — Orixs Web

**Date:** 2026-09-03  
**Based on:** [responsive-audit.md](./responsive-audit.md)  
**Approach:** Mobile-first. Fix root causes. Preserve desktop design. No redesigns.

---

## Implementation Phases

### Phase 1: Critical Accessibility & Global Fixes (30 min)
*These are prerequisites that affect every page.*

#### 1.1 Remove `userScalable: false`
- **File:** `app/layout.tsx`
- **Change:** Remove `maximumScale: 1` and `userScalable: false` from viewport export
- **Risk:** None — this was incorrectly restricting users
```tsx
// BEFORE
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// AFTER
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
```

#### 1.2 Remove body `overflow-x-hidden`
- **File:** `app/layout.tsx`
- **Change:** Remove `overflow-x-hidden` from body className
- **Risk:** LOW — will expose existing overflow bugs; must fix those first (DashboardSection)
- **Order:** Do AFTER fixing DashboardSection overflow (Phase 2.2)

---

### Phase 2: Homepage Critical Fixes (1.5 hours)

#### 2.1 StackedCardsSection — mobile layout overhaul
- **File:** `components/StackedCardsSection.tsx`
- **Strategy:** Keep sticky behavior on desktop (≥md), switch to simple stacked layout on mobile
- **Changes:**
  1. Section height: `style={{ height }}` → use CSS: keep `400vh` on md+, remove on mobile
  2. Card height: `h-screen` → `h-auto md:h-screen`
  3. Sticky behavior: `sticky top-0` → `md:sticky md:top-0` (remove sticky on mobile)
  4. Remove `min-w-[280px]` from both columns on mobile
  5. Add `py-8 md:py-0` for mobile card spacing
  6. Reduce gap between cards on mobile
- **Validation:** Cards should flow naturally on mobile, sticky-scroll on desktop

```tsx
// Section wrapper
<section
  className="relative w-full bg-white"
  // Remove inline height on mobile
>
  {/* Use CSS for responsive heights */}
  <style jsx>{`
    @media (min-width: 768px) {
      section { height: ${(cards.length + 1) * 80}vh; }
    }
  `}</style>

// Each card
<Card className="w-full h-auto md:h-screen flex flex-col justify-center ...">

// Columns
<div className="flex-1 flex flex-col gap-y-3 w-full md:min-w-[280px] max-w-xl">
<div className="flex-1 flex justify-center items-center w-full md:min-w-[400px]">
```

#### 2.2 DashboardSection — constrain floating icons
- **File:** `components/DashboardSection.tsx`
- **Strategy:** Hide floating icons on mobile; they're 32px and invisible anyway
- **Changes:**
  1. Add `hidden md:block` to all three floating icon containers (lines 27, 38, 49)
  2. Keep the curved arrow visible on mobile (it's positioned within bounds)
  3. Add `overflow-hidden` to the section container as a safety net
- **Validation:** No horizontal overflow at 320px

#### 2.3 WorkflowCarouselSection — responsive height
- **File:** `components/WorkflowCarouselSection.tsx`
- **Changes:**
  1. Container height: `h-96` → `h-48 sm:h-64 md:h-80 lg:h-96`
  2. Reduce carousel item padding: `px-8` → `px-2 sm:px-4 md:px-8`
- **Validation:** Images should be visible and proportional at all sizes

#### 2.4 NewsletterModal — full mobile responsiveness
- **File:** `components/NewsletterModal.tsx`
- **Changes:**
  1. Container positioning: Replace `fixed top-32 right-6` with responsive:
     ```
     fixed inset-4 sm:inset-auto sm:top-32 sm:right-6 z-50
     ```
  2. Form width: Replace `w-[440px]` with:
     ```
     w-full sm:w-[440px]
     ```
  3. Add backdrop overlay on mobile:
     ```tsx
     // Before the form, add:
     <div className="fixed inset-0 bg-black/30 sm:hidden" onClick={() => setShow(false)} />
     ```
  4. Make form scrollable: Add `max-h-[80vh] overflow-y-auto` to the form
  5. Adjust progress bar width for mobile: `w-3` → `w-2 sm:w-3`
- **Validation:** Modal fits any screen, dismissible on mobile, scrollable

---

### Phase 3: About Page Fixes (45 min)

#### 3.1 Leadership section — single DOM, responsive grid
- **File:** `app/about/page.tsx`
- **Strategy:** Replace 3 separate DOM trees with one responsive grid
- **Changes:**
  1. Remove mobile layout block (`flex-col md:hidden`, lines 73-109)
  2. Remove tablet layout block (`hidden sm:flex md:hidden`, lines 112-141)
  3. Remove desktop layout block (`hidden md:flex`, lines 144-180)
  4. Replace with single responsive grid:
     ```tsx
     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 lg:gap-12">
       {leaders.map(leader => (
         <div className="flex flex-col items-center">
           <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden mb-3 border-4 border-purple-100">
             <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
           </div>
           <div className="font-semibold text-sm sm:text-base md:text-lg text-center">{leader.name}</div>
           <div className="text-purple-500 text-xs sm:text-sm md:text-base text-center">{leader.role}</div>
         </div>
       ))}
     </div>
     ```
  5. Extract leaders to a data array to prevent duplication

#### 3.2 "Meet Orixs" image negative margin
- **File:** `app/about/page.tsx:33`
- **Change:** Replace `md:-ml-48 xl:-ml-64` with standard positioning
- **Fix:** Use `md:max-w-[120%] md:-translate-x-12` or simply `md:text-left` alignment

#### 3.3 Fix tablet/mobile overlap
- **File:** `app/about/page.tsx`
- **Change:** Already resolved by Phase 3.1 (single DOM tree eliminates the overlap)

---

### Phase 4: Pricing Page Fixes (45 min)

#### 4.1 Tab navigation — consolidate to single DOM
- **File:** `app/pricing/page.tsx`
- **Strategy:** Replace 3 tab layouts with one horizontal scrollable row
- **Changes:**
  1. Remove desktop block (`hidden lg:flex`, lines 766-783)
  2. Remove tablet block (`hidden md:flex lg:hidden`, lines 785-804)
  3. Remove mobile block (`md:hidden`, lines 806-861)
  4. Replace with single scrollable tab bar:
     ```tsx
     <div className="flex overflow-x-auto gap-2 pb-2 mb-10 max-w-4xl w-full justify-start lg:justify-center hide-scrollbar">
       {navTabs.map(tab => (
         <button key={tab.key} onClick={() => setActiveTab(tab.key)}
           className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap flex-shrink-0 ${...}`}>
           <div className="w-5 h-5 flex items-center justify-center">{tab.icon}</div>
           <span>{tab.name}</span>
         </button>
       ))}
     </div>
     ```

#### 4.2 Remove hover:scale on mobile
- **File:** `app/pricing/page.tsx:884`
- **Change:** `hover:scale-105` → `md:hover:scale-105`

#### 4.3 Normalize box dimensions
- **File:** `app/pricing/page.tsx:428-434`
- **Change:** Use consistent `min-h-[420px] w-full` for all tabs, remove per-tab max-width on mobile

#### 4.4 Currency/Billing selectors — side by side on mobile
- **File:** `app/pricing/page.tsx:668`
- **Change:** `flex-col md:flex-row` → `flex-row flex-wrap` so selectors sit side-by-side on mobile

---

### Phase 5: Use Cases & IndustriesNavSection (30 min)

#### 5.1 IndustriesNavSection — consolidate to single DOM
- **File:** `components/IndustriesNavSection.tsx`
- **Strategy:** Same as pricing tabs — single scrollable tab bar
- **Changes:** Remove 3 separate layout blocks (lines 99-161), replace with one responsive component

#### 5.2 Add visual separation to stats grids
- **Files:** `app/use-cases/page.tsx:84`, `app/case-studies/page.tsx:84`
- **Change:** Add `bg-white/80 rounded-lg p-3` background to each stat item on mobile

---

### Phase 6: Case Studies Grid (15 min)

#### 6.1 Add tablet breakpoint to grid
- **File:** `app/case-studies/page.tsx:112`
- **Change:** `grid-cols-1 lg:grid-cols-3` → `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

### Phase 7: Partner Modal Mobile Fix (30 min)

#### 7.1 Currency/Billing selectors responsive
- **File:** `components/modal/PartnerModal.tsx:508-531`
- **Change:** Wrap in `flex flex-col sm:flex-row` and use `w-full sm:w-32`

#### 7.2 Plan grid responsive
- **File:** `components/modal/PartnerModal.tsx:535`
- **Change:** Plan row grid `grid-cols-1 md:grid-cols-3` — add more vertical spacing on mobile

#### 7.3 Ensure modal scrollability
- **File:** `components/modal/PartnerModal.tsx:392`
- **Change:** Add `max-h-[90vh] overflow-y-auto` to the inner div

---

### Phase 8: Testimonials & Misc Fixes (20 min)

#### 8.1 TestimonialsSection nav buttons
- **File:** `components/TestimonialsSection.tsx:60-61`
- **Change:** `left-[-16px]` → `left-0 sm:left-[-16px]` (keep inside viewport on mobile)

#### 8.2 TestimonialsSection card min-width
- **File:** `components/TestimonialsSection.tsx:75`
- **Change:** `min-w-[320px]` → `min-w-[280px] sm:min-w-[320px]`

#### 8.3 Navbar desktop button overlap
- **File:** `components/Navbar.tsx:68`
- **Change:** Hide CTAs at `md`, show at `lg`:
  `hidden md:flex` → `hidden lg:flex`
  This prevents overlap between 768–1024px.

---

### Phase 9: Final body overflow-x-hidden removal
- **File:** `app/layout.tsx:26`
- **Change:** Remove `overflow-x-hidden` from body
- **Prerequisite:** All overflow sources (DashboardSection, floating icons, etc.) must be fixed first
- **Validation:** Scroll horizontally on every page at every breakpoint — nothing should overflow

---

## Estimated Timeline

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1: Global fixes | 30 min | P0 |
| Phase 2: Homepage critical | 1.5 hrs | P0 |
| Phase 3: About page | 45 min | P1 |
| Phase 4: Pricing page | 45 min | P1 |
| Phase 5: Use Cases | 30 min | P1 |
| Phase 6: Case Studies | 15 min | P2 |
| Phase 7: Partner Modal | 30 min | P1 |
| Phase 8: Testimonials/Misc | 20 min | P2 |
| Phase 9: Final validation | 15 min | P0 |
| **Total** | **~5 hours** | |

---

## Validation Checklist (Post-Implementation)

After all fixes, test at these viewports:

### Mobile
- [ ] 320×568 (iPhone SE)
- [ ] 375×812 (iPhone 13 mini)
- [ ] 390×844 (iPhone 14)
- [ ] 414×896 (iPhone 11)
- [ ] 430×932 (iPhone 14 Pro Max)

### Tablet
- [ ] 768×1024 (iPad)
- [ ] 820×1180 (iPad Air)
- [ ] 1024×1366 (iPad Pro 12.9")

### Desktop
- [ ] 1024×768
- [ ] 1280×720
- [ ] 1440×900
- [ ] 1920×1080

### Per-page checks
- [ ] No horizontal scrollbar at any viewport
- [ ] All text readable without zooming
- [ ] All buttons/links have ≥44px touch targets on mobile
- [ ] No content clipped or hidden
- [ ] No blank/wasted space
- [ ] Modals fit screen and are dismissible
- [ ] Navigation usable at all sizes
- [ ] Images scale proportionally
- [ ] Forms usable with on-screen keyboard

---

## Rules During Implementation

1. **Mobile-first**: Write base styles for mobile, add `sm:`, `md:`, `lg:` for larger screens
2. **No hacks**: No `!important`, no inline styles for layout, no negative margins for positioning
3. **Single DOM tree**: Never duplicate markup for different viewports; use responsive CSS
4. **Fix root causes**: If something overflows, fix the element, don't hide the overflow
5. **Preserve desktop**: Every fix must keep the current desktop design unchanged
6. **Test after each phase**: Don't batch all fixes then test — validate phase by phase
