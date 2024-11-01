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
export interface IQuestion {
  question: string;
  answer: string;
  options: string[];
}

export interface IMaterial {
  id: string;
  user: string;
  classroom: string | null;
  scope: string;
  subject: string;
  activity: string;
  content: {
    title: string;
    text: string;
    questions: IQuestion[];
  };
  contentPdf: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}
