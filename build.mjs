/**
 * build-nav.mjs
 * Injects _nav.html and _footer.html into every HTML page, replacing content
 * between sentinel comments. Also applies the correct nav-active class per page.
 *
 * Usage: node build-nav.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = __dir;

// ─── Page map ────────────────────────────────────────────────────────────────
// key   = path relative to project root
// value = { topLink, dropdownItem }
//   topLink      → href of the top-level <a> that gets nav-active
//   dropdownItem → href of the dropdown <a> that gets "active" class (or null)
//   mobileActive → href of the mobile menu <a> that gets text-pmm-red (or null)
const PAGE_MAP = {
  'index.html':                                { topLink: '/index.html',                    dropdownItem: null,                              mobileActive: null },
  'about.html':                                { topLink: '/about.html',                    dropdownItem: null,                              mobileActive: null },
  'philanthropy.html':                         { topLink: '/philanthropy.html',             dropdownItem: null,                              mobileActive: null },
  'contact.html':                              { topLink: '/contact.html',                  dropdownItem: null,                              mobileActive: '/contact.html' },
  'clients/index.html':                        { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/fat-heads.html':                    { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/bob-evans.html':                    { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/cleveland-boat-show.html':          { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/southwest-general.html':            { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/pse-credit-union.html':            { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/moen.html':                        { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/npa-coatings.html':               { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/oatey.html':                      { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/polaris.html':                    { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/avery-dennison.html':             { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/hill-n-dale.html':               { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/dap.html':                        { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/hannahs-home.html':              { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/tovolo.html':                     { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/action-door.html':               { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/jim-kaminski.html':              { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'clients/gales-garden-center.html':      { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null },
  'services/index.html':                       { topLink: '/services/index.html',           dropdownItem: null,                              mobileActive: null },
  'services/video-production.html':            { topLink: '/services/index.html',           dropdownItem: '/services/video-production.html', mobileActive: null },
  'services/search-marketing.html':            { topLink: '/services/index.html',           dropdownItem: '/services/search-marketing.html', mobileActive: null },
  'services/website-design.html':              { topLink: '/services/index.html',           dropdownItem: '/services/website-design.html',   mobileActive: null },
  'services/social-media.html':                { topLink: '/services/index.html',           dropdownItem: '/services/social-media.html',     mobileActive: null },
  'services/email-campaigns.html':             { topLink: '/services/index.html',           dropdownItem: '/services/email-campaigns.html',  mobileActive: null },
  'services/photography.html':                 { topLink: '/services/index.html',           dropdownItem: '/services/photography.html',      mobileActive: null },
  'services/graphic-design.html':              { topLink: '/services/index.html',           dropdownItem: '/services/graphic-design.html',           mobileActive: null },
  'services/traditional-media.html':           { topLink: '/services/index.html',           dropdownItem: '/services/traditional-media.html',        mobileActive: null },
  'services/google-business-profile.html':     { topLink: '/services/index.html',           dropdownItem: '/services/google-business-profile.html',  mobileActive: null },
  'services/reputation-management.html':       { topLink: '/services/index.html',           dropdownItem: '/services/reputation-management.html',    mobileActive: null },
  'blog/index.html':                           { topLink: '/blog/index.html',               dropdownItem: null,                                      mobileActive: null },
};

// ─── Read partials ────────────────────────────────────────────────────────────
const navPartial    = readFileSync(resolve(root, '_nav.html'), 'utf8');
const footerPartial = readFileSync(resolve(root, '_footer.html'), 'utf8');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Add nav-active to a specific top-level nav <a href="HREF">
 * Matches the exact href so we don't accidentally hit the dropdown link.
 */
function applyTopActive(nav, href) {
  // Match the anchor with this href that has nav-link class (not nav-cta-btn)
  // We add nav-active after the existing classes
  return nav.replace(
    new RegExp(`(<a href="${escRe(href)}" class="nav-link )`, 'g'),
    `$1nav-active `
  );
}

/**
 * Mark the Contact CTA button as active (different styling — it's nav-cta-btn).
 * When on contact.html the CTA button IS the active item.
 */
function applyContactActive(nav) {
  return nav.replace(
    `href="/contact.html" class="nav-cta-btn font-heading font-bold text-xs tracking-[0.2em] uppercase px-6 py-3 bg-pmm-red text-white hover:bg-red-700 transition-colors duration-200"`,
    `href="/contact.html" class="nav-cta-btn nav-active font-heading font-bold text-xs tracking-[0.2em] uppercase px-6 py-3 bg-pmm-red text-white"`
  );
}

/**
 * Mark Services top link as active (it has extra SVG children, different pattern).
 */
function applyServicesActive(nav) {
  return nav.replace(
    `href="/services/index.html" class="nav-link font-heading font-semibold text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors duration-200 flex items-center gap-1.5"`,
    `href="/services/index.html" class="nav-link nav-active font-heading font-semibold text-xs tracking-[0.2em] uppercase transition-colors duration-200 flex items-center gap-1.5"`
  );
}

/**
 * Mark a dropdown item as active.
 */
function applyDropdownActive(nav, href) {
  return nav.replace(
    new RegExp(`(<a href="${escRe(href)}" class="nav-dropdown-item)(")`),
    `$1 active$2`
  );
}

/**
 * Apply mobile active color to a specific mobile menu link.
 * For most pages the SERVICES button already shows in pmm-red when its
 * section is active. For contact we color the CONTACT link red.
 */
function applyMobileContactActive(nav) {
  // Change the mobile CONTACT link from white to pmm-red
  return nav.replace(
    `href="/contact.html" onclick="closeMobileMenu()" class="font-display text-5xl text-white hover:text-pmm-red transition-colors duration-200"`,
    `href="/contact.html" onclick="closeMobileMenu()" class="font-display text-5xl text-pmm-red"`
  );
}

function escRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Process each page ────────────────────────────────────────────────────────
let updated = 0;
let skipped = 0;

for (const [relPath, { topLink, dropdownItem, mobileActive }] of Object.entries(PAGE_MAP)) {
  const filePath = resolve(root, relPath);

  let html;
  try {
    html = readFileSync(filePath, 'utf8');
  } catch {
    console.warn(`  ⚠  Skipping (not found): ${relPath}`);
    skipped++;
    continue;
  }

  // Check nav sentinels exist
  if (!html.includes('<!-- NAV START -->') || !html.includes('<!-- NAV END -->')) {
    console.warn(`  ⚠  Skipping (no nav sentinels): ${relPath}`);
    skipped++;
    continue;
  }

  // Build the nav with correct active states
  let nav = navPartial;

  if (topLink === '/contact.html') {
    nav = applyContactActive(nav);
  } else if (topLink === '/services/index.html') {
    nav = applyServicesActive(nav);
    if (dropdownItem) {
      nav = applyDropdownActive(nav, dropdownItem);
    }
  } else {
    nav = applyTopActive(nav, topLink);
  }

  if (mobileActive === '/contact.html') {
    nav = applyMobileContactActive(nav);
  }

  // Inject nav
  const NAV_START = '<!-- NAV START -->';
  const NAV_END   = '<!-- NAV END -->';
  const navS = html.indexOf(NAV_START);
  const navE = html.indexOf(NAV_END) + NAV_END.length;
  html = html.slice(0, navS) + nav.trim() + html.slice(navE);

  // Inject footer (if sentinels present)
  if (html.includes('<!-- FOOTER START -->') && html.includes('<!-- FOOTER END -->')) {
    const FTR_START = '<!-- FOOTER START -->';
    const FTR_END   = '<!-- FOOTER END -->';
    const ftrS = html.indexOf(FTR_START);
    const ftrE = html.indexOf(FTR_END) + FTR_END.length;
    html = html.slice(0, ftrS) + footerPartial.trim() + html.slice(ftrE);
  }

  writeFileSync(filePath, html, 'utf8');
  console.log(`  ✓  ${relPath}`);
  updated++;
}

console.log(`\nDone — ${updated} updated, ${skipped} skipped.`);
