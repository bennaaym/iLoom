import React from "react";
import { Modal, Box, Typography, IconButton, Card, CardContent, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { apiClient, handleApiError } from "@/apis";
import { useQuery } from "@tanstack/react-query";

interface QuizResult {
    student: {
        name: string;
        email: string;
    };
    answers: Array<{
        [question: string]: string;
    }>;
}

interface QuizResultsModalProps {
    open: boolean;
    onClose: () => void;
    roomId: string;
    materialId: string;
}

const QuizResultModal: React.FC<QuizResultsModalProps> = ({ open, onClose, roomId, materialId }) => {
    const { data: quizResults = [], refetch, isLoading, isFetching } = useQuery({
        enabled: open,
        queryKey: ["quizResults", roomId, materialId],
        queryFn: async () => {
            try {
                const res = await apiClient.get(`/classroom-quizzes/results/${roomId}/${materialId}`);
                return res.data as QuizResult[];
            } catch (err) {
                throw new Error(handleApiError(err).message);
            }
        },
    });

    const handleRefresh = () => {
        refetch();
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="quiz-results-title" aria-describedby="quiz-results-description">
            <Box
                position="absolute"
                top="50%"
                left="50%"
                width="500px"
                maxHeight="80vh"
                bgcolor="white"
                boxShadow={24}
                p={4}
                borderRadius={2}
                style={{ transform: "translate(-50%, -50%)", overflowY: "auto" }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography id="quiz-results-title" variant="h6">
                        Quiz Results
                    </Typography>
                    <IconButton onClick={handleRefresh} color="primary" size="small">
                        {isFetching ? <CircularProgress size={20} /> : <RefreshIcon />}
                    </IconButton>
                </Box>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                ) : quizResults.length > 0 ? (
                    quizResults.map((result, index) => (
                        <Box key={index} mt={2}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {result.student.name} - {result.student.email}
                            </Typography>
                            {result.answers.map((answer, answerIndex) => (
                                <Card key={answerIndex} variant="outlined" sx={{ mt: 1 }}>
                                    <CardContent>
                                        {Object.entries(answer).map(([question, response], idx) => (
                                            <Box key={idx} mb={2}>
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Q:</strong> {question}
                                                </Typography>
                                                <Typography variant="body1">
                                                    <strong>A:</strong> {response}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    ))
                ) : (
                    <Typography mt={2}>No results available.</Typography>
                )}
            </Box>
        </Modal>
    );
};

export default QuizResultModal;
