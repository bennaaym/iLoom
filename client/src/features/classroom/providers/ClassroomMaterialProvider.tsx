import React, { createContext, useContext, useState, ReactNode } from "react";
import { Material } from "../types";
import { Box, List, ListItemText, Stack, Typography } from "@mui/material";

interface ClassroomMaterialContext {
  whiteboardMaterial: Material | null;
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

  const shareMaterial = (material: Material) => {
    setWhiteboardMaterial(material);
  };

  const stopSharing = () => {
    setWhiteboardMaterial(null);
  };

  const renderWhiteboardMaterial = () => {
    if (!whiteboardMaterial) return null;
    if (whiteboardMaterial.activity === "reading")
      return renderReading(whiteboardMaterial);
    return null;
  };

  return (
    <ClassroomMaterialContext.Provider
      value={{
        whiteboardMaterial,
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
