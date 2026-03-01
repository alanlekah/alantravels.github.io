import { describe, it, expect } from 'vitest';
import { loadAllHtmlFiles } from './helpers.mjs';

// Feature: website-overhaul
// Task 6.2 — Unit tests for Deals / Shore Excursions page + Cruise Lines page
// Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5

const allFiles = loadAllHtmlFiles();
const deals = allFiles.find(f => f.filename === 'deals.html');
const cruiseLines = allFiles.find(f => f.filename === 'cruise-lines.html');

describe('Deals Page (Shore Excursions)', () => {
  it('has Viator affiliate links in shore excursions section', () => {
    const viatorLinks = deals.$('a[href*="viator.com"]');
    expect(viatorLinks.length).toBeGreaterThanOrEqual(1);
    viatorLinks.each((_, el) => {
      expect(deals.$(el).attr('href')).toContain('pid=P00166026');
    });
  });

  it('has a cross-link to cruise-lines.html', () => {
    const crossLink = deals.$('a[href="cruise-lines.html"]');
    expect(crossLink.length).toBeGreaterThanOrEqual(1);
  });

  it('contains shore excursion destination categories', () => {
    const destinations = ['Caribbean', 'Alaska', 'Mediterranean', 'Hawaii', 'Mexican Riviera', 'Northern Europe'];
    for (const dest of destinations) {
      expect(deals.content).toContain(dest);
    }
  });
});

describe('Cruise Lines Page', () => {
  it('contains all 7 cruise line names', () => {
    const lines = [
      'Virgin Voyages', 'Celebrity', 'MSC', 'Royal Caribbean',
      'Norwegian', 'Princess', 'Carnival'
    ];
    for (const line of lines) {
      expect(cruiseLines.content).toContain(line);
    }
  });

  it('has locally-hosted logo images for each cruise line', () => {
    const logos = cruiseLines.$('main img[src^="images/logo-"]');
    expect(logos.length).toBe(7);
    logos.each((_, el) => {
      const alt = cruiseLines.$(el).attr('alt');
      expect(alt).toBeDefined();
      expect(alt.trim().length).toBeGreaterThan(0);
    });
  });

  it('has a cross-link to deals.html (shore excursions)', () => {
    const crossLink = cruiseLines.$('a[href="deals.html"]');
    expect(crossLink.length).toBeGreaterThanOrEqual(1);
  });

  it('each cruise line card has a CTA linking to contact page', () => {
    const ctaLinks = cruiseLines.$('main a[href="contact.html"]');
    expect(ctaLinks.length).toBeGreaterThanOrEqual(7);
  });
});
