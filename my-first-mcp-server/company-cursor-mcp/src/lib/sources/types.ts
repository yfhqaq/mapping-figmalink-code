export type SourceKind = "figmaSpec" | "componentRepo" | "docs";

export type DocumentChunk = {
  id: string;
  kind: SourceKind;
  title?: string;
  uri?: string;
  filePath?: string;
  text: string;
};

export type SearchHit = {
  chunk: DocumentChunk;
  score: number;
  snippet?: string;
};

export type SourceAdapter = {
  kind: SourceKind;
  name: string;
  init(): Promise<void>;
  search(query: string, limit: number): Promise<SearchHit[]>;
  getById(id: string): Promise<DocumentChunk | null>;
};


