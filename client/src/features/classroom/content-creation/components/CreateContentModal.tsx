"user client";

import React from "react";
import { FaRobot } from "react-icons/fa6";
import { useBoolean } from "usehooks-ts";
import { CreateContentForm } from "./CreateContentForm";
import { useGenerateMaterial } from "../hooks";
import { useClassroomMaterial } from "../../providers/ClassroomMaterialProvider";
import { createClassroomContentValidation } from "../validations";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatedFloatingModal } from "./AnimatedFloatingModal";
import { FloatingButton } from "@/common/components";

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
    <AnimatedFloatingModal
      isOpen={isModalVisible.value}
      renderButton={() => (
        <FloatingButton
          icon={<FaRobot size={30} />}
          position="absolute"
          right="0"
          bottom="0"
          onClick={isModalVisible.toggle}
        />
      )}
    >
      <CreateContentForm
        isLoading={isLoading}
        error={error?.message ?? ""}
        onSubmit={handleSubmit}
      />
    </AnimatedFloatingModal>
  );
};
