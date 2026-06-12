export interface NoteMetadata {
  filename: string;
  source: 'GITHUB' | 'S3';
  url?: string;
  lastModified?: Date;
}

export interface StorageAdapter {
  pushToRepository(target: string, filename: string, content: string): Promise<void>;
  listNotes(target: string): Promise<NoteMetadata[]>;
  getNoteContent(target: string, filename: string): Promise<string>;
  deleteNote(target: string, filename: string): Promise<void>;
}
