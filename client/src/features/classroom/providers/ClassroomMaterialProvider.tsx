import React, { createContext, useContext, useState, ReactNode } from "react";
import { Material } from "../types";
import { Box, List, ListItemText, Stack, Typography } from "@mui/material";

interface ClassroomMaterialContext {
  materials: Material[];
  shareMaterial(material: Material): void;
  renderMaterial(): ReactNode;
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
          <Typography variant="h4">Text</Typography>
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
        <Box>
          <Typography variant="h4">Answers</Typography>
          <Typography>{material.content.answers.join("\n")}</Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export const ClassroomMaterialProvider = ({ children }: Props) => {
  const [materials, setMaterials] = useState<Material[]>([]);

  const shareMaterial = (material: Material) => {
    setMaterials((prev) => [material, ...prev]);
  };

  const renderMaterial = () => {
    if (!materials.length) return <></>;
    if (materials[0].activity === "reading") return renderReading(materials[0]);
    return <></>;
  };

  return (
    <ClassroomMaterialContext.Provider
      value={{ materials, renderMaterial, shareMaterial }}
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
