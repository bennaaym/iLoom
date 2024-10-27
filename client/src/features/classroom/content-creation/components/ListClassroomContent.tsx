import React from "react";
import { useMaterials } from "../hooks";
import {
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { Card, FloatingButton } from "@/common/components";
import { useBoolean } from "usehooks-ts";
import { MdLibraryBooks } from "react-icons/md";
import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa";
import { LuMonitorPlay } from "react-icons/lu";
import { LuMonitorOff } from "react-icons/lu";

import { brand, gray } from "@/common/theme";
import { useClassroomMaterial } from "../../providers/ClassroomMaterialProvider";
import { Material } from "../../types";

interface Props {
  roomId: string;
}

export const ListClassroomMaterials = ({ roomId }: Props) => {
  const isModalVisible = useBoolean(false);
  const { materials, isLoading, error } = useMaterials({ classroom: roomId });
  const { whiteboardMaterial, shareMaterial, stopSharing } =
    useClassroomMaterial();

  const handleDisplay = (material: Material) => {
    shareMaterial(material);
    isModalVisible.setFalse();
  };

  const handlePreview = () => {
    isModalVisible.setFalse();
  };

  if (isLoading) return;
  if (error) return <div>{error.message}</div>;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <FloatingButton
        icon={<MdLibraryBooks size={30} />}
        position="absolute"
        right="0"
        bottom={60}
        onClick={isModalVisible.toggle}
      />
      {isModalVisible.value && (
        <motion.div
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          transition={{ type: "spring" }}
          style={{ zIndex: 1000, top: 0, right: 0, position: "absolute" }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="fit-content"
            height="fit-content"
            bgcolor="white"
          >
            <Card>
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
                          bgcolor={isDisplayed ? gray[200] : "inherit"}
                        >
                          <Stack gap={1}>
                            <Typography
                              textTransform="capitalize"
                              fontWeight="bold"
                            >
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
                            <IconButton onClick={handlePreview}>
                              <FaEye color={brand[500]} />
                            </IconButton>
                            <IconButton
                              onClick={
                                isDisplayed
                                  ? stopSharing
                                  : () => handleDisplay(material)
                              }
                            >
                              {isDisplayed ? (
                                <LuMonitorOff color={brand[500]} />
                              ) : (
                                <LuMonitorPlay color={brand[500]} />
                              )}
                            </IconButton>
                          </Stack>
                        </Box>
                      </ListItem>
                    );
                  })}
              </List>
            </Card>
          </Box>
        </motion.div>
      )}
    </Box>
  );
};
