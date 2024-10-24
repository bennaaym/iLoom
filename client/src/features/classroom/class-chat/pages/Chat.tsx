"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatProps {
  classroomId: string;
}

export default function Chat({ classroomId }: ChatProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  // Socket.io

  const handleSend = () => {
    // Send message to server
    setMessages([...messages, input]);
    setInput("");
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
        style={{ flexGrow: 1, overflowY: "auto", padding: "8px" }}
        dense={true}
      >
        {messages.map((msg, index) => (
          <ListItem key={index} disablePadding>
            <ListItemText primary={msg} />
          </ListItem>
        ))}
      </List>
      <Box display="flex" p={1}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          variant="outlined"
          size="small"
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
