"use client";

import React, { useState } from "react";
import { Box, TextField, IconButton, Typography, Stack, useMediaQuery } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ChatSocketProvider, useClassroomChat } from "../providers";
import { brand, gray } from "@/common/theme";

const ChatContent = ({ userId }: { userId: string }) => {
  const [message, setMessage] = useState("");
  const { messages, messagesEndRef, sendMessage } = useClassroomChat();

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:960px)");

  const listMaxHeight = isSmallScreen
    ? "50vh"
    : isMediumScreen
    ? "60vh"
    : "70vh";

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
    >
      <Stack spacing={1} p={1}>
        {messages.map((msg, index) => (
          <Stack key={index}>
            <Box
              key={index}
              bgcolor={msg.sender.id === userId ? brand[300] : "gray"}
              borderRadius={1}
              width="fit-content"
              px={1}
              alignSelf={msg.sender.id === userId ? "flex-end" : "flex-start"}
            >
              <Typography fontWeight="bold">{msg.sender.name}</Typography>
              <Typography color={gray[200]}>{msg.content}</Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
      <div ref={messagesEndRef} />
      <Box display="flex" p={1}>
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
