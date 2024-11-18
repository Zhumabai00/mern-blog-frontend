export const formattedDate = (date) => {
  // Ensure the input is a Date object
  const validDate = date instanceof Date ? date : new Date(date);

  return validDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};