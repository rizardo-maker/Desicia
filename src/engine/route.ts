/** Single route state: semantic chapters own exact progress; the renderer damps it. */
export const route = { progress: 0, chapter: 0, paused: false };
export const chapterIds = [
  "signal",
  "intelligence",
  "automation",
  "transformation",
  "contact",
] as const;
export const cameras = [
  [10, 7, 13],
  [7, 9, 15],
  [13, 5, 10],
  [9, 10, 14],
  [11, 8, 16],
];
