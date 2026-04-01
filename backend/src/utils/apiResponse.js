export const sendSuccess = (res, data, statusCode = 200, message = 'Success') => {
  res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ success: false, message });
};

export const sendPaginated = (res, data, pagination) => {
  res.status(200).json({ success: true, data, pagination });
};
