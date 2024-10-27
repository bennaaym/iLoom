export interface Classroom {
  id: string;
  teacher: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  capacity: number;
  shareableCode: string;
}

export type Subject = "english" | "algorithms";

export interface Material {
  id: string;
  user: string;
  classroom: string;
  scope: "global" | "classroom";
  subject: Subject;
  activity: string;
  content: Record<string, ExplicityAny>;
  createdAt: string;
  updatedAt: string;
}
