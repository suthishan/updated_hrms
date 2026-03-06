exports.normalizeJson = (value) => {
  if (value === null || value === undefined || value === '') {
    return null; 
  }
  if (typeof value === 'string') {
    return JSON.parse(value);   
  }
  return value;
};
