import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Feature: website-overhaul
// Task 10.3 — Unit tests for sitemap and robots.txt
// Validates: Requirements 2.5, 2.6

const ROOT = resolve(import.meta.dirname, '..');

describe('sitemap.xml', () => {
  const sitemap = readFileSync(resolve(ROOT, 'sitemap.xml'), 'utf-8');

  const expectedPages = [
    'https://cruisesbyalan.com/',
    'https://cruisesbyalan.com/about.html',
    'https://cruisesbyalan.com/destinations.html',
    'https://cruisesbyalan.com/deals.html',
    'https://cruisesbyalan.com/contact.html',
    'https://cruisesbyalan.com/blog.html',
    'https://cruisesbyalan.com/blog/first-time-cruise-tips.html',
    'https://cruisesbyalan.com/blog/caribbean-destination-guide.html',
    'https://cruisesbyalan.com/blog/best-cruise-deals-2026.html',
  ];

  it('is valid XML with urlset root', () => {
    expect(sitemap).toContain('<?xml');
    expect(sitemap).toContain('<urlset');
    expect(sitemap).toContain('</urlset>');
  });

  it.each(expectedPages)('contains %s', (url) => {
    expect(sitemap).toContain(`<loc>${url}</loc>`);
  });

  it('all entries have lastmod dates', () => {
    const locCount = (sitemap.match(/<loc>/g) || []).length;
    const lastmodCount = (sitemap.match(/<lastmod>/g) || []).length;
    expect(lastmodCount).toBe(locCount);
  });
});

describe('robots.txt', () => {
  const robots = readFileSync(resolve(ROOT, 'robots.txt'), 'utf-8');

  it('allows all user agents', () => {
    expect(robots).toContain('User-agent: *');
  });

  it('allows crawling', () => {
    expect(robots).toContain('Allow: /');
  });

  it('references the sitemap', () => {
    expect(robots).toContain('Sitemap: https://cruisesbyalan.com/sitemap.xml');
  });
});
