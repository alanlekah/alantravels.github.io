import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { loadAllHtmlFiles } from './helpers.mjs';

// Feature: website-overhaul
// Tasks 9.5 + 9.6 — Blog property tests and unit tests

const ROOT = resolve(import.meta.dirname, '..');
const allFiles = loadAllHtmlFiles();
const blogIndex = allFiles.find(f => f.filename === 'blog.html');
const blogArticles = allFiles.filter(f => f.filename.startsWith('blog/'));

// Property 6: Blog Article Page Completeness
// Validates: Requirements 3.4, 3.5
describe('Property 6: Blog Article Page Completeness', () => {
  it.each(blogArticles.map(a => [a.filename, a]))('%s has Article JSON-LD with required fields', (_, article) => {
    const jsonLdScripts = article.$('script[type="application/ld+json"]');
    let hasArticle = false;
    jsonLdScripts.each((__, el) => {
      const data = JSON.parse(article.$(el).html());
      if (data['@type'] === 'Article') {
        expect(data).toHaveProperty('headline');
        expect(data).toHaveProperty('author');
        expect(data).toHaveProperty('datePublished');
        expect(data).toHaveProperty('description');
        hasArticle = true;
      }
    });
    expect(hasArticle).toBe(true);
  });

  it.each(blogArticles.map(a => [a.filename, a]))('%s has a CTA link to contact page', (_, article) => {
    const links = article.$('a[href*="contact"]');
    expect(links.length).toBeGreaterThanOrEqual(1);
  });
});

// Property 7: Blog Index Links Resolve to Existing Pages
// Validates: Requirements 3.2
describe('Property 7: Blog Index Links Resolve to Existing Pages', () => {
  it('all article links on blog.html point to existing files', () => {
    const articleLinks = blogIndex.$('a[href*="blog/"]');
    expect(articleLinks.length).toBeGreaterThanOrEqual(1);
    articleLinks.each((_, el) => {
      const href = blogIndex.$(el).attr('href');
      const filePath = join(ROOT, href);
      expect(existsSync(filePath)).toBe(true);
    });
  });
});

// Task 9.6 — Unit tests for blog content
// Validates: Requirements 3.1, 3.3, 3.4
describe('Blog Content Unit Tests', () => {
  it('blog index lists exactly 3 seed articles', () => {
    const articleLinks = blogIndex.$('a[href*="blog/"]');
    const uniqueHrefs = new Set();
    articleLinks.each((_, el) => {
      const href = blogIndex.$(el).attr('href');
      if (href?.endsWith('.html')) uniqueHrefs.add(href);
    });
    expect(uniqueHrefs.size).toBe(3);
  });

  it('there are exactly 3 blog article files', () => {
    expect(blogArticles.length).toBe(3);
  });
});
