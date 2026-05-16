import { landmarks, type Language } from '../data/landmarks';
import { reportResponses } from '../data/reportResponses';

export function getLandmarkMessage(landmarkIndex: number, language: Language): string {
  const landmark = landmarks[landmarkIndex];
  if (!landmark) return '';
  return landmark.messages[language];
}

export function getReportConfirmation(language: Language): string {
  return reportResponses[language];
}
