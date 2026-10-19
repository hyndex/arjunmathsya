// Enquiry form logic with no React and no browser APIs, so it can be imported and checked on its own.
// Nothing here sends, stores or uploads anything: it validates, resolves ?topic= links and builds draft text.
import { z } from 'zod';

// No runtime code generation (keeps the strict Content-Security-Policy free of eval).
z.config({ jitless: true });
import { TOPICS, type TopicId } from '@/data/site';

export const DRAFT_FILENAME = 'Mathsya-Partnership-Enquiry.txt';
export const MIN_MESSAGE = 20;
export const MAX_MESSAGE = 4000;

const topicIds = TOPICS.map((t) => t.id) as [TopicId, ...TopicId[]];

export const enquirySchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(120, 'Use 120 characters or fewer for your name.'),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .pipe(z.email('Enter a valid email address, for example name@company.com.')),
  company: z.string().trim().max(160, 'Use 160 characters or fewer for the company name.'),
  topic: z.enum(topicIds, { error: 'Choose an enquiry category.' }),
  message: z
    .string()
    .trim()
    .min(MIN_MESSAGE, `Describe the problem or proposal in at least ${MIN_MESSAGE} characters.`)
    .max(MAX_MESSAGE, 'Shorten the message to 4,000 characters or fewer.'),
});

export type EnquiryValues = z.infer<typeof enquirySchema>;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Maps a ?topic= value to a topic id. Accepts ids, labels and the legacy alias strings; anything else is ignored. */
export function resolveTopic(raw: string | null | undefined): TopicId | undefined {
  const key = norm(raw ?? '');
  if (!key) return undefined;
  return TOPICS.find((t) => [t.id, t.label, ...t.aliases].some((v) => norm(v) === key))?.id;
}

export type Draft = {
  subject: string;
  /** Plain text shown in the review panel, downloaded and copied. Never rendered as HTML. */
  text: string;
  /** Present only when a public business email is configured. */
  mailto?: string;
};

export function buildDraft(values: EnquiryValues, recipient = ''): Draft {
  const label = TOPICS.find((t) => t.id === values.topic)?.label ?? values.topic;
  const subject = `Mathsya enquiry: ${label}`;
  const body = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Company: ${values.company || 'Not provided'}`,
    `Interest: ${label}`,
    '',
    values.message,
  ].join('\n');
  const to = recipient.trim();
  return {
    subject,
    text: `Subject: ${subject}\n\n${body}`,
    mailto: to ? mailtoFor(to, subject, body) : undefined,
  };
}

/** Conservative length that mail clients across platforms accept for a mailto: URL. */
export const MAILTO_LIMIT = 1900;
const SHORTENED = '\n\n[Shortened for the email draft. The complete text is in the downloaded or copied enquiry.]';

/** Builds the mailto: link, shortening the body (by whole characters, never splitting an emoji) to stay under MAILTO_LIMIT. */
export function mailtoFor(to: string, subject: string, body: string): string {
  const make = (b: string) => `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(b)}`;
  let url = make(body);
  if (url.length <= MAILTO_LIMIT) return url;
  const chars = Array.from(body); // code points, so surrogate pairs stay intact
  let keep = chars.length;
  do {
    keep = Math.floor(keep * 0.9);
    url = make(chars.slice(0, keep).join('').trimEnd() + '…' + SHORTENED);
  } while (url.length > MAILTO_LIMIT && keep > 0);
  return url;
}
