import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Modal,
  Alert,
} from "@mui/material";
import { useSubmitQuiz } from "../hooks";
import { Quiz } from "../providers/QuizSocketProvider";
import { useBoolean } from "usehooks-ts";

interface Props {
  quiz: Quiz;
  onSubmit(answers: Record<string, string>): void;
}

export const QuizModal = ({ quiz, onSubmit }: Props) => {
  const isOpen = useBoolean(true);
  const { submit, isLoading, error } = useSubmitQuiz();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const currentQuestion = quiz.questions[currentIndex];
  const currentAnswer = answers[currentIndex] ?? "";
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  const handleSelectAnswer = (answer: string) => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[currentIndex] = answer;
      return updatedAnswers;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSubmit = () => {
    const ans = quiz.questions.reduce(
      (acc, question, index) => ({
        ...acc,
        [question.question]: answers[index],
      }),
      {}
    );

    submit(
      {
        classroom: quiz.classroom,
        teacher: quiz.teacher,
        material: quiz.material,
        answers: ans,
      },
      {
        onSuccess() {
          onSubmit(ans);
          isOpen.setFalse();
        },
      }
    );
  };

  return (
    <Modal
      open={isOpen.value}
      onClose={() => {}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
      >
        <Box width="500px">
          <Card>
            <CardContent>
              <Box style={{ marginBottom: "20px" }}>
                <Typography variant="h4">
                  {currentIndex + 1}. {currentQuestion.question}
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={currentAnswer}
                    onChange={(e) => handleSelectAnswer(e.target.value)}
                  >
                    {currentQuestion.options.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
              <Box
                display="flex"
                justifyContent={isFirstQuestion ? "flex-end" : "space-between"}
              >
                {!isFirstQuestion && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrev}
                  >
                    prev
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!currentAnswer || isLoading}
                  onClick={isLastQuestion ? handleSubmit : handleNext}
                >
                  {isLastQuestion ? "submit" : "next"}
                </Button>
              </Box>
              {error && (
                <Box mt={2}>
                  <Alert severity="error">{error.message}</Alert>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Modal>
  );
};
