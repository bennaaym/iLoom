import React from "react";
import { QuizSocketProvider } from "../providers";
import { useClassroomQuiz } from "../providers/QuizSocketProvider";
import { Box } from "@mui/material";
import { FloatingButton } from "@/common/components";
import { MdQuiz } from "react-icons/md";
import { useClassroomMaterial } from "../../providers/ClassroomMaterialProvider";
import { useAuth } from "@/common/providers/AuthProvider";
import { QuizModal } from "./QuizModal";

export const ClassroomQuizContent = () => {
  const { isQuizRunning, quiz, startQuiz, endQuiz, submitQuiz } =
    useClassroomQuiz();
  const { whiteboardMaterial } = useClassroomMaterial();
  const { isStudent } = useAuth();

  const handleClick = () => {
    if (!whiteboardMaterial) return;
    if (isQuizRunning) {
      endQuiz();
    } else {
      startQuiz(whiteboardMaterial.id);
    }
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
          bgcolor={isQuizRunning ? "error" : "primary"}
          onClick={handleClick}
        />
      )}

      {isStudent() && isQuizRunning && quiz && (
        <QuizModal
          quiz={quiz}
          onSubmit={() => {
            submitQuiz();
          }}
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
