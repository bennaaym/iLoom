"user client";
import { FloatingButton } from "@/common/components";
import { Box } from "@mui/material";
import React from "react";
import { FaRobot } from "react-icons/fa6";
import { useBoolean } from "usehooks-ts";
import { CreateContentForm } from "./CreateContentForm";
import { motion } from "framer-motion";
import { useGenerateMaterial } from "../hooks";
import { useClassroomMaterial } from "../../providers/ClassroomMaterialProvider";
import { createClassroomContentValidation } from "../validations";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  roomId: string;
}

export const CreateContentModal = ({ roomId }: Props) => {
  const isModalVisible = useBoolean(false);

  const { generate, isLoading, error } = useGenerateMaterial();
  const { shareMaterial } = useClassroomMaterial();
  const queryClient = useQueryClient();

  const handleSubmit = (
    values: typeof createClassroomContentValidation.initialValue
  ) => {
    generate(
      {
        ...values,
        classroom: roomId,
      },
      {
        onSuccess(data) {
          shareMaterial(data);
          isModalVisible.setFalse();
          queryClient.invalidateQueries({ queryKey: ["materials"] });
        },
      }
    );
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <FloatingButton
        icon={<FaRobot size={30} />}
        position="absolute"
        right="0"
        bottom="0"
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
          >
            <CreateContentForm
              isLoading={isLoading}
              error={error?.message ?? ""}
              onSubmit={handleSubmit}
            />
          </Box>
        </motion.div>
      )}
    </Box>
  );
};
