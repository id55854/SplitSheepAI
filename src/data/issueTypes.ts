export type IssueType =
  | 'crowd'
  | 'litter'
  | 'noise'
  | 'blocked-passage'
  | 'inappropriate-behavior'
  | 'heritage-damage';

export interface IssueOption {
  id: IssueType;
  labelHr: string;
  labelEn: string;
  emoji: string;
}

export const issueOptions: IssueOption[] = [
  { id: 'crowd', labelHr: 'Gužva', labelEn: 'Crowd', emoji: '👥' },
  { id: 'litter', labelHr: 'Smeće', labelEn: 'Litter', emoji: '🗑️' },
  { id: 'noise', labelHr: 'Buka', labelEn: 'Noise', emoji: '🔊' },
  { id: 'blocked-passage', labelHr: 'Blokiran prolaz', labelEn: 'Blocked passage', emoji: '🚧' },
  { id: 'inappropriate-behavior', labelHr: 'Neprimjereno ponašanje', labelEn: 'Inappropriate behavior', emoji: '⚠️' },
  { id: 'heritage-damage', labelHr: 'Oštećenje baštine', labelEn: 'Heritage damage', emoji: '🏛️' },
];

export function getIssueLabel(
  option: IssueOption,
  lang: 'en' | 'hr' | 'riva',
): string {
  return lang === 'en' ? option.labelEn : option.labelHr;
}

export const issueTypeLabels: Record<IssueType, string> = {
  crowd: 'Gužva',
  litter: 'Smeće',
  noise: 'Buka',
  'blocked-passage': 'Blokiran prolaz',
  'inappropriate-behavior': 'Neprimjereno ponašanje',
  'heritage-damage': 'Oštećenje baštine',
};
