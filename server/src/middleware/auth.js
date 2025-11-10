import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers['authorization'];
  const bearer = typeof header === 'string' && header.startsWith('Bearer ')
    ? header.slice('Bearer '.length)
    : null;
  const token = bearer || (req.cookies && req.cookies.token);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
}


