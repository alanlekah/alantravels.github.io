import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import * as cheerio from 'cheerio';

/**
 * Project root directory (one level up from tests/).
 */
const ROOT = resolve(import.meta.dirname, '..');

/**
 * Loads all HTML files from the project root and blog/ directory,
 * excluding _template.html.
 *
 * @returns {Array<{ filename: string, content: string, $: cheerio.CheerioAPI }>}
 */
export function loadAllHtmlFiles() {
  const files = [];

  // Root-level HTML files
  for (const entry of readdirSync(ROOT)) {
    if (entry.endsWith('.html') && entry !== '_template.html') {
      const filepath = join(ROOT, entry);
      const content = readFileSync(filepath, 'utf-8');
      files.push({ filename: entry, content, $: cheerio.load(content) });
    }
  }

  // blog/ directory HTML files
  const blogDir = join(ROOT, 'blog');
  if (existsSync(blogDir)) {
    for (const entry of readdirSync(blogDir)) {
      if (entry.endsWith('.html')) {
        const filepath = join(blogDir, entry);
        const content = readFileSync(filepath, 'utf-8');
        files.push({ filename: `blog/${entry}`, content, $: cheerio.load(content) });
      }
    }
  }

  return files;
}
