import dayjs from "dayjs";

export const displayTime = (dateTime) => {
  if (dateTime) {
    const d = dayjs(dateTime);
    if (d.isToday()) {
      return d.format("h:mm A");
    } else {
      return d.format("h:mm A D MMM, YYYY");
    }
  }
  return null;
};
