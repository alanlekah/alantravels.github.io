import { describe, it, expect } from 'vitest';
import { statSync } from 'fs';
import { resolve } from 'path';
import { loadAllHtmlFiles } from './helpers.mjs';

// Feature: website-overhaul
// Task 13 — Cross-site property-based tests (Properties 1-5, 8-16)
// Each test runs against ALL HTML pages in the site.

const ROOT = resolve(import.meta.dirname, '..');
const allFiles = loadAllHtmlFiles();

// ─── Property 1: SEO Meta Completeness ───
// Validates: Requirements 2.1, 2.2, 2.3, 2.4
describe('Property 1: SEO Meta Completeness (all pages)', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s has title containing "Alan Lekah"', (_, file) => {
    expect(file.$('title').text()).toContain('Alan Lekah');
  });

  it.each(allFiles.map(f => [f.filename, f]))('%s has meta description 120-160 chars', (_, file) => {
    const desc = file.$('meta[name="description"]').attr('content') || '';
    expect(desc.length).toBeGreaterThanOrEqual(120);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it.each(allFiles.map(f => [f.filename, f]))('%s has all OG tags', (_, file) => {
    expect(file.$('meta[property="og:title"]').length).toBe(1);
    expect(file.$('meta[property="og:description"]').length).toBe(1);
    expect(file.$('meta[property="og:image"]').length).toBe(1);
    expect(file.$('meta[property="og:url"]').length).toBe(1);
  });

  it.each(allFiles.map(f => [f.filename, f]))('%s has canonical URL', (_, file) => {
    const canonical = file.$('link[rel="canonical"]').attr('href');
    expect(canonical).toMatch(/^https:\/\/cruisesbyalan\.com/);
  });
});

// ─── Property 2: Navigation Links Use Standard Hrefs ───
// Validates: Requirements 1.2
describe('Property 2: Navigation Links Use Standard Hrefs (all pages)', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s nav links use <a href> not onclick', (_, file) => {
    const navLinks = file.$('header a, #mobile-menu a');
    navLinks.each((__, el) => {
      const href = file.$(el).attr('href');
      const onclick = file.$(el).attr('onclick');
      expect(onclick).toBeUndefined();
      expect(href).toBeDefined();
    });
  });
});

// ─── Property 3: Page Shell Consistency ───
// Validates: Requirements 1.3, 5.4, 5.5, 8.1
describe('Property 3: Page Shell Consistency (all pages)', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s has header with CTA', (_, file) => {
    const headerLinks = file.$('header a');
    const hasCTA = headerLinks.toArray().some(a =>
      file.$(a).text().includes('Quote') || file.$(a).text().includes('Call') || file.$(a).attr('href')?.startsWith('tel:')
    );
    expect(hasCTA).toBe(true);
  });

  it.each(allFiles.map(f => [f.filename, f]))('%s has footer email signup with required email', (_, file) => {
    const footerForm = file.$('footer form');
    expect(footerForm.length).toBeGreaterThanOrEqual(1);
    const emailInput = footerForm.find('input[type="email"][required]');
    expect(emailInput.length).toBeGreaterThanOrEqual(1);
  });
});

// ─── Property 4: Pages Render Without JavaScript ───
// Validates: Requirements 1.4
describe('Property 4: Pages Render Without JavaScript (all pages)', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s has no hidden .page class', (_, file) => {
    const pageElements = file.$('.page');
    pageElements.each((__, el) => {
      const style = file.$(el).attr('style') || '';
      expect(style).not.toContain('display: none');
      expect(style).not.toContain('display:none');
    });
  });
});

// ─── Property 5: HTML File Size Under 100KB ───
// Validates: Requirements 1.5
describe('Property 5: HTML File Size Under 100KB (all pages)', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s is under 100KB', (_, file) => {
    const filePath = resolve(ROOT, file.filename);
    const stats = statSync(filePath);
    expect(stats.size).toBeLessThan(100000);
  });
});

// ─── Property 8: Gallery Images Use Lazy Loading ───
// Validates: Requirements 4.4
describe('Property 8: Gallery Images Use Lazy Loading', () => {
  const home = allFiles.find(f => f.filename === 'index.html');
  it('all gallery images have loading="lazy"', () => {
    const galleryImgs = home.$('#gallery img, [id*="gallery"] img, section:has(img[loading="lazy"]) img');
    if (galleryImgs.length > 0) {
      galleryImgs.each((_, el) => {
        expect(home.$(el).attr('loading')).toBe('lazy');
      });
    }
  });
});

// ─── Property 9: No External CDN Dependencies ───
// Validates: Requirements 8.4, 8.5
describe('Property 9: No External CDN Dependencies (all pages)', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s has no Tailwind CDN', (_, file) => {
    const scripts = file.$('script[src]');
    scripts.each((__, el) => {
      expect(file.$(el).attr('src')).not.toContain('cdn.tailwindcss.com');
    });
  });

  it.each(allFiles.map(f => [f.filename, f]))('%s has no Google Fonts CDN', (_, file) => {
    const links = file.$('link[href]');
    links.each((__, el) => {
      expect(file.$(el).attr('href')).not.toContain('fonts.googleapis.com');
    });
  });
});

// ─── Property 10: Analytics Script Present and Async ───
// Validates: Requirements 6.1, 6.3
describe('Property 10: Analytics Script Present and Async (all pages)', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s has async GA4 script', (_, file) => {
    const ga4 = file.$('script[src*="googletagmanager.com/gtag"]');
    expect(ga4.length).toBe(1);
    expect(ga4.attr('async')).toBeDefined();
  });
});

// ─── Property 11: Breadcrumbs on Non-Home Pages ───
// Validates: Requirements 8.2
describe('Property 11: Breadcrumbs on Non-Home Pages (all pages)', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s has correct breadcrumb presence', (_, file) => {
    const breadcrumb = file.$('nav[aria-label="Breadcrumb"]');
    if (file.filename === 'index.html') {
      expect(breadcrumb.length).toBe(0);
    } else {
      expect(breadcrumb.length).toBe(1);
    }
  });
});

// ─── Property 12: All Images Have Alt Text ───
// Validates: Requirements 9.1
describe('Property 12: All Images Have Alt Text (all pages)', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s all <img> have non-empty alt', (_, file) => {
    const imgs = file.$('img');
    imgs.each((__, el) => {
      const alt = file.$(el).attr('alt');
      expect(alt).toBeDefined();
      expect(alt.trim().length).toBeGreaterThan(0);
    });
  });
});

// ─── Property 13: Semantic HTML Structure ───
// Validates: Requirements 9.2
describe('Property 13: Semantic HTML Structure (all pages)', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s has header, nav, main, footer', (_, file) => {
    expect(file.$('header').length).toBeGreaterThanOrEqual(1);
    expect(file.$('nav').length).toBeGreaterThanOrEqual(1);
    expect(file.$('main').length).toBe(1);
    expect(file.$('footer').length).toBeGreaterThanOrEqual(1);
  });
});

// ─── Property 14: ARIA Labels on Icon-Only Elements ───
// Validates: Requirements 9.5
describe('Property 14: ARIA Labels on Icon-Only Interactive Elements (all pages)', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s icon-only buttons/links have aria-label', (_, file) => {
    // Check buttons and links that contain only <i> or <svg> (icon-only)
    const interactives = file.$('button, a');
    interactives.each((__, el) => {
      const $el = file.$(el);
      const text = $el.text().trim();
      const hasIcon = $el.find('i, svg').length > 0;
      // If element has an icon and very little text, it should have aria-label
      if (hasIcon && text.length <= 1) {
        expect($el.attr('aria-label')).toBeDefined();
        expect($el.attr('aria-label').trim().length).toBeGreaterThan(0);
      }
    });
  });
});

// ─── Property 15: Interactive Elements Are Keyboard Accessible ───
// Validates: Requirements 9.3
describe('Property 15: Interactive Elements Are Keyboard Accessible (all pages)', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s has no div/span onclick handlers', (_, file) => {
    const divClicks = file.$('div[onclick], span[onclick]');
    expect(divClicks.length).toBe(0);
  });
});

// ─── Property 16: Responsive Images Use srcset ───
// Validates: Requirements 8.3
describe('Property 16: Responsive Images Use srcset (all pages)', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s content images have srcset', (_, file) => {
    // Check images in main content area (not icons/logos)
    const contentImgs = file.$('main img, article img');
    contentImgs.each((__, el) => {
      const src = file.$(el).attr('src') || '';
      // Only check substantial images (not tiny icons)
      if (src.includes('unsplash') || src.includes('images/')) {
        expect(file.$(el).attr('srcset')).toBeDefined();
      }
    });
  });
});
