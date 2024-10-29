export enum EMaterialScope {
  GLOBAL = "global",
  CLASSROOM = "classroom",
}

export enum EMaterialSubject {
  ENGLISH = "english",
}

export enum EMaterialActivity {
  READING = "reading",
  STORY = "story",
  SPEAKING = "speaking",
  WRITING = "writing",
}

export enum EnglishLevel {
  A1 = "A1",
  A2 = "A2",
  B1 = "B1",
  B2 = "B2",
  C1 = "C1",
  C2 = "C2",
}
export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
export interface IContents {
  title: string;
  text: string;
  answers: string[];
  questions: string[];
}
export interface IMaterial {
  id: string;
  user: string;
  classroom: string;
  scope: EMaterialScope;
  subject: EMaterialSubject;
  activity: EMaterialActivity;
  content: Record<string, any>;
  contentPdf: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}
