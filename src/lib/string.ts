export function tokenize(input: string) {
  return input
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function normalizeWhitespace(input: string) {
  return input.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function countOccurrences(haystack: string, needle: string) {
  if (!needle || needle.length < 2) {
    return 0;
  }

  let count = 0;
  let index = 0;

  while (index !== -1) {
    index = haystack.indexOf(needle, index);

    if (index !== -1) {
      count += 1;
      index += needle.length;
    }
  }

  return count;
}
