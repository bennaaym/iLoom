import { useRouter } from "next/navigation";
import { createContext, useContext, ReactNode, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

enum EClassroomEvent {
  END_CLASSROOM = "end-classroom",
}

interface ClassroomSocketContext {
  endClassroom(): void;
}

const ClassroomSocketContext = createContext<
  ClassroomSocketContext | undefined
>(undefined);

interface Props {
  roomId: string;
  children: ReactNode;
}

export const ClassroomSocketProvider = ({ roomId, children }: Props) => {
  const socket = useRef<Socket | null>(null);
  const router = useRouter();

  const getSocket = () => {
    return socket.current!;
  };

  useEffect(() => {
    if (socket.current) return;

    socket.current = io(`${process.env.NEXT_PUBLIC_API}/classroom`, {
      query: { classroom: roomId },
      withCredentials: true,
      transports: ["websocket"],
    });

    getSocket().on(
      EClassroomEvent.END_CLASSROOM,
      ({ reason }: { reason: "teacher" | "duration" }) => {
        const message =
          reason === "teacher"
            ? "Classroom session was ended by the teacher"
            : "Classroom has reached max duration";

        toast.info(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        router.replace("/classrooms");
      }
    );

    return () => {
      getSocket().disconnect();
    };
  }, []);

  const endClassroom = () => {
    getSocket().emit(EClassroomEvent.END_CLASSROOM);
  };

  return (
    <ClassroomSocketContext.Provider
      value={{
        endClassroom,
      }}
    >
      {children}
    </ClassroomSocketContext.Provider>
  );
};

export const useClassroomSocketProvider = () => {
  const context = useContext(ClassroomSocketContext);
  if (!context) {
    throw new Error(
      "useClassroomSocketProvider must be used within a ClassroomSocketProvider"
    );
  }
  return context;
};
