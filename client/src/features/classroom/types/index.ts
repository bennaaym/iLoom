export interface Classroom {
  id: string;
  teacher: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  capacity: number;
  shareableCode: string;
  transcript: string;
  summary: string;
}

export type Subject = "english" | "algorithms";
export interface IQuestion {
  question: string;
  answer: string;
  options: string[];
}
export interface Material {
  id: string;
  user: string;
  classroom: string;
  scope: "global" | "classroom";
  subject: Subject;
  activity: string;
  content: Record<string, any>;
  contentPdf: string;
  createdAt: string;
  updatedAt: string;
}
