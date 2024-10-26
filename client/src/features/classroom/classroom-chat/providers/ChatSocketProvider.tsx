import { User } from "@/features/auth/types";
import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import io, { Socket } from "socket.io-client";

enum EClassroomChatEvent {
  MESSAGE = "message",
  MESSAGES = "messages",
}

interface MessagePayload {
  type: "message" | "notification";
  content: string;
  sender: Omit<User, "email" | "role">;
}

interface AuthContext {
  messages: MessagePayload[];
  messagesEndRef: React.MutableRefObject<HTMLDivElement | null>;
  sendMessage(message: string, cb?: () => void): void;
}

const ChatContext = createContext<AuthContext | undefined>(undefined);

interface Props {
  roomId: string;
  children: ReactNode;
}

export const ChatSocketProvider = ({ roomId, children }: Props) => {
  const socket = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const getSocket = () => {
    return socket.current!;
  };

  useEffect(() => {
    if (socket.current) return;

    socket.current = io(`${process.env.NEXT_PUBLIC_API}/classroom-chat`, {
      query: { classroom: roomId },
      withCredentials: true,
      transports: ["websocket"],
    });

    getSocket().on(
      EClassroomChatEvent.MESSAGES,
      (messages: MessagePayload[]) => {
        setMessages(messages);
      }
    );

    getSocket().on(EClassroomChatEvent.MESSAGE, (message: MessagePayload) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      getSocket().disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (message: string, cb?: () => void) => {
    getSocket().emit(EClassroomChatEvent.MESSAGE, message);
    cb && cb();
  };

  return (
    <ChatContext.Provider value={{ messages, messagesEndRef, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useClassroomChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useClassroomChat must be used within a ChatProvider");
  }
  return context;
};
