import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { Formik } from "formik";
import {
  Alert,
  FormHelperText,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  Typography,
  TextareaAutosize,
  CircularProgress,
} from "@mui/material";
import { createClassroomContentValidation } from "../validations";
import * as constants from "../constants";
import { Card } from "@/common/components";
import { Info as InfoIcon } from "@mui/icons-material";
import { useState } from "react";

interface Props {
  isLoading: boolean;
  error: string;
  onSubmit(values: typeof createClassroomContentValidation.initialValue): void;
}

export const CreateContentForm = ({ isLoading, error, onSubmit }: Props) => {
  const [showInfo, setShowInfo] = useState(false);

  const getActivityInfo = (activity: string) => {
    switch (activity) {
      case "story":
        return "A story and related questions will be generated from the image you uploaded. This will be an engaging and interactive activity for your students.";
      case "reading":
        return "A reading passage and comprehension questions will be generated based on the description provided. The content will be suitable for the selected age group.";
      case "algorithm":
        return "A set of algorithm-related questions will be generated based on the selected topic and difficulty level. This will help students develop their problem-solving and critical thinking skills.";
      default:
        return "";
    }
  };

  return (
    <Formik
      initialValues={createClassroomContentValidation.initialValue}
      validationSchema={createClassroomContentValidation.schema}
      onSubmit={onSubmit}
      validateOnChange
    >
      {({
        values,
        errors,
        handleChange,
        handleSubmit,
        setFieldValue,
        touched,
      }) => {
        const subjects = constants.subjects;
        const levels = values.subject
          ? constants.level[values.subject as keyof typeof constants.level]
          : [];
        const activities = values.subject
          ? constants.activity[
          values.subject as keyof typeof constants.activity
          ]
          : [];
        const ageGroups = constants.ageGroups;

        const renderAdditionalFields = () => {
          if (values.subject === "english") {
            if (values.activity === "story") {
              return (
                <>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="ageGroup">Age Group</FormLabel>
                    <Select
                      id="ageGroup"
                      name="ageGroup"
                      value={values.ageGroup}
                      onChange={handleChange}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Age Group
                      </MenuItem>
                      {ageGroups.map((age) => (
                        <MenuItem key={age} value={age}>
                          {age}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.ageGroup && touched.ageGroup && (
                      <FormHelperText error>{errors.ageGroup}</FormHelperText>
                    )}
                  </FormControl>

                  <FormControl fullWidth>
                    <FormLabel htmlFor="image">Upload Image</FormLabel>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        if (event.currentTarget.files) {
                          setFieldValue("image", event.currentTarget.files[0]);
                        }
                      }}
                    />
                    {errors.image && touched.image && (
                      <FormHelperText error>{errors.image}</FormHelperText>
                    )}
                  </FormControl>
                </>
              );
            } else if (values.activity === "reading") {
              return (
                <>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="ageGroup">Age Group</FormLabel>
                    <Select
                      id="ageGroup"
                      name="ageGroup"
                      value={values.ageGroup}
                      onChange={handleChange}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Age Group
                      </MenuItem>
                      {ageGroups.map((age) => (
                        <MenuItem key={age} value={age}>
                          {age}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.ageGroup && touched.ageGroup && (
                      <FormHelperText error>{errors.ageGroup}</FormHelperText>
                    )}
                  </FormControl>
                </>
              );
            }
          } else if (values.subject === "algorithm") {
            return (
              <>
                <FormControl fullWidth>
                  <FormLabel htmlFor="topic">Topic</FormLabel>
                  <Select
                    id="topic"
                    name="topic"
                    value={values.topic}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Topic
                    </MenuItem>
                    {constants.algorithmTopics.map((topic) => (
                      <MenuItem key={topic.value} value={topic.value}>
                        {topic.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.topic && touched.topic && (
                    <FormHelperText error>{errors.topic}</FormHelperText>
                  )}
                </FormControl>
              </>
            );
          }
          return null;
        };

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
                    onChange={(event) => {
                      handleChange(event);
                      setFieldValue("activity", "");
                      setFieldValue("level", "");
                      setFieldValue("ageGroup", "");
                      setFieldValue("description", "");
                      setFieldValue("image", null);
                      setShowInfo(false);
                    }}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select a subject
                    </MenuItem>
                    {subjects.map((subject) => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.subject && touched.subject && (
                    <FormHelperText error>{errors.subject}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel htmlFor="level">Level</FormLabel>
                  <Select
                    id="level"
                    name="level"
                    value={values.level}
                    onChange={handleChange}
                    displayEmpty
                    disabled={!values.subject}
                  >
                    <MenuItem value="" disabled>
                      Select a level
                    </MenuItem>
                    {levels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.level && touched.level && (
                    <FormHelperText error>{errors.level}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel htmlFor="activity">Activity</FormLabel>
                  <Box display="flex" alignItems="center">
                    <Select
                      id="activity"
                      name="activity"
                      value={values.activity}
                      onChange={(event) => {
                        handleChange(event);
                        setFieldValue("ageGroup", "");
                        setFieldValue("description", "");
                        setFieldValue("image", null);
                        setShowInfo(false);
                      }}
                      displayEmpty
                      disabled={!values.subject}
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        Select an activity
                      </MenuItem>
                      {activities.map((activity) => (
                        <MenuItem key={activity} value={activity}>
                          {activity}
                        </MenuItem>
                      ))}
                    </Select>
                    {values.activity && (
                      <IconButton
                        aria-label="info"
                        onClick={() => setShowInfo(!showInfo)}
                      >
                        <InfoIcon />
                      </IconButton>
                    )}
                  </Box>
                  {errors.activity && touched.activity && (
                    <FormHelperText error>{errors.activity}</FormHelperText>
                  )}
                </FormControl>

                {renderAdditionalFields()}

                <FormControl fullWidth>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <TextareaAutosize
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    placeholder="Enter a description"
                    minRows={4}
                    style={{
                      width: "100%",
                      padding: "8px",
                      fontSize: "16px",
                      borderColor:
                        errors.description && touched.description
                          ? "red"
                          : "rgba(0, 0, 0, 0.23)",
                      borderRadius: "4px",
                    }}
                  />
                  {errors.description && touched.description && (
                    <FormHelperText error>
                      {errors.description}
                    </FormHelperText>
                  )}
                </FormControl>

                {showInfo && values.activity && (
                  <Box mt={2} p={2} border={1} borderColor="grey.300">
                    <Typography variant="body1">
                      {getActivityInfo(values.activity)}
                    </Typography>
                  </Box>
                )}

                <Button
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: "800",
                    position: "relative",
                  }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress
                        size={24}
                        sx={{
                          color: "white",
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          marginTop: "-12px",
                          marginLeft: "-12px",
                        }}
                      />
                      Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
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
