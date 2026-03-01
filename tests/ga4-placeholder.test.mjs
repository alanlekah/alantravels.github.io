import { describe, it, expect } from 'vitest';
import { loadAllHtmlFiles } from './helpers.mjs';

// Feature: website-overhaul
// Task 14.2 — Unit test verifying GA4 placeholder measurement ID
// Validates: Requirements 6.4

const allFiles = loadAllHtmlFiles();

describe('GA4 Placeholder Measurement ID', () => {
  it.each(allFiles.map(f => [f.filename, f]))('%s has G-XXXXXXXXXX placeholder', (_, file) => {
    expect(file.content).toContain('G-XXXXXXXXXX');
  });
});
