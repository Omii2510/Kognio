exports.formatINR = (amount) => {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

exports.formatINRSimple = (amount) => {
  return `₹${amount.toFixed(2)}`;
};
