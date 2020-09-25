// Helper to return date in MM/DD/YYYY format
export const returnDateFull = () => {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; // Months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const newDate = month + "/" + day + "/" + year;
  return newDate;
};

// Helper to retrieve the hour in local time of each request
export const returnHour = () => {
  const dateObj = new Date();
  const hour = dateObj.getHours();
  return `${hour}`;
};
// Helper to retrieve the response time in milliseconds for each request sent to express server.
export const getResponseTime = (start: any) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};
