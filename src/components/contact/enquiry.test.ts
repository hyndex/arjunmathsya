import { describe, expect, it } from 'vitest';
import { buildDraft, enquirySchema, mailtoFor, MAILTO_LIMIT, resolveTopic, type EnquiryValues } from './enquiry';

const valid: EnquiryValues = {
  name: 'Asha Rao',
  email: 'asha@example.com',
  company: '',
  topic: 'pmg',
  message: 'We would like to scope a charging-readiness pilot on one vehicle program.',
};

describe('resolveTopic', () => {
  it('accepts ids, labels and every legacy ?topic= string from the previous site', () => {
    expect(resolveTopic('investor')).toBe('investor');
    expect(resolveTopic('PMG software pilot')).toBe('pmg');
    const legacy: Record<string, string> = {
      'Battery & Charging AI': 'battery',
      'PMG pilot': 'pmg',
      'Evo Core collaboration': 'evo',
      'Investment discussion': 'investor',
      'Engineering tools': 'research',
      'Portfolio / integration': 'oem-pilot',
      'General partnership': 'partnership',
    };
    for (const [raw, id] of Object.entries(legacy)) expect(resolveTopic(raw)).toBe(id);
  });
  it('ignores empty, unknown and hostile values', () => {
    expect(resolveTopic(null)).toBeUndefined();
    expect(resolveTopic('')).toBeUndefined();
    expect(resolveTopic('<script>alert(1)</script>')).toBeUndefined();
    expect(resolveTopic('crypto')).toBeUndefined();
  });
});

describe('enquirySchema', () => {
  it('accepts a complete enquiry and trims fields', () => {
    const r = enquirySchema.safeParse({ ...valid, name: '  Asha Rao  ' });
    expect(r.success && r.data.name).toBe('Asha Rao');
  });
  it('rejects whitespace-only names, bad emails, short messages and unknown topics', () => {
    expect(enquirySchema.safeParse({ ...valid, name: '   ' }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...valid, email: 'asha@' }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...valid, message: 'Too short' }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...valid, topic: 'other' }).success).toBe(false);
  });
});

describe('buildDraft', () => {
  it('builds plain text and offers no email link while the inbox is unconfigured', () => {
    const d = buildDraft(valid);
    expect(d.mailto).toBeUndefined();
    expect(d.text).toContain('Subject: Mathsya enquiry: PMG software pilot');
    expect(d.text).toContain('Company: Not provided');
    expect(d.text).not.toMatch(/sent|submitted/i);
  });
  it('adds a mailto link only for a configured recipient', () => {
    expect(buildDraft(valid, ' team@example.com ').mailto).toMatch(/^mailto:team@example\.com\?subject=/);
  });
});

describe('mailtoFor', () => {
  it('leaves short drafts untouched', () => {
    const url = mailtoFor('a@example.com', 'Hi', 'Short body');
    expect(decodeURIComponent(url.split('body=')[1])).toBe('Short body');
  });
  it('shortens long drafts under the limit without splitting emoji', () => {
    const body = 'Charging readiness 🚗⚡ '.repeat(400);
    const url = mailtoFor('a@example.com', 'Mathsya enquiry', body);
    expect(url.length).toBeLessThanOrEqual(MAILTO_LIMIT);
    const decoded = decodeURIComponent(url.split('body=')[1]); // throws on a split surrogate pair
    expect(decoded).toContain('[Shortened for the email draft.');
  });
});
