
export type FileCategory = 'EMAILS' | 'STATEMENTS' | 'EVIDENCE';

export interface CaseFile {
  id: string;
  title: string;
  sender: string;
  recipient: string;
  date: string;
  content: string;
  image?: string;
  category: FileCategory;
  isRedacted?: boolean;
  reconstructionPrompt?: string;
}

export interface ArchiveState {
  selectedCaseId: string | null;
  activeCategory: FileCategory;
  isArchivesOpen: boolean;
}
