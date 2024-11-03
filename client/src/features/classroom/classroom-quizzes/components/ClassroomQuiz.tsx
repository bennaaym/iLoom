import React, { useState } from "react";
import { QuizSocketProvider } from "../providers";
import { useClassroomQuiz } from "../providers/QuizSocketProvider";
import { Box, Tooltip } from "@mui/material";
import { FloatingButton } from "@/common/components";
import { MdQuiz } from "react-icons/md";
import { useClassroomMaterial } from "../../providers/ClassroomMaterialProvider";
import { useAuth } from "@/common/providers/AuthProvider";
import { QuizModal } from "./QuizModal";
import { toast } from "react-toastify";
import QuizResultModal from "./QuizResultModal";
import AssessmentIcon from "@mui/icons-material/Assessment";

export const ClassroomQuizContent = ({ roomId }: { roomId: string }) => {
  const { isQuizRunning, quiz, startQuiz, endQuiz, submitQuiz } =
    useClassroomQuiz();
  const { whiteboardMaterial } = useClassroomMaterial();
  const { isStudent } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (!whiteboardMaterial) return;
    if (isQuizRunning) {
      endQuiz();
      toast.info("The quiz has been successfully ended.");
    } else {
      startQuiz(whiteboardMaterial.id);
      toast.success("The quiz has started. Students may now join.");
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
        <Tooltip title={isQuizRunning ? "End quiz" : "Start new quiz"} placement="left">
          <FloatingButton
            icon={<MdQuiz size={30} />}
            position="absolute"
            right="0"
            bottom="140px"
            bgcolor={isQuizRunning ? "error" : "primary"}
            onClick={handleClick}
          />
        </Tooltip>
      )}
      {!isStudent() && whiteboardMaterial && (
        <Tooltip title="View Quiz Results" placement="left">
          <FloatingButton
            icon={<AssessmentIcon sx={{ fontSize: 30 }} />}
            position="absolute"
            right="0"
            bottom="210px"
            bgcolor="secondary"
            onClick={() => setIsModalOpen(true)}
          />
        </Tooltip>
      )}

      {isStudent() && isQuizRunning && quiz && (
        <QuizModal
          quiz={quiz}
          onSubmit={() => {
            submitQuiz();
          }}
        />
      )}
      {!isStudent() && whiteboardMaterial && (
        <QuizResultModal
          open={isModalOpen}
          materialId={whiteboardMaterial?.id}
          onClose={() => setIsModalOpen(false)}
          roomId={roomId}
        />
      )}
    </Box>
  );
};

export const ClassroomQuiz = ({ roomId }: { roomId: string }) => {
  return (
    <QuizSocketProvider roomId={roomId}>
      <ClassroomQuizContent roomId={roomId} />
    </QuizSocketProvider>
  );
};
