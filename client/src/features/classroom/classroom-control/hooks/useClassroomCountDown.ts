import { useState } from "react";
import { Classroom } from "../../types";
import { dayjs } from "@/common/libs";
import { useInterval } from "usehooks-ts";

const calculateTimeLeft = (classroom: Classroom) => {
  const end = dayjs(classroom.endDate).utc();
  const now = dayjs().utc();

  if (end.isBefore(now)) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const days = end.diff(now, "days");
  const hours = end.subtract(days, "days").diff(now, "hours");
  const minutes = end
    .subtract(days, "days")
    .subtract(hours, "hours")
    .diff(now, "minutes");
  const seconds = end
    .subtract(days, "days")
    .subtract(hours, "hours")
    .subtract(minutes, "minutes")
    .diff(now, "seconds");

  return { hours, minutes, seconds };
};

export const useClassroomCountDown = (classroom: Classroom) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(classroom));

  useInterval(() => {
    setTimeLeft(calculateTimeLeft(classroom));
  }, 1000);

  return timeLeft;
};
