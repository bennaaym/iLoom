import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import io, { Socket } from "socket.io-client";
import { toast } from "react-toastify";

enum EClassroomQuizEvent {
  START_QUIZ = "start-quiz",
  END_QUIZ = "end-quiz",
  SUBMIT_QUIZ = "submit-quiz",
}
interface QuizQuestion {
  question: string;
  options: string[];
}

export interface Quiz {
  teacher: string;
  classroom: string;
  material: string;
  questions: QuizQuestion[];
}

interface QuizContext {
  isQuizRunning: boolean;
  quiz: Quiz | null;
  startQuiz(materialId: string): void;
  endQuiz(): void;
  submitQuiz(): void;
}

const QuizContext = createContext<QuizContext | undefined>(undefined);

interface Props {
  roomId: string;
  children: ReactNode;
}

export const QuizSocketProvider = ({ roomId, children }: Props) => {
  const socket = useRef<Socket | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const getSocket = () => {
    return socket.current!;
  };

  useEffect(() => {
    if (socket.current) return;

    socket.current = io(`${process.env.NEXT_PUBLIC_API}/classroom-quiz`, {
      query: { classroom: roomId },
      withCredentials: true,
      transports: ["websocket"],
    });

    getSocket().on(EClassroomQuizEvent.START_QUIZ, (quiz: Quiz) => {
      setQuiz(quiz);
    });

    getSocket().on(EClassroomQuizEvent.END_QUIZ, () => {
      setQuiz(null);
    });

    getSocket().on(EClassroomQuizEvent.SUBMIT_QUIZ, ({ student }) => {
      toast.success(`${student.name} submitted`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "colored",
      });
    });

    return () => {
      getSocket().disconnect();
    };
  }, []);

  const startQuiz = (materialId: string) => {
    getSocket().emit(EClassroomQuizEvent.START_QUIZ, materialId);
  };

  const endQuiz = () => {
    getSocket().emit(EClassroomQuizEvent.END_QUIZ);
  };

  const submitQuiz = () => {
    getSocket().emit(EClassroomQuizEvent.SUBMIT_QUIZ);
  };

  return (
    <QuizContext.Provider
      value={{
        quiz,
        isQuizRunning: Boolean(quiz),
        startQuiz,
        endQuiz,
        submitQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useClassroomQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error(
      "useClassroomQuiz must be used within a QuizSocketProvider"
    );
  }
  return context;
};
