// Middleware for authentication and role checking

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }
    
    // TODO: Verify JWT token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

const isInstructor = (req, res, next) => {
  if (req.user?.role !== 'instructor') {
    return res.status(403).json({ 
      success: false, 
      message: 'Only instructors can access this resource' 
    });
  }
  next();
};

const isStudent = (req, res, next) => {
  if (req.user?.role !== 'student') {
    return res.status(403).json({ 
      success: false, 
      message: 'Only students can access this resource' 
    });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Only admins can access this resource' 
    });
  }
  next();
};

module.exports = { auth, isInstructor, isStudent, isAdmin };
