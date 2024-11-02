import React, { createContext, useContext, useState, ReactNode } from "react";
import { Material } from "../types";
import {
  Pdf,
  useLoadPdf,
} from "@/features/classroom/whiteboard/hooks/useLoadPdf";

interface ClassroomMaterialContext {
  whiteboardMaterial: Material | null;
  whiteboardPdf: Pdf | null;
  shareMaterial(material: Material): void;
  stopSharing(): void;
}

const ClassroomMaterialContext = createContext<
  ClassroomMaterialContext | undefined
>(undefined);

interface Props {
  children: ReactNode;
}

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

  return (
    <ClassroomMaterialContext.Provider
      value={{
        whiteboardMaterial,
        whiteboardPdf,
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
