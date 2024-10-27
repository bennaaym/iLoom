"user client";
import { FloatingButton } from "@/common/components";
import { Box } from "@mui/material";
import React from "react";
import { FaRobot } from "react-icons/fa6";
import { useBoolean } from "usehooks-ts";
import { CreateContentForm } from "./CreateContentForm";

export const CreateContentModal = () => {
  const isModalVisible = useBoolean(true);

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
          right="0"
          top="0"
          width="500px"
          height="500px"
          bgcolor="red"
          zIndex={1000}
        >
          <CreateContentForm />
        </Box>
      )}
    </Box>
  );
};
