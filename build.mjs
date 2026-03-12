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
const BASE_URL = 'https://perceptionmm.com';

const PAGE_MAP = {
  'index.html':                                { topLink: '/index.html',                    dropdownItem: null,                              mobileActive: null,            canonical: `${BASE_URL}/`,                                        title: 'Perception Multimedia — Marketing Agency in Cleveland, OH',                       description: 'Perception Multimedia is a full-service digital marketing agency in Middleburg Heights, OH — video production, web design, social media, SEO, photography, and more for Northeast Ohio businesses.' },
  'about.html':                                { topLink: '/about.html',                    dropdownItem: null,                              mobileActive: null,            canonical: `${BASE_URL}/about.html`,                              title: 'About Us — Perception Multimedia | Northeast Ohio',                               description: 'Meet the team behind Perception Multimedia — a collaborative digital marketing agency in Northeast Ohio specializing in video, web design, photography, and integrated marketing strategy.' },
  'philanthropy.html':                         { topLink: '/philanthropy.html',             dropdownItem: null,                              mobileActive: null,            canonical: `${BASE_URL}/philanthropy.html`,                        title: 'Philanthropy — Perception Multimedia Inc.',                                       description: 'Perception Multimedia is proud to give back to the Northeast Ohio community. Learn about our philanthropy efforts and charitable partnerships.' },
  'contact.html':                              { topLink: '/contact.html',                  dropdownItem: null,                              mobileActive: '/contact.html', canonical: `${BASE_URL}/contact.html`,                            title: 'Contact — Perception Multimedia | Middleburg Heights, OH',                        description: 'Contact Perception Multimedia in Middleburg Heights, OH. Call (440) 340-1115 or send a message to start your next marketing project with our Northeast Ohio team.' },
  'clients/index.html':                        { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,            canonical: `${BASE_URL}/clients/`,                                title: 'Client Work & Case Studies — Perception Multimedia',                              description: 'See how Perception Multimedia has helped brands like Bob Evans, Moen, Oatey, and more achieve their marketing goals through video production, web design, and creative strategy.' },
  'clients/fat-heads.html':                    { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,            canonical: `${BASE_URL}/clients/fat-heads.html`,                  title: "Fat Head's Brewery — Perception Multimedia",                                      description: "See how Perception Multimedia helped Fat Head's Brewery grow their brand with social media content, video production, and digital marketing across Northeast Ohio." },
  'clients/bob-evans.html':                    { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,            canonical: `${BASE_URL}/clients/bob-evans.html`,                  title: 'Bob Evans Farms — Perception Multimedia',                                         description: 'Perception Multimedia partnered with Bob Evans Farms to produce brand videos and digital marketing content that connect with audiences across the country.' },
  'clients/cleveland-boat-show.html':          { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,            canonical: `${BASE_URL}/clients/cleveland-boat-show.html`,        title: 'Cleveland Boat Show — Perception Multimedia',                                     description: "Discover how Perception Multimedia elevated the Cleveland Boat Show's digital presence with email marketing, social media strategy, and video content." },
  'clients/southwest-general.html':            { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,            canonical: `${BASE_URL}/clients/southwest-general.html`,          title: 'Southwest General Hospital — Perception Multimedia',                              description: 'See how Perception Multimedia helped Southwest General Hospital connect with patients through compelling video production and digital marketing in Northeast Ohio.' },
  'clients/pse-credit-union.html':            { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,             canonical: `${BASE_URL}/clients/pse-credit-union.html`,           title: 'PSE Credit Union — Perception Multimedia',                                        description: 'Perception Multimedia partnered with PSE Credit Union to create compelling video content and targeted digital marketing campaigns for their members.' },
  'clients/moen.html':                        { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,             canonical: `${BASE_URL}/clients/moen.html`,                        title: 'Moen — Perception Multimedia',                                                    description: "See how Perception Multimedia supported Moen — one of North America's leading faucet brands — with video production and creative marketing content." },
  'clients/npa-coatings.html':               { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,              canonical: `${BASE_URL}/clients/npa-coatings.html`,               title: 'NPA Coatings — Perception Multimedia',                                            description: "Perception Multimedia built NPA Coatings' web presence and captured their work with professional photography and custom website design in Northeast Ohio." },
  'clients/oatey.html':                      { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,              canonical: `${BASE_URL}/clients/oatey.html`,                       title: 'Oatey — Perception Multimedia',                                                   description: 'See how Perception Multimedia partnered with Oatey — a leading name in the plumbing industry — on video production and digital marketing campaigns.' },
  'clients/polaris.html':                    { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,              canonical: `${BASE_URL}/clients/polaris.html`,                     title: 'Polaris Career Center — Perception Multimedia',                                   description: 'Perception Multimedia helped Polaris Career Center grow community awareness and student enrollment through video production and targeted digital marketing.' },
  'clients/avery-dennison.html':             { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,              canonical: `${BASE_URL}/clients/avery-dennison.html`,             title: 'Avery Dennison — Perception Multimedia',                                          description: 'Perception Multimedia created video content and digital marketing campaigns for Avery Dennison, a global leader in labeling and packaging materials.' },
  'clients/hill-n-dale.html':               { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,              canonical: `${BASE_URL}/clients/hill-n-dale.html`,                title: 'Hill N Dale Club — Perception Multimedia',                                        description: 'See how Perception Multimedia helped Hill N Dale Club connect with members and grow their community through video production and digital marketing.' },
  'clients/dap.html':                        { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,              canonical: `${BASE_URL}/clients/dap.html`,                         title: 'DAP — Perception Multimedia',                                                     description: "Perception Multimedia partnered with DAP — one of America's most trusted home improvement brands — to produce video content and digital marketing campaigns." },
  'clients/hannahs-home.html':              { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,               canonical: `${BASE_URL}/clients/hannahs-home.html`,               title: "Hannah's Home — Perception Multimedia",                                           description: "Perception Multimedia helped Hannah's Home share their life-changing mission through powerful video storytelling and digital marketing campaigns." },
  'clients/tovolo.html':                     { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,              canonical: `${BASE_URL}/clients/tovolo.html`,                      title: 'Tovolo — Perception Multimedia',                                                  description: 'Perception Multimedia produced social media videos and product content for Tovolo, helping the kitchen tools brand engage home cooks with creative digital marketing.' },
  'clients/action-door.html':               { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,              canonical: `${BASE_URL}/clients/action-door.html`,                title: 'Action Door & Window — Perception Multimedia',                                    description: 'See how Perception Multimedia helped Action Door & Window grow their business with video commercials, email marketing, and a custom website design.' },
  'clients/jim-kaminski.html':              { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,               canonical: `${BASE_URL}/clients/jim-kaminski.html`,               title: 'Jim Kaminski for Mayor — Perception Multimedia',                                  description: "Perception Multimedia created political video content and digital marketing strategy for Jim Kaminski's mayoral campaign in Strongsville, Ohio." },
  'clients/gales-garden-center.html':      { topLink: '/clients/index.html',            dropdownItem: null,                              mobileActive: null,               canonical: `${BASE_URL}/clients/gales-garden-center.html`,        title: "Gale's Garden Center — Perception Multimedia",                                    description: "Perception Multimedia helped Gale's Garden Center grow their seasonal business with video production and social media marketing in Northeast Ohio." },
  'services/index.html':                       { topLink: '/services/index.html',           dropdownItem: null,                              mobileActive: null,            canonical: `${BASE_URL}/services/`,                               title: 'Marketing Services — Perception Multimedia | Ohio',                               description: "Explore Perception Multimedia's full range of marketing services: video production, web design, social media, search marketing, email campaigns, photography, and more." },
  'services/video-production.html':            { topLink: '/services/index.html',           dropdownItem: '/services/video-production.html', mobileActive: null,           canonical: `${BASE_URL}/services/video-production.html`,          title: 'Video Production Services — Perception Multimedia',                               description: 'Perception Multimedia produces compelling brand videos, commercials, and social media content for businesses across Northeast Ohio and beyond. Tell your story on screen.' },
  'services/search-marketing.html':            { topLink: '/services/index.html',           dropdownItem: '/services/search-marketing.html', mobileActive: null,           canonical: `${BASE_URL}/services/search-marketing.html`,          title: 'Search Marketing & Google Ads — Perception Multimedia',                           description: "Drive more leads with Perception Multimedia's search marketing services. Google Ads, PPC management, and local SEO strategies for businesses in Northeast Ohio." },
  'services/website-design.html':              { topLink: '/services/index.html',           dropdownItem: '/services/website-design.html',   mobileActive: null,           canonical: `${BASE_URL}/services/website-design.html`,            title: 'Website Design Services — Perception Multimedia',                                 description: 'Custom website design and development by Perception Multimedia. We build fast, responsive, conversion-focused websites for businesses in Cleveland and Northeast Ohio.' },
  'services/social-media.html':                { topLink: '/services/index.html',           dropdownItem: '/services/social-media.html',     mobileActive: null,           canonical: `${BASE_URL}/services/social-media.html`,              title: 'Social Media Management — Perception Multimedia',                                 description: "Grow your brand with Perception Multimedia's social media management — strategy, content creation, and community management tailored for Northeast Ohio businesses." },
  'services/email-campaigns.html':             { topLink: '/services/index.html',           dropdownItem: '/services/email-campaigns.html',  mobileActive: null,           canonical: `${BASE_URL}/services/email-campaigns.html`,           title: 'Email Marketing Campaigns — Perception Multimedia',                               description: 'Perception Multimedia designs and manages email marketing campaigns that convert. Mailchimp-certified experts serving businesses across Cleveland and Northeast Ohio.' },
  'services/photography.html':                 { topLink: '/services/index.html',           dropdownItem: '/services/photography.html',      mobileActive: null,           canonical: `${BASE_URL}/services/photography.html`,               title: 'Commercial Photography — Perception Multimedia',                                  description: 'Professional commercial photography from Perception Multimedia — headshots, product photos, event coverage, and architectural imagery for businesses in Northeast Ohio.' },
  'services/graphic-design.html':              { topLink: '/services/index.html',           dropdownItem: '/services/graphic-design.html',           mobileActive: null,  canonical: `${BASE_URL}/services/graphic-design.html`,            title: 'Branding & Logo Design — Perception Multimedia',                                  description: 'Brand identity, logo design, and graphic design from Perception Multimedia. We craft visual identities that set businesses apart across Cleveland and Northeast Ohio.' },
  'services/traditional-media.html':           { topLink: '/services/index.html',           dropdownItem: '/services/traditional-media.html',        mobileActive: null,  canonical: `${BASE_URL}/services/traditional-media.html`,         title: 'Traditional Media Advertising — Perception Multimedia',                           description: 'TV, radio, print, and outdoor advertising from Perception Multimedia. Strategic traditional media planning and buying for businesses in the Cleveland market.' },
  'services/google-business-profile.html':     { topLink: '/services/index.html',           dropdownItem: '/services/google-business-profile.html',  mobileActive: null,  canonical: `${BASE_URL}/services/google-business-profile.html`,   title: 'Google Business Profile Management — Perception Multimedia',                      description: 'Perception Multimedia optimizes and manages Google Business Profiles for businesses across Cleveland and Northeast Ohio. Improve your local search visibility, Google Maps ranking, and online reputation.' },
  'services/reputation-management.html':       { topLink: '/services/index.html',           dropdownItem: '/services/reputation-management.html',    mobileActive: null,  canonical: `${BASE_URL}/services/reputation-management.html`,     title: 'Online Reputation Management — Perception Multimedia',                            description: 'Perception Multimedia helps businesses in Cleveland and Northeast Ohio manage, monitor, and grow their online reputation. Review generation, monitoring, and response management.' },
  'blog/index.html':                           { topLink: '/blog/index.html',               dropdownItem: null,                                      mobileActive: null,  canonical: `${BASE_URL}/blog/`,                                   title: 'Blog — Perception Multimedia | Marketing Insights',                               description: "Marketing tips, campaign insights, and industry news from Perception Multimedia — Northeast Ohio's collaborative digital marketing agency." },
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

for (const [relPath, { topLink, dropdownItem, mobileActive, canonical, title, description }] of Object.entries(PAGE_MAP)) {
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

  // Inject favicon if not already present
  if (!html.includes('rel="icon"')) {
    html = html.replace(
      '<meta charset="UTF-8">',
      '<meta charset="UTF-8">\n  <link rel="icon" href="/brand_assets/pmm-symbol.svg" type="image/svg+xml">'
    );
  }

  // Inject GTM snippets if not already present
  if (!html.includes('GTM-MFL6XRS')) {
    // Head snippet — as high as possible, right after charset
    const gtmHead = [
      '<!-- Google Tag Manager -->',
      '  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':',
      '  new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],',
      '  j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=',
      '  \'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);',
      '  })(window,document,\'script\',\'dataLayer\',\'GTM-MFL6XRS\');</script>',
      '  <!-- End Google Tag Manager -->',
    ].join('\n');
    html = html.replace('<meta charset="UTF-8">', `<meta charset="UTF-8">\n  ${gtmHead}`);

    // Body noscript — immediately after opening <body> tag
    const gtmNoscript = [
      '<!-- Google Tag Manager (noscript) -->',
      '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MFL6XRS"',
      'height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>',
      '<!-- End Google Tag Manager (noscript) -->',
    ].join('\n');
    html = html.replace(/(<body[^>]*>)/, `$1\n${gtmNoscript}`);
  }

  // Update <title>
  if (title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  }

  // Inject or update meta description
  if (description) {
    const metaTag = `<meta name="description" content="${description}">`;
    if (html.includes('<meta name="description"')) {
      html = html.replace(/<meta name="description"[^>]*>/g, metaTag);
    } else {
      html = html.replace(/(<\/title>)/, `$1\n  ${metaTag}`);
    }
  }

  // Inject or update canonical tag
  if (canonical) {
    const canonicalTag = `<link rel="canonical" href="${canonical}">`;
    if (html.includes('<link rel="canonical"')) {
      html = html.replace(/<link rel="canonical"[^>]*>/g, canonicalTag);
    } else {
      html = html.replace(/(<\/title>)/, `$1\n  ${canonicalTag}`);
    }
  }

  writeFileSync(filePath, html, 'utf8');
  console.log(`  ✓  ${relPath}`);
  updated++;
}

console.log(`\nDone — ${updated} updated, ${skipped} skipped.`);
