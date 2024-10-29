import React from "react";
import { QuizSocketProvider } from "../providers";
import { useClassroomQuiz } from "../providers/QuizSocketProvider";
import { Box } from "@mui/material";
import { FloatingButton } from "@/common/components";
import { MdQuiz } from "react-icons/md";
import { useBoolean } from "usehooks-ts";
import { useClassroomMaterial } from "../../providers/ClassroomMaterialProvider";
import { useAuth } from "@/common/providers/AuthProvider";

export const ClassroomQuizContent = () => {
  const { startQuiz, endQuiz } = useClassroomQuiz();
  const { whiteboardMaterial } = useClassroomMaterial();
  const { isStudent } = useAuth();
  const isQuizRunning = useBoolean(false);

  const handleClick = () => {
    if (!whiteboardMaterial) return;
    if (isQuizRunning.value) {
      endQuiz(whiteboardMaterial.id);
    } else {
      startQuiz(whiteboardMaterial.id);
    }

    isQuizRunning.toggle();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      {!isStudent() && whiteboardMaterial && (
        <FloatingButton
          icon={<MdQuiz size={30} />}
          position="absolute"
          right="0"
          bottom="140px"
          bgcolor={isQuizRunning.value ? "error" : "primary"}
          onClick={handleClick}
        />
      )}
    </Box>
  );
};

export const ClassroomQuiz = ({ roomId }: { roomId: string }) => {
  return (
    <QuizSocketProvider roomId={roomId}>
      <ClassroomQuizContent />
    </QuizSocketProvider>
  );
};
