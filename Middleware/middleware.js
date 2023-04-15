const SECRET_KEY = "QWERTYUIOPASDFGHJKLZXCVBNM";

const verifyToken =(req, res, next)=> {
    const token = req.headers.authorization?.split(' ')[1]
  
    if (!token) {
      return res.status(401).send('No token provided')
    }
  
    try {
      const decodedToken = jwt.verify(token, SECRET_KEY)
      req.userId = decodedToken.userId
      req.isAdmin = decodedToken.isAdmin
      next()
    } catch (err) {
      res.status(401).send('Invalid token')
    }
  }

module.exports={verifyToken}