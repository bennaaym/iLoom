import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import io, { Socket } from "socket.io-client";

enum EClassroomQuizEvent {
  START_QUIZ = "start-quiz",
}

interface QuizContext {
  quiz: Record<string, any>;
  startQuiz(materialId: string, cb?: () => void): void;
  endQuiz(materialId: string, cb?: () => void): void;
}

const QuizContext = createContext<QuizContext | undefined>(undefined);

interface Props {
  roomId: string;
  children: ReactNode;
}

export const QuizSocketProvider = ({ roomId, children }: Props) => {
  const socket = useRef<Socket | null>(null);
  const [quiz, setQuiz] = useState<Record<string, any>>([]);

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

    getSocket().on(
      EClassroomQuizEvent.START_QUIZ,
      (quiz: Record<string, any>) => {
        console.log(quiz);
      }
    );

    return () => {
      getSocket().disconnect();
    };
  }, []);

  const startQuiz = (materialId: string, cb?: () => void) => {
    console.log("start ===>");
    getSocket().emit(EClassroomQuizEvent.START_QUIZ, materialId);
    cb && cb();
  };

  const endQuiz = (materialId: string, cb?: () => void) => {
    getSocket().emit(EClassroomQuizEvent.START_QUIZ, materialId);
    cb && cb();
  };

  return (
    <QuizContext.Provider value={{ quiz, startQuiz, endQuiz }}>
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
