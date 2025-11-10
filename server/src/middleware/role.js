export function requireRole(...roles) {
  return (req, res, next) => {
    const auth = req.auth;
    if (!auth || !auth.role || !roles.includes(auth.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}


