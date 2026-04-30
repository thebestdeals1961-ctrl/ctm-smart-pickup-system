/**
 * Authentication Middleware
 * Protects routes that require login
 */

const { verifyToken } = require('../utils/auth');

/**
 * Middleware to verify JWT token from Authorization header
 * Adds user info to req.user if valid
 */
function authenticateToken(req, res, next) {
  // Get token from Authorization header
  // Format: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.' 
    });
  }

  // Verify the token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ 
      error: 'Invalid or expired token.' 
    });
  }

  // Attach user info to request object
  req.user = decoded;
  next();
}

/**
 * Middleware to check if user has admin role
 * Must be used AFTER authenticateToken
 */
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Admin access required.' 
    });
  }
  next();
}

/**
 * Middleware to check if user has driver role
 * Must be used AFTER authenticateToken
 */
function requireDriver(req, res, next) {
  if (req.user.role !== 'driver' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Driver access required.' 
    });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireDriver
};
