import { describe, it, expect } from 'vitest';
import { loadAllHtmlFiles } from './helpers.mjs';

// Feature: website-overhaul
// Task 14.2 — Unit test verifying GA4 measurement ID is present
// Validates: Requirements 6.4

const allFiles = loadAllHtmlFiles();

describe('GA4 Measurement ID', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s has GA4 measurement ID G-VNKMY0MW57', (_, file) => {
    expect(file.content).toContain('G-VNKMY0MW57');
  });
});
