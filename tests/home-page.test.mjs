import { describe, it, expect } from 'vitest';
import { loadAllHtmlFiles } from './helpers.mjs';

// Feature: website-overhaul
// Task 3.6 — Property tests for Home page

const allFiles = loadAllHtmlFiles();
const home = allFiles.find(f => f.filename === 'index.html');

describe('Home Page — Property 1: SEO Meta Completeness', () => {
  // Validates: Requirements 2.1, 2.2, 2.3, 2.4
  it('has a title containing "Alan Lekah"', () => {
    expect(home.$('title').text()).toContain('Alan Lekah');
  });

  it('has a meta description between 120-160 chars', () => {
    const desc = home.$('meta[name="description"]').attr('content') || '';
    expect(desc.length).toBeGreaterThanOrEqual(120);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it('has all four OG tags', () => {
    expect(home.$('meta[property="og:title"]').length).toBe(1);
    expect(home.$('meta[property="og:description"]').length).toBe(1);
    expect(home.$('meta[property="og:image"]').length).toBe(1);
    expect(home.$('meta[property="og:url"]').length).toBe(1);
  });

  it('has a canonical URL', () => {
    const canonical = home.$('link[rel="canonical"]').attr('href');
    expect(canonical).toMatch(/^https:\/\/cruisesbyalan\.com/);
  });
});

describe('Home Page — Property 3: Page Shell Consistency', () => {
  // Validates: Requirements 1.3, 5.4, 5.5, 8.1
  it('has a sticky header with CTA', () => {
    expect(home.$('header').length).toBeGreaterThanOrEqual(1);
    const headerLinks = home.$('header a');
    const hasCTA = headerLinks.toArray().some(a =>
      home.$(a).text().includes('Quote') || home.$(a).text().includes('Call') || home.$(a).attr('href')?.startsWith('tel:')
    );
    expect(hasCTA).toBe(true);
  });

  it('has a footer email signup form with required email input', () => {
    const footerForm = home.$('footer form');
    expect(footerForm.length).toBeGreaterThanOrEqual(1);
    const emailInput = footerForm.find('input[type="email"][required]');
    expect(emailInput.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Home Page — Property 4: Pages Render Without JavaScript', () => {
  // Validates: Requirements 1.4
  it('has no hidden .page class pattern', () => {
    const pageElements = home.$('.page');
    pageElements.each((_, el) => {
      const style = home.$(el).attr('style') || '';
      expect(style).not.toContain('display: none');
      expect(style).not.toContain('display:none');
    });
  });
});

describe('Home Page — Property 9: No External CDN Dependencies', () => {
  // Validates: Requirements 8.4, 8.5
  it('has no Tailwind CDN script', () => {
    const scripts = home.$('script[src]');
    scripts.each((_, el) => {
      expect(home.$(el).attr('src')).not.toContain('cdn.tailwindcss.com');
    });
  });

  it('has no Google Fonts CDN link', () => {
    const links = home.$('link[href]');
    links.each((_, el) => {
      expect(home.$(el).attr('href')).not.toContain('fonts.googleapis.com');
    });
  });

  it('references local CSS file', () => {
    const cssLink = home.$('link[rel="stylesheet"][href*="css/styles.css"]');
    expect(cssLink.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Home Page — Property 10: Analytics Script Present and Async', () => {
  // Validates: Requirements 6.1, 6.3
  it('has GA4 script with async attribute', () => {
    const ga4Script = home.$('script[src*="googletagmanager.com/gtag"]');
    expect(ga4Script.length).toBe(1);
    expect(ga4Script.attr('async')).toBeDefined();
  });
});

describe('Home Page — Property 11: No Breadcrumbs on Home Page', () => {
  // Validates: Requirements 8.2
  it('does not have breadcrumb navigation', () => {
    const breadcrumb = home.$('nav[aria-label="Breadcrumb"]');
    expect(breadcrumb.length).toBe(0);
  });
});

describe('Home Page — Property 13: Semantic HTML Structure', () => {
  // Validates: Requirements 9.2
  it('has header, nav, main, and footer elements', () => {
    expect(home.$('header').length).toBeGreaterThanOrEqual(1);
    expect(home.$('nav').length).toBeGreaterThanOrEqual(1);
    expect(home.$('main').length).toBe(1);
    expect(home.$('footer').length).toBeGreaterThanOrEqual(1);
  });
});
