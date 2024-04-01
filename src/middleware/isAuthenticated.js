import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
  const cookieToken = req.cookies.FlickQueueAuth;

  if (!cookieToken) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
};

export default isAuthenticated;