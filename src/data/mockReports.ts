import type { IssueReport } from '../lib/storage';

/** Seed data so the dashboard looks alive before live reports. */
export const mockSeedReports: IssueReport[] = [
  { id: 'seed-1', type: 'crowd', landmarkId: 'peristil', landmarkName: 'Peristil', timestamp: Date.now() - 3600000 },
  { id: 'seed-2', type: 'litter', landmarkId: 'riva', landmarkName: 'Riva', timestamp: Date.now() - 7200000 },
  { id: 'seed-3', type: 'noise', landmarkId: 'riva', landmarkName: 'Riva', timestamp: Date.now() - 10800000 },
  { id: 'seed-4', type: 'blocked-passage', landmarkId: 'zlatna-vrata', landmarkName: 'Zlatna vrata', timestamp: Date.now() - 14400000 },
  { id: 'seed-5', type: 'crowd', landmarkId: 'peristil', landmarkName: 'Peristil', timestamp: Date.now() - 18000000 },
];

export const mockBontonViews: Record<string, number> = {
  'respect-residents': 42,
  'keep-passage-clear': 38,
  'no-littering': 31,
  'lower-noise': 27,
  'protect-heritage': 22,
  'dress-appropriately': 18,
};

export const mockInteractionCount = 127;
