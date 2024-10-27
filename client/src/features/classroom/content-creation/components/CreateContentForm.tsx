import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import { Formik, FormikValues } from "formik";
import {
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { createClassroomContentValidation } from "../validations";
import { subjects, levels, activity } from "../constants";

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
}));

export const CreateContentForm = () => {
  const handleSubmit = (
    values: typeof createClassroomContentValidation.initialValue
  ) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={createClassroomContentValidation.initialValue}
      validationSchema={createClassroomContentValidation.schema}
      onSubmit={handleSubmit}
      validateOnChange
    >
      {({ values, errors, handleChange, handleSubmit }) => {
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
                    placeholder="Select a subject"
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

                {values.subject && (
                  <FormControl fullWidth>
                    <FormLabel htmlFor="level">Level</FormLabel>
                    <Select
                      id="level"
                      name="level"
                      value={values.level}
                      onChange={handleChange}
                      placeholder="Select a level"
                    >
                      {levels[values.subject as keyof typeof levels].map(
                        (level) => {
                          return (
                            <MenuItem
                              key={level}
                              value={level}
                              sx={{ textTransform: "capitalize" }}
                            >
                              {level}
                            </MenuItem>
                          );
                        }
                      )}
                    </Select>
                    {errors.level && (
                      <FormHelperText error={Boolean(errors.level)}>
                        {errors.level}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}

                {values.subject && (
                  <FormControl fullWidth>
                    <FormLabel htmlFor="activity">Activity</FormLabel>
                    <Select
                      id="activity"
                      name="activity"
                      value={values.activity}
                      onChange={handleChange}
                      placeholder="Select a activity"
                    >
                      {activity[values.subject as keyof typeof activity].map(
                        (activity) => {
                          return (
                            <MenuItem
                              key={activity}
                              value={activity}
                              sx={{ textTransform: "capitalize" }}
                            >
                              {activity}
                            </MenuItem>
                          );
                        }
                      )}
                    </Select>
                    {errors.activity && (
                      <FormHelperText error={Boolean(errors.activity)}>
                        {errors.activity}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}

                <Button
                  sx={{ textTransform: "capitalize", fontWeight: "800" }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={false}
                >
                  generate
                </Button>
              </Box>
            </Card>
          </form>
        );
      }}
    </Formik>
  );
};
