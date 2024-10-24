import Stack from "@mui/material/Stack";
import { SideContent } from "./SideContent";
import { ReactNode } from "react";

interface Props {
  renderLeft(): ReactNode;
}

export const Layout = ({ renderLeft }: Props) => {
  return (
    <Stack
      direction="column"
      component="main"
      sx={[
        {
          justifyContent: "center",
          height: "calc((1 - var(--template-frame-height, 0)) * 100%)",
          marginTop: "max(40px - var(--template-frame-height, 0px), 0px)",
          minHeight: "100%",
        },
        {
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            zIndex: -1,
            inset: 0,
            background: "white",
          },
        },
      ]}
    >
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        sx={{
          justifyContent: "center",
          gap: { xs: 6, sm: 12 },
          p: 2,
          mx: "auto",
        }}
      >
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          sx={{
            justifyContent: "center",
            gap: { xs: 6, sm: 12 },
            p: { xs: 2, sm: 4 },
            m: "auto",
          }}
        >
          <SideContent />
          {renderLeft()}
        </Stack>
      </Stack>
    </Stack>
  );
};
