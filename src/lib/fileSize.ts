import { statSync } from 'node:fs';

/** Size label for a file under public/, read at build time. Import from .astro frontmatter only (never client code). */
export const fileSize = (href: string) => `${(statSync(`public${href}`).size / 1024).toFixed(1)} KB`;
