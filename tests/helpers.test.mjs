import { describe, it, expect } from 'vitest';
import { loadAllHtmlFiles } from './helpers.mjs';

describe('loadAllHtmlFiles', () => {
  it('returns an array of HTML file objects', () => {
    const files = loadAllHtmlFiles();
    expect(Array.isArray(files)).toBe(true);
  });

  it('each entry has filename, content, and $ properties', () => {
    const files = loadAllHtmlFiles();
    for (const file of files) {
      expect(file).toHaveProperty('filename');
      expect(file).toHaveProperty('content');
      expect(file).toHaveProperty('$');
      expect(typeof file.filename).toBe('string');
      expect(typeof file.content).toBe('string');
      expect(typeof file.$).toBe('function');
    }
  });

  it('excludes _template.html', () => {
    const files = loadAllHtmlFiles();
    const filenames = files.map(f => f.filename);
    expect(filenames).not.toContain('_template.html');
  });

  it('includes index.html if it exists', () => {
    const files = loadAllHtmlFiles();
    const filenames = files.map(f => f.filename);
    expect(filenames).toContain('index.html');
  });

  it('cheerio instance can parse HTML', () => {
    const files = loadAllHtmlFiles();
    if (files.length > 0) {
      const { $ } = files[0];
      // Should be able to query the document
      expect($('html').length).toBeGreaterThanOrEqual(1);
    }
  });
});
