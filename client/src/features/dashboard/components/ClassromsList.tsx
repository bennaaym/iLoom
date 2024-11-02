import React, { Fragment } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteClassroom } from "@/features/dashboard/api/classroom.api";
import { useRouter } from "next/navigation";
import { Classroom } from "@/features/classroom/types";
import { useAuth } from "@/common/providers/AuthProvider";
import { dayjs } from "@/common/libs";
import { useBoolean } from "usehooks-ts";
import { apiClient, handleApiError } from "@/apis";
import { ErrorMessage } from "@/common/components/messages/ErrorMessage";

interface ClassroomSummaryModalProps {
  isOpen: boolean;
  onClose(): void;
  classroom: Classroom;
}

const ClassroomSummaryModal = ({
  classroom,

  isOpen,
  onClose,
}: ClassroomSummaryModalProps) => {
  const { data, isFetching, error } = useQuery({
    queryKey: ["summary", classroom.id],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/classrooms/${classroom.id}/summary`);
        return res.data as Classroom;
      } catch (err) {
        throw new Error(handleApiError(err).message);
      }
    },
    initialData: classroom,
    enabled: Boolean(!classroom.summary && classroom.transcript),
  });

  const renderContent = () => {
    if (isFetching) return <Box>Loading...</Box>;
    if (error) return <ErrorMessage message={error.message} />;
    if (!data.summary && !data.transcript)
      return <ErrorMessage message="No summary available for this class" />;
    return (
      <DialogContentText id="alert-dialog-description">
        {data.summary}
      </DialogContentText>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Summary</DialogTitle>
      <DialogContent id="alert-dialog-description" sx={{ minWidth: 400 }}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

interface ClassroomItemProps {
  classroom: Classroom;
  onEdit(): void;
}

const ClassroomItem = ({ classroom, onEdit }: ClassroomItemProps) => {
  const { isStudent } = useAuth();
  const mutation = useMutation({
    mutationFn: (id: string) => deleteClassroom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcomingClassrooms"] });
      queryClient.invalidateQueries({ queryKey: ["pastClassrooms"] });
    },
  });
  const queryClient = useQueryClient();
  const router = useRouter();
  const isSummaryVisible = useBoolean(false);

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  const handleJoin = (shareableCode: string) => {
    router.push(`/classrooms/${shareableCode}`);
  };

  const hasClassStarted =
    dayjs(classroom.startDate).utc().isBefore(dayjs.utc()) &&
    dayjs(classroom.endDate).utc().isAfter(dayjs.utc());
  return (
    <Fragment>
      <ListItem key={classroom.id}>
        <ListItemText
          primary={
            <Typography fontWeight="800" fontSize={18}>
              {classroom.name}
            </Typography>
          }
          secondary={`Start: ${new Date(
            classroom.startDate
          ).toLocaleString()} - End: ${new Date(
            classroom.endDate
          ).toLocaleString()}`}
        />
        <Stack direction="row" spacing={1} sx={{ marginLeft: "auto" }}>
          {!classroom.isFinished && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleJoin(classroom.shareableCode)}
              disabled={!hasClassStarted}
            >
              Join
            </Button>
          )}
          {classroom.isFinished && (
            <Button
              variant="contained"
              color="primary"
              onClick={isSummaryVisible.setTrue}
            >
              Summary
            </Button>
          )}
          {!isStudent() && (
            <Stack direction="row">
              {!classroom.isFinished && (
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={onEdit}
                  disabled={hasClassStarted}
                >
                  <Edit />
                </IconButton>
              )}
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(classroom.id)}
              >
                <Delete />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </ListItem>
      {isSummaryVisible.value && (
        <ClassroomSummaryModal
          classroom={classroom}
          isOpen={isSummaryVisible.value}
          onClose={isSummaryVisible.setFalse}
        />
      )}
    </Fragment>
  );
};

interface ClassroomListProps {
  classrooms: Classroom[];
  onEdit: (classroom: Classroom) => void;
}

export default function ClassroomList({
  classrooms,
  onEdit,
}: ClassroomListProps) {
  return (
    <Fragment>
      <List>
        {classrooms.map((classroom) => {
          return (
            <ClassroomItem
              key={classroom.id}
              classroom={classroom}
              onEdit={() => onEdit(classroom)}
            />
          );
        })}
      </List>
    </Fragment>
  );
}
