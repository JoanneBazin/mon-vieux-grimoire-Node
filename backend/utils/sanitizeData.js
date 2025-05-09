const { escape, trim } = require("validator");

const sanitizeData = (data) => {
  const sanitizedData = { ...data };

  Object.keys(sanitizedData).forEach((key) => {
    if (typeof sanitizedData[key] === "string") {
      sanitizedData[key] = escape(trim(sanitizedData[key]));
    }
  });

  return sanitizedData;
};

module.exports = sanitizeData;
