// Reads the plugin's banks from the repo root at build time, so the site
// never drifts from what the plugin actually ships.

export type Line = {
  kind: 'quote' | 'scene';
  text: string;
  who?: string;
  direction?: string;
  note?: string;
};

export type Situation = {
  heading: string;
  lines: Line[];
};

export type Show = {
  slug: string;
  name: string;
  situations: Situation[];
  lineCount: number;
};

const files = import.meta.glob<string>('../../../plugin/banks/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// "Quote." (Who, direction), note   or   *scene* (Who), note
const LINE = /^(?:"(?<quote>.+?)"|\*(?<scene>.+?)\*)(?:\s*\((?<who>[^)]+)\))?(?:,?\s*(?<note>.+))?$/;

function parseLine(raw: string): Line | null {
  const m = LINE.exec(raw.trim());
  if (!m?.groups) return null;
  const { quote, scene, who, note } = m.groups;
  const [name, ...rest] = (who ?? '').split(',').map((s) => s.trim());
  return {
    kind: quote ? 'quote' : 'scene',
    text: (quote ?? scene)!,
    who: name || undefined,
    direction: rest.join(', ') || undefined,
    note: note?.trim() || undefined,
  };
}

function parseBank(slug: string, source: string): Show {
  let name = slug;
  const situations: Situation[] = [];
  for (const row of source.split('\n')) {
    if (row.startsWith('## ')) name = row.slice(3).trim();
    else if (row.startsWith('### ')) situations.push({ heading: row.slice(4).trim(), lines: [] });
    else if (row.startsWith('- ') && situations.length) {
      const line = parseLine(row.slice(2));
      if (line) situations.at(-1)!.lines.push(line);
    }
  }
  const lineCount = situations.reduce((n, s) => n + s.lines.length, 0);
  return { slug, name, situations, lineCount };
}

const ORDER = ['silicon-valley', 'b99', 'the-office', 'parks-and-rec', 'community', 'arrested-development', 'seinfeld', 'himym', 'friends', 'it-crowd', 'good-place'];
const rank = (slug: string) => (ORDER.indexOf(slug) + 1 || ORDER.length + 1);

export const shows: Show[] = Object.entries(files)
  .map(([path, source]) => parseBank(path.split('/').pop()!.replace(/\.md$/, ''), source))
  .sort((a, b) => rank(a.slug) - rank(b.slug) || a.slug.localeCompare(b.slug));

export type SituationGroup = {
  id: string;
  heading: string;
  entries: { show: Show; line: Line; heading?: string }[];
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Every situation heading across all banks, most widely covered first.
export const situations: SituationGroup[] = (() => {
  const map = new Map<string, SituationGroup>();
  for (const show of shows) {
    for (const s of show.situations) {
      const id = slugify(s.heading);
      const group = map.get(id) ?? { id, heading: s.heading, entries: [] };
      for (const line of s.lines) group.entries.push({ show, line });
      map.set(id, group);
    }
  }
  const showsIn = (g: SituationGroup) => new Set(g.entries.map((e) => e.show.slug)).size;
  return [...map.values()].sort((a, b) => showsIn(b) - showsIn(a) || b.entries.length - a.entries.length);
})();

export const totalLines = shows.reduce((n, s) => n + s.lineCount, 0);
