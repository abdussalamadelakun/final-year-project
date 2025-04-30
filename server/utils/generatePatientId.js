const generatePatientId = () => {
    const random = Math.floor(100000 + Math.random() * 900000); // 6-digit number
    return `PAT-${random}`;
  };
  
  module.exports = generatePatientId;
  