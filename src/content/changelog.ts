/**
 * "What shipped recently" on the homepage, modelled on attio.com's changelog strip.
 *
 * Only real, shipped product changes, with the date they reached customers. If the
 * list is empty the section is not rendered, so nothing here needs a placeholder.
 * Newest first; the homepage shows the first four.
 */
export type ChangelogEntry = {
  /** ISO date, e.g. "2026-11-04". */
  date: string
  title: string
  summary: string
  /** Optional internal link for more detail. */
  href?: string
}

export const CHANGELOG: ChangelogEntry[] = []
