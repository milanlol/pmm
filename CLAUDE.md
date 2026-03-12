# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Project Overview
Perception Multimedia Inc. — marketing website + client case study pages, all static HTML/CSS.

**Site structure:**
- `index.html` — main one-page website (nav, hero, about, services, clients, contact)
- `about.html` — standalone About Us page
- `contact.html` — standalone Contact page (form, map, social links)
- `clients/index.html` — client work gallery/index page (lists all case studies)
- `clients/fat-heads.html` — Fat Head's Brewery case study (accent: `#7fbb42` green; Tailwind keys: `fh-green`, `fh-amber`)
- `clients/bob-evans.html` — Bob Evans case study (accent: `#66579F` purple; Tailwind keys: `be-purple`, `be-lavender`)
- `clients/cleveland-boat-show.html` — Cleveland Boat Show case study (accent: `#0E6EA0` blue; Tailwind keys: `cbs-blue`, `cbs-sky`)
- `clients/southwest-general.html` — Southwest General Hospital case study (accent: `#008833` green; Tailwind keys: `swg-green`)
- `clients/pse-credit-union.html` — PSE Credit Union case study
- `clients/moen.html` — Moen case study
- `clients/npa-coatings.html` — NPA Coatings case study (accent: `#f04f26` orange; Tailwind keys: `npa-blue`, `npa-steel`; services: Web Design + Photography)
- `clients/oatey.html` — Oatey case study (accent: `#eb0029` red; Tailwind key: `oatey-red`)
- `clients/polaris.html` — Polaris Career Center case study (accent: `#1a4e95` blue; Tailwind key: `pol-blue`)
- `clients/avery-dennison.html` — Avery Dennison case study (accent: `#E31F26` red; Tailwind key: `ad-red`)
- `clients/hill-n-dale.html` — Hill N Dale Club case study (accent: `#e7ceb0` tan; Tailwind keys: `hnd-tan`, `hnd-dark`)
- `clients/dap.html` — DAP case study (accent: `#d6391d` orange; Tailwind keys: `dap-orange`, `dap-ember`, `dap-dark`)
- `clients/hannahs-home.html` — Hannah's Home case study (accent: `#009688` teal; Tailwind keys: `hh-teal`, `hh-teal-lt`)
- `clients/tovolo.html` — Tovolo case study (accent: `#6ea452` green; Tailwind keys: `tov-green`, `tov-forest`, `tov-sage`)
- `clients/action-door.html` — Action Door & Window case study (accent: `#f04135` red; Tailwind keys: `ad-red`, `ad-ember`, `ad-dark`)
- `clients/jim-kaminski.html` — Jim Kaminski for Mayor case study (accent: `#19452f` green; Tailwind keys: `jk-green`, `jk-forest`, `jk-sage`)
- `clients/gales-garden-center.html` — Gale's Garden Center case study (accent: `#5f3844` berry; Tailwind keys: `gale-berry`, `gale-rose`, `gale-dark`)
- `philanthropy.html` — standalone Philanthropy page
- `services/index.html` — services overview (8 clickable cards linking to individual service pages)
- `services/video-production.html` — fully built service page (hero bg video, capabilities grid, YouTube portfolio modal, CTA)
- `services/search-marketing.html` — fully built service page (chart-bg hero, platform video section on light bg, geo targeting section, capabilities grid, YouTube portfolio modal)
- `services/website-design.html`, `services/social-media.html`, `services/email-campaigns.html`, `services/photography.html` — fully built service pages
- `services/graphic-design.html`, `services/traditional-media.html` — blank stubs, ready for content
- `styles.css` — shared stylesheet (all pages reference via absolute path `/styles.css` or relative `../styles.css`)

## Shared Partials & Build System
Nav and footer are managed as shared partials — **never edit nav/footer HTML directly inside individual page files**.

- `_nav.html` — single source of truth for the navigation + mobile menu
- `_footer.html` — single source of truth for the footer
- `build.mjs` — injects both partials into all HTML pages in one pass

**Workflow:** Edit `_nav.html` or `_footer.html`, then run:
```
node build.mjs
```
This replaces content between sentinel comments in every page:
- `<!-- NAV START -->` … `<!-- NAV END -->` — replaced with `_nav.html`
- `<!-- FOOTER START -->` … `<!-- FOOTER END -->` — replaced with `_footer.html`

The build script also applies per-page `.nav-active` states automatically based on the `PAGE_MAP` in `build.mjs`. When adding a new page, you must do both:
1. Add an entry to `PAGE_MAP` in `build.mjs`
2. Include `<!-- NAV START -->` / `<!-- NAV END -->` sentinels in the page HTML (build silently skips pages missing these)

**Nav notes:**
- All hrefs in `_nav.html` use **absolute paths** (`/index.html`, `/services/video-production.html`, etc.) — works from any subdirectory
- Mobile menu z-index: `z-[60]` (above navbar `z-50`)
- Active page nav link gets `.nav-active` class; active dropdown item gets `.active` class

<!-- SCREENSHOT FUNCTIONALITY DISABLED — re-enable when needed

## Local Server & Screenshots
- **Start server:** `node serve.mjs` (port 3000, serves project root) — run in background
- **Kill stale node processes first** — another project may occupy port 3000: `powershell -Command "Stop-Process -Id <PID> -Force"`
- **Screenshot:** `node screenshot.mjs http://localhost:3000 [label]` → saves to `./temporary screenshots/screenshot-N-label.png`
- Additional screenshot scripts: `screenshot-section.mjs`, `screenshot-sections.mjs`, `screenshot-scroll.mjs`
- After screenshotting, read the PNG with the Read tool to analyze it visually
- **Never screenshot a `file:///` URL** — always use localhost

## Screenshot Workflow
- Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing
- Clip fix: `page.screenshot({ clip: { x: 0, y: scrollY, ... } })` clips from page coords — do NOT use `window.scrollTo` + `clip: {y:0}`

-->

## Output Defaults
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Tailwind config inline in each HTML file's `<script>` block (colors + fontFamily)
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Client pages reference shared stylesheet as `../styles.css`
- `overflow-x-hidden` must be on the wrapper `<div>`, NOT on `body` (body restriction blocks `window.scrollTo`)
- Mobile-first responsive

## Brand Tokens
```
Colors:   #E81B1E (pmm-red), #0A0A0A (pmm-black), #111111 (pmm-dark)
          #161616 (pmm-surface), #222222 (pmm-border), #3A3A3A (pmm-muted)
          #F4F4F0 (pmm-white), #EDECEA (pmm-cream), #5C5C5C (pmm-gray)
Fonts:    Bebas Neue → font-display (headings/display)
          Josefin Sans → font-heading (subheadings, nav)
          DM Sans → font-body (body text)
Easing:   --ease-expo: cubic-bezier(0.16, 1, 0.3, 1)
          --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)
```

## Brand Assets
All paths below are relative to `brand_assets/` (e.g., use `brand_assets/PMM-Logo-white.png` in HTML).
- `PMM-Logo-white.png` — use on dark backgrounds
- `PMM-Logo.png` — use on light backgrounds
- `PMM-Logo-Symbol.jpg` — white bg; apply `filter: invert(1)` on dark bg — **NEVER use this as a decorative watermark in any design** (user rule)
- `PMM-Brochure.pdf` — reference for services/messaging
- `google-partner-badge.png`, `Mailchimp-partners-badge.png` — partner logos
- `BrollPMM-2022.mp4` — general PMM b-roll video
- `PMM_video-DemoReel.mp4` — demo reel; used as hero background video in `video-production.html`
- `photos/mike-and-kari.jpg` — founders photo; `photos/pmm-1.jpg`, `pmm-3.jpg`, `pmm-4.jpg` — office/team photos
- `pmm-headshots/` — individual team headshots: `Mike23.jpg`, `Kari-profile-picture.jpg`, `lauren-pic.jpg`, `milan-for-site.jpg`, `karen-for-site.jpg`, `Maryanne23.jpg`, `Devin23.jpg`, `animator2.png`
- `clients/logos/clogo1–10.png` — client logo grid
- `clients/fat-heads.jpg`, `clients/Bob-Evans-Farms2.jpg`, `clients/boat-show.jpg`, `clients/NPA-Coatings.jpg` — client card thumbnail images
- `clients/fat-heads/` — `fat-heads-logo.png`, brewery photos (`fat-heads-brewery-front.jpg`, `beer-cans.jpg`, `fat-heads-resturant.jpg`, `Banner-Facebook-Banner.jpg`), `fat-heads-promo-video.mp4`, `fat-heads-social-media-mockup.mp4`
- `clients/bob-evans/` — `bobevanslogo.png`, `BobEvans_BannerVid.mp4`
- `clients/cleveland-boat-show/` — `CLEVELAND_Boat_Show_logo.png`, `boat-show-banner-stock-photo.jpg`, `email-boat-show.png`, `boat-show-IG-Mockup2.jpg`, `boat-show-FB-Mockup.png`
- `clients/SWG/` — `swLogo-Horizontal_color-logo.png` (color), `swLogo-Horizontal_color-logo-white.png` (white); videos: `DrKorkorOverview.mp4`, `DrKorkorTour.mp4`, `nurses.mp4`; thumbnails: `Meet-Dr-Korkor-Vid-Thumbnail.jpg`, `Office-Tour-Dr-Korkor-Vid-Thumbnail.jpg`; staff photos: `Exterior_009.jpg`, `korkor-landing-page.jpg`, `Dr-Punjabi.jpg`, `John-Alton-MD-68.jpg`, + 3 CNP staff photos
- `clients/search-marketing/` — `chart-bg.jpg` (analytics chart, hero bg), `facebook-video.mp4` (platform demo), `google-targeting-map.jpg` (geo radius map), `google-search-pse.png`, `google-video-img.webp`
- `clients/hannahs-home/` — `HH_Logo-white.png`; videos: `Abortion-healing.mp4`, `Annas-Story.mp4`, `BabyBottleCampaign.mp4`, `Carmens-Story.mp4`, `Crystals-Story.mp4`, `GrandOpeningThriftStore.mp4`, `VolunteerShoutOut.mp4`; photos + flyers in folder
- `clients/tovolo/` — `Tovolo_logo_white.webp`; product videos: `Christmas-Ice.mp4`, `Christmas-Spatula.mp4`, `IceCreamScooper.mp4`, `OldFashioned.mp4`, `TovoloMiniIce_1.mp4`; product photos
- `clients/action-door/` — `actiondoor-logo.png`, `actiondoorandwindow-banner.jpg`, `Action-Door-Emails.png`, `website-screenshot.jpg`; videos in `videos/` subfolder: `15-Second-Ad-vertical.mp4`, `ActionDoor-SalvationArmy.mp4`, `GarageService-Comercial.mp4`, `NewGarageDoor-commercial.mp4`
- `clients/jim-kaminski/` — `JK-Logo-White.png`, `Jim-Kaminski-headshot.jpg`, `Jim-Town-Center.jpg`, `Fundraiser-photo.jpg`; videos: `Economic-Development.mp4`, `Protecting-Our-Families-Neighborhoods.mp4`, `Strongsville-Quality-of-Life.mp4`
- `clients/gales/` — `logo.png`, `stock-photos/`; videos: `ChristmasSale-vertical.mp4`, `Discounts-vertical.mp4`, `Holiday-Commercial.mp4`, `June-Comercial.mp4`, `May-commercial.mp4`
- `SocialMediaPMM.mp4`, `WebsitePMM.mp4`, `Ride-2-End-Alzheimer.mp4` — additional PMM brand/service videos at `brand_assets/` root
- Always use real assets before falling back to placehold.co

## CSS Architecture (`styles.css`)
Shared across all pages. Sections in order:
1. CSS variables (`:root`)
2. Base reset + font smoothing
3. Grain overlay (fixed SVG noise texture, `z-index: 100`, `pointer-events: none`)
4. Navbar (transparent → scrolled state transition)
5. Component classes for buttons, cards, animations, etc.

Client pages extend Tailwind config with client-specific colors (e.g., `fh-orange`, `fh-amber` for Fat Head's).

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.)
- **Shadows:** Use layered, color-tinted shadows — never flat `shadow-md`
- **Typography:** Tight tracking (`-0.03em`) on large headings; generous line-height (`1.7`) on body
- **Gradients:** Layer multiple radial gradients; add grain/texture via SVG noise filter
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states
- **Images:** Add gradient overlay (`bg-gradient-to-t from-black/60`) + color treatment with `mix-blend-multiply`
- **Depth:** Use a layering system (base → elevated → floating)

## Service Page Template
2 service pages remain as bare stubs (`graphic-design.html`, `traditional-media.html`). When filling one in, copy the full `<head>` boilerplate (Tailwind CDN, Google Fonts, Tailwind config block) from `services/index.html` and reference `../styles.css`. Use `services/video-production.html` as the fully-built reference for layout, JS patterns, and component structure.

## Shared Page Patterns
These patterns are consistent across all `services/` and `clients/` pages:

**Nav** — `#navbar` fixed, toggling `.nav-scrolled` at `scrollY > 40`. Mobile: hamburger `#menu-toggle` opens full-screen `#mobile-menu` overlay (`z-[60]`). Services link uses `.nav-dropdown-wrapper` / `.nav-dropdown`. Active states are injected automatically by `build.mjs` — do not hardcode them in page files.

**Recurring components:**
- `.eyebrow-rule` — flex row with a red `::before` rule + small uppercase label; used above every section heading
- `.reveal-up` + IntersectionObserver (`threshold: 0.07`) — scroll-triggered fade-up; add `.delay-1`/`.delay-2`/`.delay-3` for stagger
- `.marquee-track` / `.marquee-inner` — red `bg-pmm-red` strip between hero and first content section
- Hero PMM symbol watermark: do NOT add these — user has explicitly banned PMM symbol use in all pages

**YouTube video modal** (see `video-production.html`):
- `#vid-modal` overlay + `#vid-modal-iframe`; `openModal(videoId)` sets `src` with `?autoplay=1`; `closeModal()` delays src clear 300 ms for fade-out; Esc key + backdrop click both close

**Case study video sections** — use `pse-credit-union.html` as the canonical pattern:
- `.video-grid` (1-col mobile / 3-col desktop, `gap: 2px`), `.video-card` with autoplay muted loop `.mp4` preview, `.video-card-overlay`, `.video-card-play` button, `.video-card-label`
- Clicking opens local `.mp4` in `#vid-modal` via `openVidModal(src)` — no YouTube iframes in case study video sections

**Photography grids** — always use masonry layout; never crop images (`object-contain` or natural sizing, not `object-cover` with fixed height)

## Contact Info
- Address: 15165 Bagley Road, Middleburg Heights, OH 44130
- Phone: (440) 340-1115
- Phone 2: (440) 655-2032
- Email: info@perceptionmm.com

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
