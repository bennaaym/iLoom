import { FloatingButton } from "@/common/components";
import { Box } from "@mui/material";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  isOpen: boolean;
  children: ReactNode;
  renderButton(): ReactNode;
}

export const AnimatedFloatingModal = ({
  isOpen,
  children,
  renderButton,
}: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      {renderButton()}
      {isOpen && (
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
            {children}
          </Box>
        </motion.div>
      )}
    </Box>
  );
};
