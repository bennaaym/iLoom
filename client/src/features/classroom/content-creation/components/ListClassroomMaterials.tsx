import React, { useState } from "react";
import { useMaterials } from "../hooks";
import {
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  Stack,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Card, FloatingButton } from "@/common/components";
import { useBoolean } from "usehooks-ts";
import { MdLibraryBooks } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { LuMonitorPlay, LuMonitorOff } from "react-icons/lu";

import { brand, gray } from "@/common/theme";
import { useClassroomMaterial } from "../../providers/ClassroomMaterialProvider";
import { Material } from "../../types";
import { AnimatedFloatingModal } from "./AnimatedFloatingModal";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  roomId: string;
}

export const ListClassroomMaterials = ({ roomId }: Props) => {
  const isModalVisible = useBoolean(false);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const { materials, isLoading, error } = useMaterials({ classroom: roomId });
  const { whiteboardMaterial, shareMaterial, stopSharing } =
    useClassroomMaterial();

  const handleDisplay = (material: Material) => {
    shareMaterial(material);
    isModalVisible.setFalse();
  };

  const handleStopDisplay = () => {
    stopSharing();
    isModalVisible.setFalse();
  };

  const handlePreview = (material: Material) => {
    setPreviewMaterial(material);
  };

  const handleClosePreview = () => {
    setPreviewMaterial(null);
  };

  if (isLoading) return null;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <AnimatedFloatingModal
        isOpen={isModalVisible.value}
        renderButton={() => (
          <Tooltip title="List existing contents">
            <FloatingButton
              icon={<MdLibraryBooks size={30} />}
              position="absolute"
              right="0"
              bottom="70px"
              onClick={isModalVisible.toggle}
            />
          </Tooltip>
        )}
      >
        <Card sx={{ maxHeight: "70vh", overflowY: "auto" }}>
          <List>
            {!Boolean(materials?.length) && (
              <ListItem>
                <Typography>No materials</Typography>
              </ListItem>
            )}
            {Boolean(materials.length) &&
              materials.map((material) => {
                const isDisplayed = material.id === whiteboardMaterial?.id;
                return (
                  <ListItem key={material.id}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={4}
                      width="100%"
                      p={1}
                      borderBottom={1}
                      borderColor="divider"
                      bgcolor={isDisplayed ? gray[200] : "inherit"}
                    >
                      <Stack gap={1}>
                        <Typography textTransform="capitalize" fontWeight="bold">
                          {material.content.title}
                        </Typography>
                        <Stack direction="row" gap={1}>
                          <Chip
                            label={material.subject}
                            variant="outlined"
                            size="small"
                          />
                          <Chip
                            label={material.activity}
                            variant="outlined"
                            size="small"
                          />
                        </Stack>
                      </Stack>
                      <Stack direction="row">
                        <Tooltip title="Preview content">
                          <IconButton onClick={() => handlePreview(material)}>
                            <FaEye color={brand[500]} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            isDisplayed
                              ? "Remove from whiteboard"
                              : "Load content to whiteboard"
                          }
                        >
                          <IconButton
                            onClick={
                              isDisplayed
                                ? handleStopDisplay
                                : () => handleDisplay(material)
                            }
                          >
                            {isDisplayed ? (
                              <LuMonitorOff color={brand[500]} />
                            ) : (
                              <LuMonitorPlay color={brand[500]} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>
                  </ListItem>
                );
              })}
          </List>
        </Card>
      </AnimatedFloatingModal>


      {previewMaterial && previewMaterial.contentPdf && (
        <Dialog
          open={Boolean(previewMaterial)}
          onClose={handleClosePreview}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{previewMaterial.content.title}</Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClosePreview}
              aria-label="close"
              sx={{ ml: 2 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <embed
              src={previewMaterial.contentPdf}
              type="application/pdf"
              width="100%"
              height="600px"
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
