export interface StorageAdapter {
  pushToRepository(target: string, filename: string, content: string): Promise<void>;
}
