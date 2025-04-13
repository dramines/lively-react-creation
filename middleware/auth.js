
const protect = (req, res, next) => {
  // No authentication check - always allow access
  next();
};

const admin = (req, res, next) => {
  // No admin role check - always allow access
  next();
};

module.exports = { protect, admin };
