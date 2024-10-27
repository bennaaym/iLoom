import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
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
import { useGenerateMaterial } from "../hooks";
import { useClassroomMaterial } from "../../providers/ClassroomMaterialProvider";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  borderRadius: 0,
}));

export const CreateContentForm = () => {
  const { generate, isLoading, error } = useGenerateMaterial();
  const { shareMaterial } = useClassroomMaterial();

  const handleSubmit = (
    values: typeof createClassroomContentValidation.initialValue
  ) => {
    generate(
      {
        ...values,
      },
      {
        onSuccess(data) {
          shareMaterial(data);
        },
      }
    );
  };

  return (
    <Formik
      initialValues={createClassroomContentValidation.initialValue}
      validationSchema={createClassroomContentValidation.schema}
      onSubmit={handleSubmit}
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
                {error && <Alert severity="error">{error.message}</Alert>}
              </Box>
            </Card>
          </form>
        );
      }}
    </Formik>
  );
};
