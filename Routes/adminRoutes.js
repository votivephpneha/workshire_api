const express = require('express')
const { adminLoginController } = require('../Controller/adminController')
const { verifyToken } = require('../Middleware/middleware')
const adminRoutes = express.Router()

adminRoutes.use(express.json())


adminRoutes.post('/admin/login',adminLoginController)
adminRoutes.get('/admin-dashboard', verifyToken, (req, res) => {
    if (!req.isAdmin) {
      return res.status(401).send('Unauthorized')
    }
  
    // return admin dashboard data
  })

module.exports = adminRoutes