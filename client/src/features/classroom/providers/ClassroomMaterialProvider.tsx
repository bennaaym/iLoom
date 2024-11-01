import React, { createContext, useContext, useState, ReactNode } from "react";
import { Material } from "../types";
import { Box, List, ListItemText, Stack, Typography } from "@mui/material";
import {
  Pdf,
  useLoadPdf,
} from "@/features/classroom/whiteboard/hooks/useLoadPdf";

interface ClassroomMaterialContext {
  whiteboardMaterial: Material | null;
  whiteboardPdf: Pdf | null;
  shareMaterial(material: Material): void;
  stopSharing(): void;
  renderWhiteboardMaterial(): ReactNode;
}

const ClassroomMaterialContext = createContext<
  ClassroomMaterialContext | undefined
>(undefined);

interface Props {
  children: ReactNode;
}

const renderReading = (material: Material) => {
  return (
    <Box maxWidth="500px">
      <Stack>
        <Box>
          <Typography variant="h4">{material.content.title}</Typography>
          <Typography>{material.content.text}</Typography>
        </Box>
        <Box>
          <Typography variant="h4">Questions</Typography>
          <List>
            {material.content.questions.map(
              (question: string, index: number) => (
                <ListItemText key={index}>{question}</ListItemText>
              )
            )}
          </List>
        </Box>
      </Stack>
    </Box>
  );
};

export const ClassroomMaterialProvider = ({ children }: Props) => {
  const [whiteboardMaterial, setWhiteboardMaterial] = useState<Material | null>(
    null
  );
  const { loadFromUrl, loadBlank } = useLoadPdf();
  const [whiteboardPdf, setWhiteboardPdf] = useState<Pdf | null>(null);

  const shareMaterial = async (material: Material) => {
    setWhiteboardMaterial(material);
    setWhiteboardPdf(await loadFromUrl("pdf", material.contentPdf));
  };

  const stopSharing = async () => {
    setWhiteboardMaterial(null);
    setWhiteboardPdf(await loadBlank());
  };

  const renderWhiteboardMaterial = () => {
    if (!whiteboardMaterial) return null;
    if (whiteboardMaterial.activity === "reading" || whiteboardMaterial.activity === "story")
      return renderReading(whiteboardMaterial);
    return null;
  };

  return (
    <ClassroomMaterialContext.Provider
      value={{
        whiteboardMaterial,
        whiteboardPdf,
        renderWhiteboardMaterial,
        shareMaterial,
        stopSharing,
      }}
    >
      {children}
    </ClassroomMaterialContext.Provider>
  );
};

export const useClassroomMaterial = () => {
  const context = useContext(ClassroomMaterialContext);
  if (!context) {
    throw new Error(
      "useClassroomMaterial must be used within a ClassroomMaterialProvider"
    );
  }
  return context;
};
