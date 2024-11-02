export enum EMaterialScope {
  GLOBAL = 'global',
  CLASSROOM = 'classroom'
}

export enum EMaterialSubject {
  ENGLISH = 'english',
  COMPUTER_SCIENCE = 'computer science'
}

export enum EMaterialActivity {
  READING = 'reading',
  STORY = 'story',
  SPEAKING = 'speaking',
  WRITING = 'writing',
  ALGORITHM = 'algorithm'
}

export enum EnglishLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export enum AlgorithmLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export interface ReadingActivity {
  title: string;
  text: string;
  questions: {
    question: string;
    options: string[];
    answer: string[];
  }[];
}
