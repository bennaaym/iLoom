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
  ListItemText,
  Paper,
  Divider,
} from "@mui/material";
import { Card, FloatingButton } from "@/common/components";
import { useBoolean } from "usehooks-ts";
import { MdLibraryBooks, MdPictureAsPdf } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { LuMonitorPlay, LuMonitorOff } from "react-icons/lu";
import { brand, gray } from "@/common/theme";
import { useClassroomMaterial } from "../../providers/ClassroomMaterialProvider";
import { Material, IQuestion } from "../../types";
import { AnimatedFloatingModal } from "./AnimatedFloatingModal";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  roomId: string;
}

export const ListClassroomMaterials = ({ roomId }: Props) => {
  const isModalVisible = useBoolean(false);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);
  const { materials, isLoading, error } = useMaterials({ classroom: roomId });
  const { whiteboardMaterial, shareMaterial, stopSharing } = useClassroomMaterial();

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

  const handlePreviewPdf = (pdfUrl: string) => {
    setPreviewPdf(pdfUrl);
  };

  const handleClosePreview = () => {
    setPreviewMaterial(null);
    setPreviewPdf(null);
  };

  if (isLoading) return null;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <AnimatedFloatingModal
        isOpen={isModalVisible.value}
        renderButton={() => (
          <Tooltip title="List existing contents" placement="left">
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
              materials.map((material) => (
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
                    bgcolor={whiteboardMaterial?.id === material.id ? gray[200] : "inherit"}
                  >
                    <Stack gap={1}>
                      <Typography textTransform="capitalize" fontWeight="bold">
                        {material.content.title}
                      </Typography>
                      <Stack direction="row" gap={1}>
                        <Chip label={material.subject} variant="outlined" size="small" />
                        <Chip label={material.activity} variant="outlined" size="small" />
                      </Stack>
                    </Stack>
                    <Stack direction="row">
                      <Tooltip title="Preview content details">
                        <IconButton onClick={() => handlePreview(material)}>
                          <FaEye color={brand[500]} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Open PDF">
                        <IconButton onClick={() => handlePreviewPdf(material.contentPdf)}>
                          <MdPictureAsPdf color={brand[500]} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          whiteboardMaterial?.id === material.id
                            ? "Remove pdf from whiteboard"
                            : "Display pdf on whiteboard"
                        }
                      >
                        <IconButton
                          onClick={
                            whiteboardMaterial?.id === material.id
                              ? handleStopDisplay
                              : () => handleDisplay(material)
                          }
                        >
                          {whiteboardMaterial?.id === material.id ? (
                            <LuMonitorOff color={brand[500]} />
                          ) : (
                            <LuMonitorPlay color={brand[500]} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                </ListItem>
              ))}
          </List>
        </Card>
      </AnimatedFloatingModal>

      {/* Content Details Preview Modal */}
      {previewMaterial && (
        <Dialog
          open={Boolean(previewMaterial)}
          onClose={handleClosePreview}
          maxWidth="md"
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
            <Typography variant="body1" paragraph>
              {previewMaterial.content.text}
            </Typography>
            {previewMaterial.content.questions && previewMaterial.content.questions.length > 0 && (
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Questions:
                </Typography>
                <List>
                  {previewMaterial.content.questions.map((question: IQuestion, index: number) => (
                    <Paper key={index} sx={{ p: 2, mb: 2, borderRadius: 2 }} elevation={1}>
                      <Typography variant="body1" fontWeight="bold" gutterBottom>
                        {index + 1}. {question.question}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <List disablePadding>
                        {question.options.map((option, optIndex) => (
                          <ListItem key={optIndex} disableGutters>
                            <ListItemText
                              primary={`${String.fromCharCode(65 + optIndex)}. ${option}`}
                              sx={{ ml: 2 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="textSecondary">
                        <strong>Answer:</strong> {question.answer}
                      </Typography>
                    </Paper>
                  ))}
                </List>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* PDF Preview Modal */}
      {previewPdf && (
        <Dialog
          open={Boolean(previewPdf)}
          onClose={handleClosePreview}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">PDF Preview</Typography>
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
              src={previewPdf}
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
