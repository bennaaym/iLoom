"user client";
import { FloatingButton } from "@/common/components";
import { Box } from "@mui/material";
import React from "react";
import { FaRobot } from "react-icons/fa6";
import { useBoolean } from "usehooks-ts";
import { CreateContentForm } from "./CreateContentForm";

export const CreateContentModal = () => {
  const isModalVisible = useBoolean(false);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <FloatingButton
        icon={<FaRobot size={30} />}
        position="absolute"
        right="0"
        bottom="0"
        onClick={isModalVisible.toggle}
      />
      {isModalVisible.value && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          right="50%"
          width="fit-content"
          height="fit-content"
          bgcolor="red"
          zIndex={1000}
          sx={{ transform: "translateY(-50%)" }}
        >
          <CreateContentForm />
        </Box>
      )}
    </Box>
  );
};
