import { useAuth } from "@/common/providers/AuthProvider";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { FaPowerOff } from "react-icons/fa";
import { useClassroomSocketProvider } from "../../providers/ClassroomSocketProvider";
import { useClassroomCountDown } from "../hooks";
import { Classroom } from "../../types";

export const ClassroomPanel = ({ classroom }: { classroom: Classroom }) => {
  const { user, isStudent } = useAuth();
  const { endClassroom } = useClassroomSocketProvider();
  const { hours, minutes, seconds } = useClassroomCountDown(classroom);

  return (
    <Box
      display="flex"
      justifyContent={isStudent() ? "center" : "space-between"}
      alignItems="center"
      width="100%"
      height="40px"
      bgcolor="primary.main"
      borderRadius="5px"
      mt={2}
      px={2}
      color="white"
    >
      <Typography variant="body1" fontWeight="bold" fontSize={24}>
        {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </Typography>
      {user && !isStudent() && (
        <Tooltip title="End class early">
          <IconButton
            sx={{
              color: "white",
              "&:hover": {
                color: "red",
              },
            }}
            onClick={endClassroom}
          >
            <FaPowerOff />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
