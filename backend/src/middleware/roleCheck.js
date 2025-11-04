import { ROLES } from '../config/constants.js';

export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }

    next();
  };
};

export const isAdmin = checkRole(ROLES.ADMIN);
export const isCitizen = checkRole(ROLES.CITIZEN);
export const isCollectionPoint = checkRole(ROLES.COLLECTION_POINT);
export const isCitizenOrAdmin = checkRole(ROLES.CITIZEN, ROLES.ADMIN);
export const isCollectionPointOrAdmin = checkRole(ROLES.COLLECTION_POINT, ROLES.ADMIN);