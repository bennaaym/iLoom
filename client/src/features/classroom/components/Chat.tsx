"use client";

import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatProps {
  classroomId: string;
  userId: string;
}

interface Message {
  content: string;
  senderName: string;
}

export default function Chat({ classroomId, userId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const MESSAGE_LIMIT = 20;

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:960px)");

  const listMaxHeight = isSmallScreen ? "50vh" : isMediumScreen ? "60vh" : "70vh";

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      query: { classroomId },
      withCredentials: true,
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("joinRoom", { classroomId, userId });
    });

    newSocket.on("roomMessages", (previousMessages: Message[]) => {
      setMessages(previousMessages.slice(-MESSAGE_LIMIT));
    });

    newSocket.on("newMessage", (message: Message) => {
      setMessages((prevMessages) => [
        ...prevMessages.slice(-MESSAGE_LIMIT + 1),
        message,
      ]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [classroomId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!socket) {
      return;
    }
    if (input.trim()) {
      socket.emit("sendMessage", {
        classroomId,
        userId,
        content: input,
      });
      setInput("");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      border="1px solid #ccc"
      borderRadius="8px"
      overflow="hidden"
    >
      <List
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "8px",
          maxHeight: listMaxHeight,
        }}
        dense
      >
        {messages.map((msg, index) => (
          <ListItem key={index} disablePadding>
            <Paper
              elevation={3}
              style={{
                padding: "10px",
                marginBottom: "8px",
                backgroundColor: userId === msg.senderName ? "#d1e7dd" : "#f8f9fa",
                borderRadius: "10px",
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="bold" style={{ fontFamily: "Arial" }}>
                    {msg.senderName}
                  </Typography>
                }
                secondary={
                  <Typography variant="body1" style={{ color: "#495057" }}>
                    {msg.content}
                  </Typography>
                }
              />
            </Paper>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
      <Box display="flex" p={1}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
          size="small"
          style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
