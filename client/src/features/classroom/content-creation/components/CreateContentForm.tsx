import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { Formik } from "formik";
import {
  Alert,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { createClassroomContentValidation } from "../validations";
import * as constants from "../constants";
import { Card } from "@/common/components";

interface Props {
  isLoading: boolean;
  error: string;
  onSubmit(values: typeof createClassroomContentValidation.initialValue): void;
}

export const CreateContentForm = ({ isLoading, error, onSubmit }: Props) => {
  return (
    <Formik
      initialValues={createClassroomContentValidation.initialValue}
      validationSchema={createClassroomContentValidation.schema}
      onSubmit={onSubmit}
      validateOnChange
    >
      {({ values, errors, handleChange, handleSubmit }) => {
        const subjects = constants.subjects;
        const levels = values.subject
          ? constants.level[values.subject as keyof typeof constants.level]
          : [];
        const activities = values.subject
          ? constants.activity[
              values.subject as keyof typeof constants.activity
            ]
          : [];

        return (
          <form onSubmit={handleSubmit}>
            <Card variant="outlined">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 2,
                }}
              >
                <FormControl fullWidth>
                  <FormLabel htmlFor="subject">Subject</FormLabel>
                  <Select
                    id="subject"
                    name="subject"
                    value={values.subject}
                    onChange={handleChange}
                    sx={{ textTransform: "capitalize" }}
                    placeholder="hello"
                    displayEmpty
                  >
                    {subjects.map((subject) => {
                      return (
                        <MenuItem
                          key={subject}
                          value={subject}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {subject}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors.subject && (
                    <FormHelperText error={Boolean(errors.subject)}>
                      {errors.subject}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="level">Level</FormLabel>
                  <Select
                    id="level"
                    name="level"
                    value={values.level}
                    onChange={handleChange}
                    placeholder="Select a level"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {levels.map((level) => {
                      return (
                        <MenuItem
                          key={level}
                          value={level}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {level}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors.level && (
                    <FormHelperText error={Boolean(errors.level)}>
                      {errors.level}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel htmlFor="activity">Activity</FormLabel>
                  <Select
                    id="activity"
                    name="activity"
                    value={values.activity}
                    onChange={handleChange}
                    placeholder="Select a activity"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {activities.map((activity) => {
                      return (
                        <MenuItem
                          key={activity}
                          value={activity}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {activity}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors.activity && (
                    <FormHelperText error={Boolean(errors.activity)}>
                      {errors.activity}
                    </FormHelperText>
                  )}
                </FormControl>

                <Button
                  sx={{ textTransform: "capitalize", fontWeight: "800" }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                >
                  generate
                </Button>
                {error && <Alert severity="error">{error}</Alert>}
              </Box>
            </Card>
          </form>
        );
      }}
    </Formik>
  );
};
