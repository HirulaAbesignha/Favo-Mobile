/**
 * Generate a fake transaction ID for payments
 * @returns {string} Transaction ID in format TXN-XXXXXXXX
 */
const generateTransactionId = () => {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `TXN-${random}`;
};

module.exports = generateTransactionId;
