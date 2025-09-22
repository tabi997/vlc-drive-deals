export type DescriptionBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'list'; items: string[] };

const HTML_TAG_REGEX = /<[^>]*>/g;

export const parseDescription = (raw?: string | null): DescriptionBlock[] => {
  if (!raw) return [];

  const normalized = raw
    .replace(/\u00a0/g, ' ')
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<br\s*\/?\>/gi, '\n')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(HTML_TAG_REGEX, '')
    .replace(/\r/g, '\n');

  const rawLines = normalized
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: DescriptionBlock[] = [];
  let currentList: string[] | null = null;

  const flushList = () => {
    if (currentList && currentList.length) {
      blocks.push({ type: 'list', items: currentList });
    }
    currentList = null;
  };

  rawLines.forEach((line) => {
    if (line.startsWith('•')) {
      const item = line.replace(/^•\s*/, '').trim();
      if (!item) return;
      if (!currentList) {
        currentList = [];
      }
      currentList.push(item);
    } else {
      flushList();
      blocks.push({ type: 'paragraph', content: line });
    }
  });

  flushList();

  return blocks;
};
