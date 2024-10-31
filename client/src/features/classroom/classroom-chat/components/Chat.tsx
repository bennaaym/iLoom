"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Stack,
  Avatar,
  Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ChatSocketProvider, useClassroomChat } from "../providers";
import { brand, gray } from "@/common/theme";
import { MessagePayload } from "../providers/ChatSocketProvider";

interface ChatMessageProps {
  status: "sent" | "received";
  message: MessagePayload;
}

const ChatMessage = ({ status, message }: ChatMessageProps) => {
  const isSender = status === "sent";

  return (
    <Stack
      direction={isSender ? "row-reverse" : "row"}
      alignItems="flex-end"
      gap={1}
      alignSelf={isSender ? "flex-end" : "flex-start"}
    >
      <Tooltip title={message.sender.name}>
        <Avatar
          sx={{ bgcolor: !isSender ? gray[500] : brand[400], color: "white" }}
        >
          {message.sender.name.at(0)}
        </Avatar>
      </Tooltip>

      <Box border={1} borderColor={gray[500]} borderRadius="5px" p={1}>
        <Typography fontSize={14} color={gray[500]}>
          {message.content}
        </Typography>
      </Box>
    </Stack>
  );
};

const ChatContent = ({ userId }: { userId: string }) => {
  const [message, setMessage] = useState("");
  const { messages, messagesEndRef, sendMessage } = useClassroomChat();

  const handleSend = () => {
    if (!message) return;
    sendMessage(message, () => setMessage(""));
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      border="1px solid #ccc"
      borderRadius="8px"
      overflow="hidden"
      position="relative"
    >
      <Stack spacing={1} p={1}>
        {messages.map((msg, index) => (
          <Stack key={index}>
            <ChatMessage
              key={index}
              message={msg}
              status={msg.sender.id === userId ? "sent" : "received"}
            />
            {/* <Box
              key={index}
              bgcolor={msg.sender.id === userId ? brand[300] : "gray"}
              borderRadius={1}
              width="fit-content"
              px={1}
              alignSelf={msg.sender.id === userId ? "flex-end" : "flex-start"}
            >
              <Typography fontWeight="bold">{msg.sender.name}</Typography>
              <Typography color={gray[200]}>{msg.content}</Typography>
            </Box> */}
          </Stack>
        ))}
      </Stack>
      <div ref={messagesEndRef} />
      <Box display="flex" p={1} position="absolute" width="100%" bottom={0}>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
};

interface Props {
  roomId: string;
  userId: string;
}

export const Chat = ({ roomId, userId }: Props) => {
  return (
    <ChatSocketProvider roomId={roomId}>
      <ChatContent userId={userId} />
    </ChatSocketProvider>
  );
};
